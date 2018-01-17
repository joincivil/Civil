import BigNumber from "bignumber.js";
import { Observable } from "rxjs";
import "rxjs/add/operator/distinctUntilChanged";
import * as Web3 from "web3";

import { artifacts } from "../artifacts";
import { ContentProvider } from "../content/providers/contentprovider";
import { InMemoryProvider } from "../content/providers/inmemoryprovider";
import { ContentHeader, EthAddress, NewsroomContent } from "../types";
import { AbiDecoder } from "../utils/abidecoder";
import { isDecodedLog } from "../utils/contractutils";
import { CivilErrors, requireAccount } from "../utils/errors";
import { bindAll, promisify } from "../utils/language";
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
  private contentProvider: ContentProvider;

  /// Internal
  constructor(web3Wrapper: Web3Wrapper, instance: NewsroomContract, abiDecoder: AbiDecoder) {
    super(web3Wrapper, instance, abiDecoder);
    this.contentProvider = new InMemoryProvider(web3Wrapper);
    bindAll(this, ["constructor"]);
  }

  /**
   * @returns Addess of the deployed Newsroom
   */
  public get address() {
    return this.instance.address;
  }

  /**
   * Checks if the `address` has superpowers allowing to do anything with the Newsroom.
   * publishing, appoving, denying, etc.
   * @param address Address for the check, leave empty for the current user check
   * @throws {CivilErrors.NoUnlockedAccount} Requires the node to have at least one account if no address provided
   */
  public isDirector(address?: EthAddress): Promise<boolean> {
    if (!address) {
      requireAccount(this.web3Wrapper);
      address = this.web3Wrapper.account!!;
    }
    return this.instance.isSuperuser.callAsync(address);
  }

  /**
   * Checks if the user can assign roles and approve/deny content
   * Also returns true if user has director super powers
   * @param address Address for the role check, leave empty for current user
   * @throws {CivilErrors.NoUnlockedAccount} Requires the node to have at least one account if no address provided
   */
  public async isEditor(address?: EthAddress): Promise<boolean> {
    if (await this.isDirector(address)) {
      return true;
    }

    if (!address) {
      requireAccount(this.web3Wrapper);
      address = this.web3Wrapper.account!!;
    }
    return await this.instance.hasRole.callAsync(address, Roles.Editor);
  }

  /**
   * Checks if the user can propose content to the Newsroom
   * Also returns true if user has director super powers
   * @param address Address for the role check, leave empty for current user
   * @throws {CivilErrors.NoUnlockedAccount} Requires the node to have at least one account if no address provided
   */
  public async isReporter(address?: EthAddress): Promise<boolean> {
    if (await this.isDirector(address)) {
      return true;
    }

    if (!address) {
      requireAccount(this.web3Wrapper);
      address = this.web3Wrapper.account!!;
    }
    return await this.instance.hasRole.callAsync(address, Roles.Reporter);
  }

  /**
   * Sets an Access-Control-List role to a specified address
   * @param actor The address that shall be granted a role
   * @param role What privilige the address should be given
   * @throws {Civil.NoPrivileges} Requires editor privilege
   * @throws {CivilErrors.NoUnlockedAccount} Needs at least one account for editor role check
   */
  public async addRole(actor: EthAddress, role: Roles) {
    if (role === Roles.Director) {
      await this.requireDirector();
      return await this.instance.addDirector.sendTransactionAsync(actor);
    } else {
      await this.requireEditor();
      return await this.instance.addRole.sendTransactionAsync(actor, role);
    }
  }

  /**
   * Removes an Access-Control-List role to a specified address
   * Silently succeeds if the role isn't set
   * @param actor The address that shall have the role removed
   * @param role What privilege will be removed
   * @throws {Civil.NoPrivileges} Requires editor privilege
   * @throws {CivilErrors.NoUnlockedAccount} Needs at least one account for editor role check
   */
  public async removeRole(actor: EthAddress, role: Roles) {
    if (role === Roles.Director) {
      await this.requireDirector();
      return await this.instance.removeDirector.sendTransactionAsync(actor);
    } else {
      await this.requireEditor();
      return await this.instance.removeRole.sendTransactionAsync(actor, role);
    }
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
      .concatFilter(this.instance.isProposed.callAsync)
      .concatMap(this.idToContentHeader);
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
      .concatMap(this.idToContentHeader);
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

    const receipt = await this.web3Wrapper.getReceipt(txHash);
    const decoded = receipt.logs.map((x) => this.abiDecoder.tryToDecodeLogOrNoop<any>(x));
    for (const log of decoded) {
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

  private async isProposed(id: number|string|BigNumber) {
    return await this.instance.isProposed.callAsync(new BigNumber(id));
  }

  private async idToContentHeader(id: BigNumber): Promise<ContentHeader> {
    const data = await Promise.all([
      this.instance.author.callAsync(id),
      this.instance.timestamp.callAsync(id),
      this.instance.uri.callAsync(id),
    ]);
    return {
      id: id.toNumber(),
      author: data[0],
      timestamp: new Date(data[1].toNumber()),
      uri: data[2],
    };
  }

  private async requireEditor() {
    if (!(await this.isEditor())) {
      throw new Error(CivilErrors.NoPrivileges);
    }
  }

  private async requireDirector() {
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
