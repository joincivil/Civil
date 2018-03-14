import BigNumber from "bignumber.js";
import { Observable } from "rxjs";
import "rxjs/add/operator/distinctUntilChanged";
import * as Web3 from "web3";
import "@joincivil/utils";

import { ContentProvider } from "../content/contentprovider";
import {
  ContentHeader,
  EthAddress,
  NewsroomContent,
  TxData,
  TwoStepEthTransaction,
  ContentId,
} from "../types";
import { isDecodedLog, createTwoStep, createTwoStepEmpty } from "../utils/contractutils";
import { CivilErrors, requireAccount } from "../utils/errors";
import { Web3Wrapper } from "../utils/web3wrapper";
import { BaseWrapper } from "./basewrapper";
import { ContentProposedArgs, NewsroomContract, NewsroomEvents } from "./generated/newsroom";

/**
 * A Newsroom can be thought of an organizational unit with a sole goal of providing content
 * in an organized way.
 *
 * Newsroom is controlled by access-control pattern, with multiple roles (see [[Roles]]) that allow governing
 * what get's published and what isn't.
 *
 * All of the logic exists on the Ethereum network, with the data of articles living outside.
 * The smart-contracts doesn't limit _where_ the articles lives, as it accepts an URI with a schema.
 * And so articles can live in IPFS, Filecoin, Whisper, or just a simple HTTP server.
 * Right now the only supported systems are HTTP and [[InMemoryProvider]] for debugging purpouses
 */
export class Newsroom extends BaseWrapper<NewsroomContract> {
  public static async deployTrusted(
    web3Wrapper: Web3Wrapper,
    contentProvider: ContentProvider,
  ): Promise<TwoStepEthTransaction<Newsroom>> {
    const txData: TxData = { from: web3Wrapper.account };
    return createTwoStep(
      web3Wrapper,
      await NewsroomContract.deployTrusted.sendTransactionAsync(web3Wrapper, txData),
      // tslint:disable no-non-null-assertion
      (receipt) => new Newsroom(
        web3Wrapper,
        contentProvider,
        NewsroomContract.atUntrusted(web3Wrapper, receipt.contractAddress!),
      ),
      // tslint:enable no-non-null-assertion
    );
  }
  public static atUntrusted(web3Wrapper: Web3Wrapper, contentProvider: ContentProvider, address: EthAddress): Newsroom {
    const instance = NewsroomContract.atUntrusted(web3Wrapper, address);
    return new Newsroom(web3Wrapper, contentProvider, instance);
  }

  private contentProvider: ContentProvider;

  private constructor(web3Wrapper: Web3Wrapper, contentProvider: ContentProvider, instance: NewsroomContract) {
    super(web3Wrapper, instance);
    this.contentProvider = contentProvider;
  }

  // TODO(nickreynolds): Add function to check if user is member of multisig that owns newsroom

  /**
   * Checks if the user is the owner of the newsroom
   * @param address Address for the ownership check, leave empty for current user
   * @throws {CivilErrors.NoUnlockedAccount} Requires the node to have at least one account if no address provided
   */
  public async isOwner(address?: EthAddress): Promise<boolean> {
    let who = address;

    if (!who) {
      who = requireAccount(this.web3Wrapper);
    }
    return this.instance.isOwner.callAsync(who);
  }

  /**
   * Checks if the user can assign roles and approve/deny content
   * Also returns true if user has director super powers
   * @param address Address for the role check, leave empty for current user
   * @throws {CivilErrors.NoUnlockedAccount} Requires the node to have at least one account if no address provided
   */
  public async isEditor(address?: EthAddress): Promise<boolean> {
    let who = address;

    if (!who) {
      who = requireAccount(this.web3Wrapper);
    }
    return this.instance.hasRole.callAsync(who, Roles.Editor);
  }

  /**
   * Checks if the user can propose content to the Newsroom
   * Also returns true if user has director super powers
   * @param address Address for the role check, leave empty for current user
   * @throws {CivilErrors.NoUnlockedAccount} Requires the node to have at least one account if no address provided
   */
  public async isReporter(address?: EthAddress): Promise<boolean> {
    let who = address;

    if (!who) {
      who = requireAccount(this.web3Wrapper);
    }
    return this.instance.hasRole.callAsync(who, Roles.Reporter);
  }

  /**
   * Sets an Access-Control-List role to a specified address
   * @param actor The address that shall be granted a role
   * @param role What privilige the address should be given
   * @throws {Civil.NoPrivileges} Requires editor privilege
   * @throws {CivilErrors.NoUnlockedAccount} Needs at least one account for editor role check
   */
  public async addRole(actor: EthAddress, role: Roles): Promise<TwoStepEthTransaction> {
    await this.requireEditor();

    return createTwoStepEmpty(
      this.web3Wrapper,
      await this.instance.addRole.sendTransactionAsync(actor, role),
    );
  }

  /**
   * Removes an Access-Control-List role to a specified address
   * Silently succeeds if the role isn't set
   * @param actor The address that shall have the role removed
   * @param role What privilege will be removed
   * @throws {Civil.NoPrivileges} Requires editor privilege
   * @throws {CivilErrors.NoUnlockedAccount} Needs at least one account for editor role check
   */
  public async removeRole(actor: EthAddress, role: Roles): Promise<TwoStepEthTransaction> {
    await this.requireEditor();

    return createTwoStepEmpty(
      this.web3Wrapper,
      await this.instance.removeRole.sendTransactionAsync(actor, role),
    );
  }

