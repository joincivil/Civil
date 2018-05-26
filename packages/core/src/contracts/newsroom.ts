// import "@joincivil/utils";
import {
  hashContent,
  hashPersonalMessage,
  is0x0Address,
  is0x0Hash,
  prepareNewsroomMessage,
  recoverSigner,
} from "@joincivil/utils";
import BigNumber from "bignumber.js";
import { Observable } from "rxjs";
import { ContentProvider } from "../content/contentprovider";
import {
  ApprovedRevision,
  ContentId,
  EthAddress,
  EthContentHeader,
  Hex,
  NewsroomContent,
  NewsroomData,
  NewsroomRoles,
  NewsroomWrapper,
  RevisionId,
  StorageHeader,
  TwoStepEthTransaction,
  TxData,
  Uri,
} from "../types";
import { CivilErrors, requireAccount } from "../utils/errors";
import { EthApi } from "../utils/ethapi";
import { BaseWrapper } from "./basewrapper";
import { NewsroomMultisigProxy } from "./generated/multisig/newsroom";
import { Newsroom as Events, NewsroomContract } from "./generated/wrappers/newsroom";
import { NewsroomFactory, NewsroomFactoryContract } from "./generated/wrappers/newsroom_factory";
import { MultisigProxyTransaction } from "./multisig/basemultisigproxy";
import { createTwoStepSimple, createTwoStepTransaction, findEventOrThrow, findEvents } from "./utils/contracts";

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
  //#region constructors
  public static async deployTrusted(
    ethApi: EthApi,
    contentProvider: ContentProvider,
    newsroomName: string,
    charterUri: Uri = "",
    charterHash: Hex = "",
  ): Promise<TwoStepEthTransaction<Newsroom>> {
    if ((charterUri.length === 0) !== (charterHash.length === 0)) {
      throw new Error("Both charter URI and Hash need to be set, or both empty");
    }
    const txData: TxData = { from: ethApi.account };

    const factory = NewsroomFactoryContract.singletonTrusted(ethApi);
    if (!factory) {
      throw new Error(CivilErrors.UnsupportedNetwork);
    }

    return createTwoStepTransaction(
      ethApi,
      await factory.create.sendTransactionAsync(
        newsroomName,
        charterUri,
        charterHash,
        [ethApi.account!],
        new BigNumber(1),
        txData,
      ),
      async factoryReceipt => {
        const createdNewsroom = findEvents<NewsroomFactory.Logs.ContractInstantiation>(
          factoryReceipt,
          NewsroomFactory.Events.ContractInstantiation,
        ).find(log => log.address === factory.address);

        if (!createdNewsroom) {
          throw new Error("No Newsroom created during deployment through factory");
        }

        const contract = NewsroomContract.atUntrusted(ethApi, createdNewsroom.args.instantiation);
        const owner = await contract.owner.callAsync();
        if (!(await NewsroomMultisigProxy.isAddressMultisigWallet(ethApi, owner))) {
          // TODO(tobek) Temporary while transitioning from non-multisig support
          // TODO(tobek) Confirm that this check is necessary - I think `deployTrusted` actually only creates multisig newsrooms
          throw new Error(
            "Newsroom owner " + owner + " is not a multisig wallet - non-multisig newsrooms are no longer supported.",
          );
        }
        const multisigProxy = await NewsroomMultisigProxy.create(ethApi, contract, owner);
        return new Newsroom(ethApi, contentProvider, contract, multisigProxy);
      },
    );
  }

  public static async atUntrusted(
    ethApi: EthApi,
    contentProvider: ContentProvider,
    address: EthAddress,
  ): Promise<Newsroom> {
    const instance = NewsroomContract.atUntrusted(ethApi, address);
    const owner = await instance.owner.callAsync();

    let multisigProxy;
    // TODO(tobek) Temporary check while transitioning from non-multisig support
    if (await NewsroomMultisigProxy.isAddressMultisigWallet(ethApi, owner)) {
      multisigProxy = await NewsroomMultisigProxy.create(ethApi, instance, owner);
    } else {
      console.warn(
        'Newsroom "' +
          (await instance.name.callAsync()) +
          '" at ' +
          instance.address +
          " is owned by " +
          owner +
          ", which is not a multisig wallet. Non-multisig newsrooms are no longer supported and some stuff won't work.",
      );
      multisigProxy = await NewsroomMultisigProxy.create(ethApi, instance);
    }

    return new Newsroom(ethApi, contentProvider, instance, multisigProxy);
  }

  private multisigProxy: NewsroomMultisigProxy;
  private contentProvider: ContentProvider;

  private constructor(
    ethApi: EthApi,
    contentProvider: ContentProvider,
    instance: NewsroomContract,
    multisigProxy: NewsroomMultisigProxy,
  ) {
    super(ethApi, instance);
    this.contentProvider = contentProvider;
    this.multisigProxy = multisigProxy;
  }
  //#endregion

  //#region streams
  public editors(): Observable<EthAddress> {
    return this.instance
      .RoleAddedStream({ role: NewsroomRoles.Editor }, { fromBlock: 0 })
      .map(e => e.args.grantee)
      .concatFilter(async e => this.isEditor(e));
  }

  /**
   * An unending stream of all the content, both signed as well as unsigned.
   * @param fromBlock Starting block in history for events concerning content being proposed.
   *                  Set to "latest" for only new events
   * @returns Metadata about the content from Ethereum. Use [[resolveContent]] to get actual contents
   */
  public content(fromBlock: number | "latest" = 0): Observable<EthContentHeader> {
    return this.instance
      .ContentPublishedStream({}, { fromBlock })
      .map(e => e.args.contentId)
      .concatMap(this.loadContentHeader.bind(this));
  }

  /**
   * An unending stream of all revsions
   * @param contentId Optional parameter to get revisions of only specific content
   * @param fromBlock Starting block in history for events concerning content being proposed.
   *                  Set to "latest" for only new events
   * @returns Metadata about the content from Ethereum. Use [[resolveContent]] to get actual contents
   */
  public revisions(
    contentId?: number | BigNumber | undefined,
    fromBlock: number | "latest" = 0,
  ): Observable<EthContentHeader> {
    const myContentId = contentId ? new BigNumber(contentId) : undefined;
    return this.instance
      .RevisionUpdatedStream({ contentId: myContentId }, { fromBlock })
      .concatMap(async e => this.loadContentHeader(e.args.contentId, e.args.revisionId));
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
  //#endregion

  //#region views

  /**
   * Returns NewsroomWrapper (address + data) for this newsroom
   */
  public async getNewsroomWrapper(): Promise<NewsroomWrapper> {
    const data = await this.getNewsroomData();
    return {
      address: this.instance.address,
      data,
    };
  }

  /**
   * Returns NewsroomData for this newsroom
   */
  public async getNewsroomData(): Promise<NewsroomData> {
    const name = await this.getName();
    const owners = await this.owners();
    const charter = await this.getCharter();
    return {
      name,
      owners,
      charter,
    };
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
      who = requireAccount(this.ethApi);
    }
    return this.multisigProxy.isOwner(who);
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
      who = requireAccount(this.ethApi);
    }
    return this.instance.hasRole.callAsync(who, NewsroomRoles.Editor);
  }

  public async getCharter(): Promise<NewsroomContent | undefined> {
    return this.loadArticle(0);
  }

  /**
   * Loads everything concerning one article needed to read it fully.
   * Accesess both Ethereum network as well as the active ContentProvider
   * @param articleId Id of the article that you want to read
   */
  public async loadArticle(articleId: number | BigNumber): Promise<NewsroomContent | undefined> {
    const header = await this.loadContentHeader(articleId);
    if (!is0x0Hash(header.contentHash)) {
      return this.resolveContent(header);
    } else {
      return undefined;
    }
  }

  /**
   * Converts metadata gathered from Ethereum network into a fully fledged Article all the
   * text needed for display
   * @param header Metadata you get from Ethereum
   */
  public async resolveContent(header: EthContentHeader): Promise<NewsroomContent> {
    // TODO(ritave): Choose ContentProvider based on schema
    const content = await this.contentProvider.get(header);
    return {
      ...header,
      content,
    };
  }

  /**
   * Accesses the Ethereum network and loads basic metatadata about the content
   * @param articleId Id of the article whose metadata you need
   */
  public async loadContentHeader(
    contentId: number | BigNumber,
    revisionId?: number | BigNumber,
  ): Promise<EthContentHeader> {
    const myContentId = this.ethApi.toBigNumber(contentId);
    let contentHash: string;
    let uri: string;
    let timestamp: BigNumber;
    let author: EthAddress;
    let signature: string;
    if (revisionId) {
      const myRevisionId = this.ethApi.toBigNumber(revisionId);
      [contentHash, uri, timestamp, author, signature] = await this.instance.getRevision.callAsync(
        myContentId,
        myRevisionId,
      );
    } else {
      [contentHash, uri, timestamp, author, signature] = await this.instance.getContent.callAsync(myContentId);
    }
    return {
      contentId: myContentId.toNumber(),
      timestamp: new Date(timestamp.toNumber()),
      uri,
      contentHash,
      author,
      signature,
      verifySignature: () => {
        if (is0x0Address(author)) {
          return false;
        }
        const message = prepareNewsroomMessage(this.address, contentHash);
        const hashedPersonal = hashPersonalMessage(message);
        const recovered = recoverSigner({ signature, messageHash: hashedPersonal.messageHash });
        if (recovered !== author) {
          throw new Error(`The signature for ${contentId} is invalid`);
        }
        return true;
      },
    };
  }

  public async getName(): Promise<string> {
    return this.instance.name.callAsync();
  }
  //#endregion

  //#region mutators
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
    return createTwoStepSimple(this.ethApi, await this.instance.addRole.sendTransactionAsync(actor, role));
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
    return createTwoStepSimple(this.ethApi, await this.instance.removeRole.sendTransactionAsync(actor, role));
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
   * Allows editor to publish content on the ethereum storage and record it in the
   * Blockchain Newsroom.
   * The content can also be pre-approved by the author through their signature using their private key
   * @param content The content that should be put in the content provider
   * @param signedData An object representing author's approval concerning this content
   * @returns An id assigned on Ethereum to the uri
   */
  public async publishContent(
    content: string,
    signedData?: ApprovedRevision,
  ): Promise<TwoStepEthTransaction<ContentId>> {
    await this.requireEditor();
    const { storageHeader, author, signature } = await this.uploadToStorage(content, signedData);

    return createTwoStepTransaction(
      this.ethApi,
      await this.instance.publishContent.sendTransactionAsync(
        storageHeader.uri,
        storageHeader.contentHash,
        author,
        signature,
      ),
      receipt =>
        findEventOrThrow<Events.Logs.ContentPublished>(
          receipt,
          Events.Events.ContentPublished,
        ).args.contentId.toNumber(),
    );
  }

  /**
   * Allows editor to create a new revision to already existing content.
   * The revision can be unsigned. If the revision is signed,
   * the author has to match the author defined when publishing in the first place.
   * If there was no author during publishing [[signRevision]] can update them.
   * @param contentId The id of the already published content
   * @param content The data that should be stored in content storage
   * @param signedData Optional pre-approval from the author concerning this article
   */
  public async updateRevision(
    contentId: ContentId,
    content: string,
    signedData?: ApprovedRevision,
  ): Promise<TwoStepEthTransaction<RevisionId>> {
    await this.requireEditor();
    const { storageHeader, signature } = await this.uploadToStorage(content, signedData);

    return createTwoStepTransaction(
      this.ethApi,
      await this.instance.updateRevision.sendTransactionAsync(
        this.ethApi.toBigNumber(contentId),
        storageHeader.uri,
        storageHeader.contentHash,
        signature,
      ),
      receipt =>
        findEventOrThrow<Events.Logs.RevisionUpdated>(
          receipt,
          Events.Events.RevisionUpdated,
        ).args.revisionId.toNumber(),
    );
  }

  /**
   * Allows editor to back-sign a revision which was previously unsigned.
   * Additionally if the content was published without the author, this function will allow to set the author.
   * If the author was set previously, the signature also needs to be from the same author.
   * @param contentId The id of already published content
   * @param revisionId The id of already published revision for that content
   * @param signedData Data needed to back-sign the revision
   */
  public async signRevision(
    contentId: ContentId,
    revisionId: RevisionId,
    signedData: ApprovedRevision,
  ): Promise<TwoStepEthTransaction> {
    await this.requireEditor();

    const contentHeader = await this.loadContentHeader(contentId, revisionId);
    this.verifyApprovedRevision(contentHeader, signedData);
    if (!is0x0Address(contentHeader.author) && contentHeader.author !== signedData.author) {
      throw new Error(CivilErrors.MalformedParams);
    }

    return createTwoStepSimple(
      this.ethApi,
      await this.instance.signRevision.sendTransactionAsync(
        this.ethApi.toBigNumber(contentId),
        this.ethApi.toBigNumber(revisionId),
        signedData.author,
        signedData.signature,
      ),
    );
  }
  //#endregion

  /**
   * Signs that specific content with the current private key of the user of this library with their approval
   * @param content Data to sign
   * @returns An object containing all information to represent what has the author approved
   */
  public async approveByAuthor(content: string): Promise<ApprovedRevision> {
    const author = requireAccount(this.ethApi);

    const contentHash = hashContent(content);
    const message = prepareNewsroomMessage(this.address, contentHash);

    const { signature } = await this.ethApi.signMessage(message, author);
    return {
      author,
      contentHash,
      signature,
      newsroomAddress: this.address,
    };
  }

  private async requireEditor(): Promise<void> {
    await this.requireRole(NewsroomRoles.Editor);
  }

  private async requireRole(role: NewsroomRoles): Promise<void> {
    const account = requireAccount(this.ethApi);
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

  private verifyApprovedRevision(storageHeader: StorageHeader, signedData: ApprovedRevision): void {
    if (signedData.newsroomAddress !== this.address) {
      throw new Error(CivilErrors.MalformedParams);
    }
    if (storageHeader.contentHash !== signedData.contentHash) {
      throw new Error(CivilErrors.NoPrivileges);
    }
  }

  private async uploadToStorage(
    content: string,
    signedData?: ApprovedRevision,
  ): Promise<{ storageHeader: StorageHeader; author: EthAddress; signature: Hex }> {
    const storageHeader = await this.contentProvider.put(content);

    let author: EthAddress = "";
    let signature: Hex = "";

    if (signedData) {
      this.verifyApprovedRevision(storageHeader, signedData);
      author = signedData.author;
      signature = signedData.signature;
    }
    return {
      storageHeader,
      author,
      signature,
    };
  }
}
