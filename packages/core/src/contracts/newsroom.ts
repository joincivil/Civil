import BigNumber from "bignumber.js";
import { Observable } from "rxjs";
import "@joincivil/utils";

import { ContentProvider } from "../content/contentprovider";
import { CivilErrors, requireAccount } from "../utils/errors";
import { Web3Wrapper } from "../utils/web3wrapper";
import { BaseWrapper } from "./basewrapper";
import {
  NewsroomRoles,
  TwoStepEthTransaction,
  TxData,
  EthAddress,
  ContentId,
  ContentHeader,
  NewsroomContent,
  SignedRevision,
} from "../types";
import { NewsroomMultisigProxy } from "./generated/multisig/newsroom";
import { MultisigProxyTransaction } from "./multisig/basemultisigproxy";
import { NewsroomFactoryContract, NewsroomFactory } from "./generated/wrappers/newsroom_factory";
import { createTwoStepTransaction, createTwoStepSimple, findEvents, findEventOrThrow } from "./utils/contracts";
import { NewsroomContract, Newsroom as Events } from "./generated/wrappers/newsroom";

/**
 * A Newsroom can be thought of an organizational unit with a sole goal of providing content
 * in an organized way.
 *
 * Newsroom is controlled by access-control pattern, with multiple roles (see [[NewsroomRoles]]) that allow governing
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
    newsroomName: string,
  ): Promise<TwoStepEthTransaction<Newsroom>> {
    const txData: TxData = { from: web3Wrapper.account };

    const factory = NewsroomFactoryContract.singletonTrusted(web3Wrapper);
    if (!factory) {
      throw new Error(CivilErrors.UnsupportedNetwork);
    }

    return createTwoStepTransaction(
      web3Wrapper,
      await factory.create.sendTransactionAsync(newsroomName, [web3Wrapper.account!], new BigNumber(1), txData),
      async factoryReceipt => {
        const createdNewsroom = findEvents<NewsroomFactory.Logs.ContractInstantiation>(
          factoryReceipt,
          NewsroomFactory.Events.ContractInstantiation,
        ).find(log => log.address === factory.address);

        if (!createdNewsroom) {
          throw new Error("No Newsroom created during deployment through factory");
        }

        const contract = NewsroomContract.atUntrusted(web3Wrapper, createdNewsroom.args.instantiation);
        const multisigProxy = await NewsroomMultisigProxy.create(web3Wrapper, contract);
        return new Newsroom(web3Wrapper, contentProvider, contract, multisigProxy);
      },
    );
  }

  public static async deployNonMultisigTrusted(
    web3Wrapper: Web3Wrapper,
    contentProvider: ContentProvider,
    newsroomName: string,
  ): Promise<TwoStepEthTransaction<Newsroom>> {
    const txData: TxData = { from: web3Wrapper.account };
    return createTwoStepTransaction(
      web3Wrapper,
      await NewsroomContract.deployTrusted.sendTransactionAsync(web3Wrapper, newsroomName, txData),
      async receipt => Newsroom.atUntrusted(web3Wrapper, contentProvider, receipt.contractAddress!),
    );
  }

  public static async atUntrusted(
    web3Wrapper: Web3Wrapper,
    contentProvider: ContentProvider,
    address: EthAddress,
  ): Promise<Newsroom> {
    const instance = NewsroomContract.atUntrusted(web3Wrapper, address);
    const multisigProxy = await NewsroomMultisigProxy.create(web3Wrapper, instance);
    return new Newsroom(web3Wrapper, contentProvider, instance, multisigProxy);
  }

  private multisigProxy: NewsroomMultisigProxy;
  private contentProvider: ContentProvider;

  private constructor(
    web3Wrapper: Web3Wrapper,
    contentProvider: ContentProvider,
    instance: NewsroomContract,
    multisigProxy: NewsroomMultisigProxy,
  ) {
    super(web3Wrapper, instance);
    this.contentProvider = contentProvider;
    this.multisigProxy = multisigProxy;
  }

  /**
   * Returns a list of Board of Directors with superuser powers over this
   * newsroom.
   */
  public async owners(): Promise<EthAddress[]> {
    return this.multisigProxy.owners();
  }

  /**
   * Returns the address of the multisig that controls this newsroom if one is defined
   */
  public async getMultisigAddress(): Promise<EthAddress | undefined> {
    return this.multisigProxy.getMultisigAddress();
  }

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
    return this.multisigProxy.isOwner(who);
  }

  public editors(): Observable<EthAddress> {
    return this.instance
      .RoleAddedStream({ role: NewsroomRoles.Editor }, { fromBlock: 0 })
      .map(e => e.args.grantee)
      .concatFilter(async e => this.isEditor(e));
  }

  public reporters(): Observable<EthAddress> {
    return this.instance
      .RoleAddedStream({ role: NewsroomRoles.Reporter }, { fromBlock: 0 })
      .map(e => e.args.grantee)
      .concatFilter(async e => this.isReporter(e));
  }
  /**
   * Checks if the user can assign roles and approve/deny content
   * Also returns true if user has director super powers
   * @param address Address for the role check, leave empty for current user
   * @throws {CivilErrors.NoUnlockedAccount} Requires the node to have at least one account if no address provided
   */
  public async isEditor(address?: EthAddress): Promise<boolean> {
    if (await this.isOwner(address)) {
      return true;
    }
    let who = address;

    if (!who) {
      who = requireAccount(this.web3Wrapper);
    }
    return this.instance.hasRole.callAsync(who, NewsroomRoles.Editor);
  }

  /**
   * Checks if the user can propose content to the Newsroom
   * Also returns true if user has director super powers
   * @param address Address for the role check, leave empty for current user
   * @throws {CivilErrors.NoUnlockedAccount} Requires the node to have at least one account if no address provided
   */
  public async isReporter(address?: EthAddress): Promise<boolean> {
    if (await this.isOwner(address)) {
      return true;
    }
    let who = address;

    if (!who) {
      who = requireAccount(this.web3Wrapper);
    }
    return this.instance.hasRole.callAsync(who, NewsroomRoles.Reporter);
  }

  /**
   * Sets an Access-Control-List role to a specified address
   * @param actor The address that shall be granted a role
   * @param role What privilige the address should be given
   * @throws {Civil.NoPrivileges} Requires editor privilege
   * @throws {CivilErrors.NoUnlockedAccount} Needs at least one account for editor role check
   */
  public async addRole(actor: EthAddress, role: NewsroomRoles): Promise<MultisigProxyTransaction> {
    if (await this.isOwner()) {
      return this.multisigProxy.addRole.sendTransactionAsync(actor, role);
    }

    await this.requireEditor();
    return createTwoStepSimple(this.web3Wrapper, await this.instance.addRole.sendTransactionAsync(actor, role));
  }

  /**
   * Removes an Access-Control-List role to a specified address
   * Silently succeeds if the role isn't set
   * @param actor The address that shall have the role removed
   * @param role What privilege will be removed
   * @throws {Civil.NoPrivileges} Requires editor privilege
   * @throws {CivilErrors.NoUnlockedAccount} Needs at least one account for editor role check
   */
  public async removeRole(actor: EthAddress, role: NewsroomRoles): Promise<MultisigProxyTransaction> {
    if (await this.isOwner()) {
      return this.multisigProxy.removeRole.sendTransactionAsync(actor, role);
    }

    await this.requireEditor();
    return createTwoStepSimple(this.web3Wrapper, await this.instance.removeRole.sendTransactionAsync(actor, role));
  }

  public async getName(): Promise<string> {
    return this.instance.name.callAsync();
  }

  /**
   * Changes the name of the Newsroom.
   * The name can be any string, but when applying to a TCR, it must be unique in that TCR
   * @param newName The new name of this Newsroom
   * @throws {CivilErrors.NoPrivileges} Requires owner permission
   * @throws {CivilErrors.NoUnlockedAccount} Needs the unlocked to check privileges
   */
  public async setName(newName: string): Promise<MultisigProxyTransaction> {
    await this.requireOwner();

    return this.multisigProxy.setName.sendTransactionAsync(newName);
  }

  /**
   * An unending stream of all the revisions
   * @param fromBlock Starting block in history for events concerning content being proposed.
   *                  Set to "latest" for only new events
   * @returns Metadata about the content from Ethereum. Use [[resolveContent]] to get actual contents
   */
  public revisions(fromBlock: number | "latest" = 0): Observable<ContentHeader> {
    return this.instance
      .RevisionPublishedStream({}, { fromBlock })
      .map(e => e.args.id)
      .concatMap(async id => this.loadArticleHeader(id));
  }

  /**
   * An unending stream of all names this Newsroom had ever had.
   * @param fromBlock Starting block in history for events.
   *                  Set to "latest" to only listen for new events
   * @returns Name history of this Newsroom
   */
  public nameChanges(fromBlock: number | "latest" = 0): Observable<string> {
    return this.instance.NameChangedStream({}, { fromBlock }).map(e => e.args.newName);
  }

  /**
   * Loads everything concerning one article needed to read it fully.
   * Accesess both Ethereum network as well as the active ContentProvider
   * @param articleId Id of the article that you want to read
   */
  public async loadArticle(articleId: number | BigNumber): Promise<NewsroomContent> {
    const header = await this.loadArticleHeader(articleId);
    return this.resolveContent(header);
  }

  /**
   * Accesses the Ethereum network and loads basic metatadata about the article
   * @param articleId Id of the article whose metadata you need
   */
  public async loadArticleHeader(articleId: number | BigNumber): Promise<ContentHeader> {
    const id = new BigNumber(articleId);

    const [contentHash, uri, timestamp] = await this.instance.content.callAsync(id);
    return {
      id: id.toNumber(),
      timestamp: new Date(timestamp.toNumber()),
      uri,
      contentHash,
    };
  }

  /**
   * Allows editor to publish a revision on the content storage and record it in the
   * Blockchain Newsroom.
   * @param content The content that should be put in the content provider
   * @returns An id assigned on Ethereum to the uri
   */
  public async publishRevision(content: string): Promise<TwoStepEthTransaction<ContentId>> {
    await this.requireEditor();
    const contentHeader = await this.contentProvider.put(content);

    return createTwoStepTransaction(
      this.web3Wrapper,
      await this.instance.publishRevision.sendTransactionAsync(contentHeader.uri, contentHeader.contentHash),
      receipt => {
        return findEventOrThrow<Events.Logs.RevisionPublished>(
          receipt,
          Events.Events.RevisionPublished,
        ).args.id.toNumber();
      },
    );
  }

  public async publishRevisionSigned(
    content: string,
    signedData: SignedRevision,
  ): Promise<TwoStepEthTransaction<ContentId>> {
    await this.requireEditor();
    const contentHeader = await this.contentProvider.put(content);

    return createTwoStepTransaction(
      this.web3Wrapper,
      await this.instance.publishRevisionSigned.sendTransactionAsync(
        contentHeader.uri,
        signedData.contentHash,
        signedData.author,
        signedData.signature,
      ),
      receipt => {
        return findEventOrThrow<Events.Logs.RevisionPublished>(
          receipt,
          Events.Events.RevisionPublished,
        ).args.id.toNumber();
      },
    );
  }

  public async signRevision(content: string): Promise<SignedRevision> {
    const author = requireAccount(this.web3Wrapper);

    const contentHash = this.web3Wrapper.sha3String(content);
    const message = this.web3Wrapper.soliditySha3(["address", "bytes32"], [this.address, contentHash]);

    const { signature } = await this.web3Wrapper.signMessage(message, author);
    return {
      author,
      contentHash,
      signature,
      newsroomAddress: this.address,
    };
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
      contentHash: header.contentHash,
    };
  }

  private async requireEditor(): Promise<void> {
    await this.requireRole(NewsroomRoles.Editor);
  }

  private async requireRole(role: NewsroomRoles): Promise<void> {
    const account = requireAccount(this.web3Wrapper);
    if ((await this.instance.owner.callAsync()) !== account) {
      if (!(await this.instance.hasRole.callAsync(account, role))) {
        throw new Error(CivilErrors.NoPrivileges);
      }
    }
  }

  private async requireOwner(): Promise<void> {
    if (!(await this.isOwner())) {
      throw new Error(CivilErrors.NoPrivileges);
    }
  }
}
