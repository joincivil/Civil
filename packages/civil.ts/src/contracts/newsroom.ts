import BigNumber from "bignumber.js";
import { Observable } from "rxjs";
import "rxjs/add/operator/distinctUntilChanged";
import * as Web3 from "web3";

import { ContentProvider } from "../content/providers/contentprovider";
import { InMemoryProvider } from "../content/providers/inmemoryprovider";
import { CivilTransactionReceipt, ContentHeader, EthAddress, NewsroomContent, TxData } from "../types";
import { isDecodedLog } from "../utils/contractutils";
import { CivilErrors, requireAccount } from "../utils/errors";
import "../utils/rxjs";
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
  public static async deployTrusted(web3Wrapper: Web3Wrapper): Promise<Newsroom> {
    const txData: TxData = { from: web3Wrapper.account };
    const instance = await NewsroomContract.deployTrusted.sendTransactionAsync(web3Wrapper, txData);
    return new Newsroom(web3Wrapper, instance);
  }
  public static atUntrusted(web3Wrapper: Web3Wrapper, address: EthAddress): Newsroom {
    const instance = NewsroomContract.atUntrusted(web3Wrapper, address);
    return new Newsroom(web3Wrapper, instance);
  }

  private contentProvider: ContentProvider;

  private constructor(web3Wrapper: Web3Wrapper, instance: NewsroomContract) {
    super(web3Wrapper, instance);
    this.contentProvider = new InMemoryProvider(web3Wrapper);
  }

  /**
   * Checks if the `address` has superpowers allowing to do anything with the Newsroom.
   * publishing, appoving, denying, etc.
   * @param address Address for the check, leave empty for the current user check
   * @throws {CivilErrors.NoUnlockedAccount} Requires the node to have at least one account if no address provided
   */
  public async isDirector(address?: EthAddress): Promise<boolean> {
    let who = address;
    if (!who) {
      who = requireAccount(this.web3Wrapper);
    }
    return this.instance.isSuperuser.callAsync(who);
  }

  /**
   * Checks if the user can assign roles and approve/deny content
   * Also returns true if user has director super powers
   * @param address Address for the role check, leave empty for current user
   * @throws {CivilErrors.NoUnlockedAccount} Requires the node to have at least one account if no address provided
   */
  public async isEditor(address?: EthAddress): Promise<boolean> {
    let who = address;
    if (await this.isDirector(who)) {
      return true;
    }

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
    if (await this.isDirector(who)) {
      return true;
    }

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
  public async addRole(actor: EthAddress, role: Roles): Promise<CivilTransactionReceipt> {
    let txhash;
    if (role === Roles.Director) {
      await this.requireDirector();
      txhash = await this.instance.addDirector.sendTransactionAsync(actor);
    } else {
      await this.requireEditor();
      txhash = await this.instance.addRole.sendTransactionAsync(actor, role);
    }
    return this.web3Wrapper.awaitReceipt(txhash);
  }

  /**
   * Removes an Access-Control-List role to a specified address
   * Silently succeeds if the role isn't set
   * @param actor The address that shall have the role removed
   * @param role What privilege will be removed
   * @throws {Civil.NoPrivileges} Requires editor privilege
   * @throws {CivilErrors.NoUnlockedAccount} Needs at least one account for editor role check
   */
  public async removeRole(actor: EthAddress, role: Roles): Promise<CivilTransactionReceipt> {
    let txhash;
    if (role === Roles.Director) {
      await this.requireDirector();
      txhash = await this.instance.removeDirector.sendTransactionAsync(actor);
    } else {
      await this.requireEditor();
      txhash = await this.instance.removeRole.sendTransactionAsync(actor, role);
    }
    return this.web3Wrapper.awaitReceipt(txhash);
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
      .concatMap(async (id) => this.idToContentHeader(id));
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
      .concatMap(async (id) => this.idToContentHeader(id));
  }

  /**
   * Stores your `content` in the file system (currently debug [[InMemoryProvider]]) and
   * publishes a link to that content on Ethereum network.
   * @param content The the data that you want to store, in the future, probably a JSON
   * @returns An id assigned on Ethereum to the proposed content
   */
  public async propose(content: string): Promise<number> {
    const uri = await this.contentProvider.put(content);
    const txHash = await this.instance.proposeContent.sendTransactionAsync(uri);
    const receipt = await this.web3Wrapper.awaitReceipt(txHash);

    for (const log of receipt.logs) {
      if (isDecodedLog(log) && log.event === NewsroomEvents.ContentProposed) {
        return (log as Web3.DecodedLogEntry<ContentProposedArgs>).args.id.toNumber();
      }
    }
    throw new Error("Propose transaction succeeded, but didn't return ContentProposed log");
  }

  /**
   * Converts metadata gathered from Ethereum network into a fully fledged Article all the
   * text needed for display
   * @param header Metadata you get from Ethereum
   */
  public async resolveContent(header: ContentHeader): Promise<NewsroomContent> {
    const content = await this.contentProvider.get(header.uri);
    return {
      id: header.id,
      author: header.author,
      content,
      timestamp: header.timestamp,
      uri: header.uri,
    };
  }

  private async idToContentHeader(id: BigNumber): Promise<ContentHeader> {
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

  private async requireEditor(): Promise<void> {
    if (!(await this.isEditor())) {
      throw new Error(CivilErrors.NoPrivileges);
    }
  }

  private async requireDirector(): Promise<void> {
    if (!(await this.isDirector())) {
      throw new Error(CivilErrors.NoPrivileges);
    }
  }
}

// TODO(ritave): generate roles from smart-contract
/**
 * Roles that are supported by the Newsroom
 * - Director has full access to everything
 * - Editor can approve or deny contant, as well as assigning roles to actors
 * - Reported who can propose content for the Editors to approve
 */
export enum Roles {
  Director = "director",
  Editor = "editor",
  Reporter = "reporter",
}