  /**
   * An unending stream of all the contenty *actively* proposed (waiting for approval/deny)
   * @param fromBlock Starting block in history for events concerning content being proposed.
   *                  Set to "latest" for only new events
   * @returns Metadata about the content from Ethereum. Use [[resolveContent]] to get actual contents
   */
  public proposedContent(fromBlock: number|"latest" = 0): Observable<ContentHeader> {
    return this.instance
      .ContentProposedStream({}, { fromBlock })
      .distinctUntilChanged((a, b) => {
        return a.blockNumber === b.blockNumber && a.logIndex === b.logIndex;
      }) // https://github.com/ethereum/web3.js/issues/573
      .map((e) => e.args.id)
      .concatFilter(async (id) => this.instance.isProposed.callAsync(id))
      .concatMap(async (id) => this.loadArticleHeader(id));
  }

  /**
   * An unending stream of all the content that is approved to be displayed in the Newsroom
   * @param fromBlock Starting block in history for events.
   *                  Set to "latest" to only listen for new events
   * @returns Metadata about the content from Ethereum. Use [[resolveContent]] to get actual contents
   */
  public approvedContent(fromBlock: number|"latest" = 0): Observable<ContentHeader> {
    return this.instance
      .ContentApprovedStream({}, { fromBlock })
      .distinctUntilChanged((a, b) => {
        return a.blockNumber === b.blockNumber && a.logIndex === b.logIndex;
      }) // https://github.com/ethereum/web3.js/issues/573
      .map((e) => e.args.id)
      .concatMap(async (id) => this.loadArticleHeader(id));
  }

  /**
   * Loads everything concerning one article needed to read it fully.
   * Accesess both Ethereum network as well as the active ContentProvider
   * @param articleId Id of the article that you want to read
   */
  public async loadArticle(articleId: number|BigNumber): Promise<NewsroomContent> {
    const header = await this.loadArticleHeader(articleId);
    return this.resolveContent(header);
  }

  /**
   * Accesses the Ethereum network and loads basic metatadata about the article
   * @param articleId Id of the article whose metadata you need
   */
  public async loadArticleHeader(articleId: number|BigNumber): Promise<ContentHeader> {
    const id = new BigNumber(articleId);

    const [author, timestamp, uri] = await Promise.all([
      this.instance.author.callAsync(id),
      this.instance.timestamp.callAsync(id),
      this.instance.uri.callAsync(id),
    ]);
    return {
      id: id.toNumber(),
      author,
      timestamp: new Date(timestamp.toNumber()),
      uri,
    };
  }

  /**
   * Stores your `content` in the file system (currently debug [[InMemoryProvider]]) and
   * publishes a link to that content on Ethereum network.
   * @param content The the data that you want to store, in the future, probably a JSON
   * @returns An id assigned on Ethereum to the proposed content
   */
  public async proposeContent(content: string): Promise<TwoStepEthTransaction<ContentId>> {
    const uri = await this.contentProvider.put(content);
    return this.proposeUri(uri);
  }

  /**
   * Proposes the given uri into Ethereum's Newsroom,
   * This is low-level call and assumes you stored your content on your own
   * @param uri The link that you want to propose
   * @returns An id assigned on Ethereum to the uri
   */
  public async proposeUri(uri: string): Promise<TwoStepEthTransaction<ContentId>> {
    await this.requireReporter();

    return createTwoStep(
      this.web3Wrapper,
      await this.instance.proposeContent.sendTransactionAsync(uri),
      (receipt) => {
        for (const log of receipt.logs) {
          if (isDecodedLog(log) && log.event === NewsroomEvents.ContentProposed) {
            return (log as Web3.DecodedLogEntry<ContentProposedArgs>).args.id.toNumber();
          }
        }
        throw new Error("Propose transaction succeeded, but didn't return ContentProposed log");
      }
    );
  }

  /**
   * Allows the Editor to approve content that is waiting to be approved / denied
   * @param contentId The id of the proposed content to be denied
   */
  public async approveContent(contentId: ContentId|BigNumber): Promise<TwoStepEthTransaction> {
    await this.requireEditor();

    return createTwoStepEmpty(
      this.web3Wrapper,
      await this.instance.approveContent.sendTransactionAsync(new BigNumber(contentId)),
    );
  }

  /**
   * Allows the Editor to deny content that is waiting to be approverd / denied
   * @param contentId The id of the proposed content to be denied
   */
  public async denyContent(contentId: number|BigNumber): Promise<TwoStepEthTransaction> {
    await this.requireEditor();

    return createTwoStepEmpty(
      this.web3Wrapper,
      await this.instance.denyContent.sendTransactionAsync(new BigNumber(contentId))
    );
  }

  /**
   * Converts metadata gathered from Ethereum network into a fully fledged Article all the
   * text needed for display
   * @param header Metadata you get from Ethereum
   */
  public async resolveContent(header: ContentHeader): Promise<NewsroomContent> {
    // TODO(ritave): Choose ContentProvider based on schema
    const content = await this.contentProvider.get(header.uri);
    return {
      id: header.id,
      author: header.author,
      content,
      timestamp: header.timestamp,
      uri: header.uri,
    };
  }

  private async requireEditor(): Promise<void> {
    if (!(await this.isEditor())) {
      throw new Error(CivilErrors.NoPrivileges);
    }
  }

  private async requireReporter(): Promise<void> {
    if (!(await this.isReporter())) {
      throw new Error(CivilErrors.NoPrivileges);
    }
  }
}

// TODO(ritave): generate roles from smart-contract
/**
 * Roles that are supported by the Newsroom
 * - Editor can approve or deny contant, as well as assigning roles to actors
 * - Reported who can propose content for the Editors to approve
 */
export enum Roles {
  Editor = "editor",
  Reporter = "reporter",
}
