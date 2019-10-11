import { currentAccount, EthApi, requireAccount } from "@joincivil/ethapi";
import {
  CivilErrors,
  estimateRawHex,
  getDefaultFromBlock,
  hashContent,
  hashPersonalMessage,
  is0x0Address,
  is0x0Hash,
  prepareNewsroomMessage,
  prepareUserFriendlyNewsroomMessage,
  promisify,
  recoverSigner,
} from "@joincivil/utils";
import { BigNumber, parseEther } from "@joincivil/typescript-types";
import * as Debug from "debug";
import { addHexPrefix, bufferToHex, setLengthLeft, toBuffer } from "ethereumjs-util";
import { Observable } from "rxjs";
import { Transaction, Tx as TransactionConfig, Tx as SendOptions } from "web3/eth/types";
import { TransactionReceipt } from "web3/types";
import * as zlib from "zlib";
import { ContentProvider } from "../content/contentprovider";
import {
  ApprovedRevision,
  CharterContent,
  CivilTransactionReceipt,
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
  TxHash,
  Uri,
} from "../types";
import { BaseWrapper } from "./basewrapper";
import { NewsroomMultisigProxy } from "./generated/multisig/newsroom";
import { MultiSigWallet as MultisigEvents } from "./generated/wrappers/multi_sig_wallet";
import { Newsroom as Events, NewsroomContract } from "./generated/wrappers/newsroom";
import { NewsroomFactory, NewsroomFactoryContract } from "./generated/wrappers/newsroom_factory";
import { CreateNewsroomInGroupContract } from "./generated/wrappers/create_newsroom_in_group";
import { MultisigProxyTransaction } from "./multisig/basemultisigproxy";
import { Multisig } from "./multisig/multisig";
import { MultisigTransaction } from "./multisig/multisigtransaction";
import {
  createTwoStepSimple,
  createTwoStepTransaction,
  findEvent,
  findEventOrThrow,
  findEvents,
} from "./utils/contracts";

const deflate = promisify<Buffer>(zlib.deflate);

const debug = Debug("civil:newsroom");

const findContentId = (receipt: CivilTransactionReceipt) =>
  new BigNumber(
    findEventOrThrow<Events.Logs.ContentPublished>(receipt, Events.Events.ContentPublished).returnValues.contentId,
  ).toNumber();

const findRevisionId = (receipt: CivilTransactionReceipt) =>
  new BigNumber(
    findEventOrThrow<Events.Logs.RevisionUpdated>(receipt, Events.Events.RevisionUpdated).returnValues.revisionId,
  ).toNumber();

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
    const account = await requireAccount(ethApi).toPromise();
    const txData: any = { from: account };

    const factory = await CreateNewsroomInGroupContract.singletonTrusted(ethApi);
    if (!factory) {
      throw new Error(CivilErrors.UnsupportedNetwork);
    }
    return createTwoStepTransaction(
      ethApi,
      await factory.create.sendTransactionAsync(
        newsroomName,
        charterUri,
        charterHash,
        [account],
        ethApi.toBigNumber(1),
        txData,
      ),
      async factoryReceipt => {
        return Newsroom.fromFactoryReceipt(factoryReceipt, ethApi, contentProvider);
      },
    );
  }

  public static async fromFactoryReceipt(
    factoryReceipt: TransactionReceipt,
    ethApi: EthApi,
    contentProvider: ContentProvider,
  ): Promise<Newsroom> {
    const factory = await CreateNewsroomInGroupContract.singletonTrusted(ethApi);
    const newsroomFactory = await NewsroomFactoryContract.singletonTrusted(ethApi);
    if (!factory) {
      throw new Error(CivilErrors.UnsupportedNetwork);
    }
    const createdNewsroom = findEvents<NewsroomFactory.Logs.ContractInstantiation>(
      factoryReceipt,
      NewsroomFactory.Events.ContractInstantiation,
    ).find(log => log.address === newsroomFactory!.address);

    if (!createdNewsroom) {
      throw new Error("No Newsroom created during deployment through factory");
    }

    const contract = NewsroomContract.atUntrusted(ethApi, createdNewsroom.args.instantiation);
    const multisigProxy = await NewsroomMultisigProxy.create(ethApi, contract);
    const defaultBlock = getDefaultFromBlock(await ethApi.network());
    return new Newsroom(ethApi, contentProvider, contract, multisigProxy, defaultBlock);
  }

  public static async estimateDeployTrusted(
    ethApi: EthApi,
    newsroomName: string,
    charterUri: string = "",
    charterHash: string = "",
  ): Promise<number> {
    const account = await requireAccount(ethApi).toPromise();
    const txData: TransactionConfig = { from: account };
    const factory = await CreateNewsroomInGroupContract.singletonTrusted(ethApi);
    if (!factory) {
      throw new Error(CivilErrors.UnsupportedNetwork);
    }
    return factory.create.estimateGasAsync(
      newsroomName,
      charterUri,
      charterHash,
      [account],
      ethApi.toBigNumber(1),
      txData,
    );
  }

  public static async deployNonMultisigTrusted(
    ethApi: EthApi,
    contentProvider: ContentProvider,
    newsroomName: string,
    charterUri: Uri = "",
    charterHash: Hex = "",
  ): Promise<TwoStepEthTransaction<Newsroom>> {
    if ((charterUri.length === 0) !== (charterHash.length === 0)) {
      throw new Error("Both charter URI and Hash need to be set, or both empty");
    }
    const from = await currentAccount(ethApi);
    const txData: SendOptions = { from: from! };
    return createTwoStepTransaction(
      ethApi,
      await NewsroomContract.deployTrusted.sendTransactionAsync(ethApi, newsroomName, charterUri, charterHash, txData),
      async receipt => Newsroom.atUntrusted(ethApi, contentProvider, receipt.contractAddress!),
    );
  }

  public static async atUntrusted(
    ethApi: EthApi,
    contentProvider: ContentProvider,
    address: EthAddress,
  ): Promise<Newsroom> {
    const instance = NewsroomContract.atUntrusted(ethApi, address);
    const multisigProxy = await NewsroomMultisigProxy.create(ethApi, instance);
    const defaultBlock = getDefaultFromBlock(await ethApi.network());
    return new Newsroom(ethApi, contentProvider, instance, multisigProxy, defaultBlock);
  }

  public static async recoverArchiveTx(tx: Transaction): Promise<string> {
    const inflate = promisify<string>(zlib.inflate);
    const txDataLength = parseInt(addHexPrefix(tx.input.substr(tx.input.length - 16)), 16);
    const content = addHexPrefix(tx.input.substring(txDataLength, tx.input.length - 16));
    return (await inflate(toBuffer(content))).toString();
  }

  private multisigProxy: NewsroomMultisigProxy;
  private contentProvider: ContentProvider;

  private constructor(
    ethApi: EthApi,
    contentProvider: ContentProvider,
    instance: NewsroomContract,
    multisigProxy: NewsroomMultisigProxy,
    defaultBlock: number,
  ) {
    super(ethApi, instance, defaultBlock);
    this.contentProvider = contentProvider;
    this.multisigProxy = multisigProxy;
  }
  //#endregion

  //#region streams
  public editors(): Observable<EthAddress> {
    return this.instance
      .RoleAddedStream({ role: NewsroomRoles.Editor }, { fromBlock: this.defaultBlock })
      .map(e => e.returnValues.grantee)
      .concatFilter(async e => this.isEditor(e));
  }

  /**
   * An unending stream of all the content, both signed as well as unsigned.
   * @param fromBlock Starting block in history for events concerning content being proposed.
   *                  Set to "latest" for only new events
   * @returns Metadata about the content from Ethereum. Use [[resolveContent]] to get actual contents
   */
  public content(fromBlock: number = this.defaultBlock): Observable<EthContentHeader> {
    return this.instance
      .ContentPublishedStream({}, { fromBlock })
      .map(e => new BigNumber(e.returnValues.contentId))
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
    fromBlock: number = this.defaultBlock,
  ): Observable<EthContentHeader> {
    const myContentId = contentId ? this.ethApi.toBigNumber(contentId) : undefined;
    return this.instance.RevisionUpdatedStream({ contentId: myContentId }, { fromBlock }).concatMap(async e => {
      const contentHeader = await this.loadContentHeader(
        new BigNumber(e.returnValues.contentId),
        new BigNumber(e.returnValues.revisionId),
      );
      return {
        blockNumber: e.blockNumber,
        transactionHash: e.transactionHash,
        ...contentHeader,
      };
    });
  }

  /**
   * An unending stream of all names this Newsroom had ever had.
   * @param fromBlock Starting block in history for events.
   *                  Set to "latest" to only listen for new events
   * @returns Name history of this Newsroom
   */
  public nameChanges(fromBlock: number = this.defaultBlock): Observable<string> {
    return this.instance.NameChangedStream({}, { fromBlock }).map(e => e.returnValues.newName);
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
    const owner = await this.instance.owner.callAsync();
    const owners = await this.owners();
    const charterHeader = await this.getCharterHeader();
    return {
      name,
      owner,
      owners,
      charterHeader,
    };
  }

  /**
   * Returns a list of Board of Directors with superuser powers over this
   * newsroom.
   */
  public async owners(): Promise<EthAddress[]> {
    return this.multisigProxy.owners();
  }

  public async addOwner(owner: EthAddress): Promise<TwoStepEthTransaction<MultisigTransaction>> {
    const address = await this.multisigProxy.getMultisigAddress();
    const contract = await Multisig.atUntrusted(this.ethApi, address!);
    return contract.addOwner(owner);
  }

  public async estimateAddOwner(owner: EthAddress): Promise<number> {
    const address = await this.multisigProxy.getMultisigAddress();
    const contract = await Multisig.atUntrusted(this.ethApi, address!);
    return contract.estimateAddOwner(owner);
  }

  /**
   * Returns the address of the multisig that controls this newsroom if one is defined
   */
  public async getMultisigAddress(): Promise<EthAddress | undefined> {
    return this.multisigProxy.getMultisigAddress();
  }

  /**
   * Transfers ETH from multisig to a given address
   * @param eth Amount to transfer, in ether
   * @param to Address to transfer to
   */
  public async transferEthFromMultisig(
    eth: string,
    to: EthAddress,
  ): Promise<TwoStepEthTransaction<MultisigTransaction>> {
    const wei = parseEther(eth);
    const address = await this.multisigProxy.getMultisigAddress();
    const multisig = await Multisig.atUntrusted(this.ethApi, address!);
    return multisig.submitTransaction(to, wei, "0x");
  }

  /**
   * Checks if the user is the owner of the newsroom
   * @param address Address for the ownership check, leave empty for current user
   * @throws {CivilErrors.NoUnlockedAccount} Requires the node to have at least one account if no address provided
   */
  public async isOwner(address?: EthAddress): Promise<boolean> {
    let who = address;

    if (!who) {
      who = await requireAccount(this.ethApi).toPromise();
    }
    return this.multisigProxy.isOwner(who);
  }

  /**
   * Checks if the user can assign roles and approve/deny content
   * @param address Address for the role check, leave empty for current user
   * @throws {CivilErrors.NoUnlockedAccount} Requires the node to have at least one account if no address provided
   */
  public async isEditor(address?: EthAddress): Promise<boolean> {
    let who = address;

    if (!who) {
      who = await requireAccount(this.ethApi).toPromise();
    }
    return this.instance.hasRole.callAsync(who, NewsroomRoles.Editor);
  }

  /**
   * Checks if the user can assign roles and approve/deny content
   * Also returns true if user has director super powers
   * @param address Address for the role check, leave empty for current user
   * @throws {CivilErrors.NoUnlockedAccount} Requires the node to have at least one account if no address provided
   */
  public async hasEditorCapabilities(address?: EthAddress): Promise<boolean> {
    if (await this.isOwner(address)) {
      return true;
    }
    let who = address;

    if (!who) {
      who = await requireAccount(this.ethApi).toPromise();
    }
    return this.instance.hasRole.callAsync(who, NewsroomRoles.Editor);
  }

  public async getArticleHeader(articleId: BigNumber): Promise<EthContentHeader> {
    return this.loadContentHeader(articleId);
  }

  public async getCharterHeader(): Promise<EthContentHeader> {
    return this.getArticleHeader(new BigNumber(0));
  }

  /**
   * Gets newsroom charter data.
   * @throws {CivilErrors.MalformedCharter} Charter data is malformed.
   */
  public async getCharter(): Promise<CharterContent | undefined> {
    const charterData = await this.loadArticle(new BigNumber(0));
    if (!charterData) {
      return charterData;
    }

    if (typeof charterData.content !== "object") {
      try {
        charterData.content = JSON.parse(charterData.content);
      } catch (e) {
        debug(`Charter content not in expected format: ${charterData}`, e);
        throw CivilErrors.MalformedCharter;
      }
    }

    return charterData as CharterContent;
  }

  /**
   * Loads everything concerning one article needed to read it fully.
   * Accesess both Ethereum network as well as the active ContentProvider
   * @param articleId Id of the article that you want to read
   */
  public async loadArticle(articleId: BigNumber): Promise<NewsroomContent | undefined> {
    const header = await this.loadContentHeader(articleId);
    if (header.contentHash && !is0x0Hash(header.contentHash)) {
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
  public async resolveContent(header: EthContentHeader): Promise<NewsroomContent | undefined> {
    // TODO(ritave): Choose ContentProvider based on schema
    try {
      const content = await this.contentProvider.get(header);
      return {
        ...header,
        content,
      };
    } catch (e) {
      debug(`Resolving Content failed for EthContentHeader: ${header}`, e);
      return;
    }
  }

  /**
   * Accesses the Ethereum network and loads basic metatadata about the content
   * @param articleId Id of the article whose metadata you need
   */
  public async loadContentHeader(contentId: BigNumber, revisionId?: number | BigNumber): Promise<EthContentHeader> {
    let revision = revisionId;
    if (!revision) {
      revision = new BigNumber(await this.instance.revisionCount.callAsync(new BigNumber(contentId).toString())).sub(
        new BigNumber(1).toString(),
      );
    }
    const myContentId = this.ethApi.toBigNumber(contentId);
    let contentHash: string;
    let uri: string;
    let timestamp: string;
    let author: EthAddress;
    let signature: string;
    let myRevisionId: string | undefined;
    if (revision) {
      myRevisionId = this.ethApi.toBigNumber(revision);
      [contentHash, uri, timestamp, author, signature] = await this.instance.getRevision.callAsync(
        myContentId,
        myRevisionId!,
      );
    } else {
      [contentHash, uri, timestamp, author, signature] = await this.instance.getContent.callAsync(
        myContentId.toNumber(),
      );
    }
    return {
      contentId: myContentId.toNumber(),
      revisionId: myRevisionId ? new BigNumber(myRevisionId).toNumber() : 0,
      timestamp: new Date(parseInt(timestamp, 10) * 1000),
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

  public async removeOwner(actor: EthAddress): Promise<TwoStepEthTransaction<MultisigTransaction>> {
    await this.requireOwner();
    const address = await this.getMultisigAddress();
    const contract = await Multisig.atUntrusted(this.ethApi, address!);
    return contract.removeOwner(actor);
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

  public txArchiveForContentId(contentId: number, revisionId: number): Observable<any> {
    const myContentId = this.ethApi.toBigNumber(contentId);
    const myRevisionId = this.ethApi.toBigNumber(revisionId);
    return this.instance
      .RevisionUpdatedStream({ contentId: myContentId, revisionId: myRevisionId }, { fromBlock: this.defaultBlock })
      .concatMap(async item => {
        const transaction = await this.ethApi.getTransaction(item.transactionHash);
        return Newsroom.recoverArchiveTx(transaction);
      });
  }

  public async estimatePublishURIAndHash(
    uriOrContent: any,
    hash: string,
    author: string = "",
    signature: string = "",
    archive?: boolean,
  ): Promise<number> {
    const uriForEstimate = archive ? "self-tx:1.0" : uriOrContent;
    const data = await this.instance.publishContent.getRaw(uriForEstimate, hash, author, signature, { gas: 0 });
    if (!(await this.isEditor()) && (await this.isOwner())) {
      if (archive) {
        return this.estimateFromDataMultiSig(data, uriOrContent);
      } else {
        return this.estimateFromDataMultiSig(data);
      }
    } else {
      const baseGas = await this.instance.publishContent.estimateGasAsync(uriForEstimate, hash, author, signature, {});
      let additionalGas = 0;
      if (archive) {
        additionalGas = await this.estimateFromContent(uriOrContent, data.data!.length);
      }
      return baseGas + additionalGas;
    }
  }

  public async estimateUpdateURIAndHash(
    contentId: number,
    uriOrContent: any,
    hash: string,
    signature: string = "",
    archive?: boolean,
  ): Promise<number> {
    const uriForEstimate = archive ? "self-tx:1.0" : uriOrContent;
    const data = await this.instance.updateRevision.getRaw(
      this.ethApi.toBigNumber(contentId),
      uriForEstimate,
      hash,
      signature,
      { gas: 0 },
    );
    if (!(await this.isEditor()) && (await this.isOwner())) {
      if (archive) {
        return this.estimateFromDataMultiSig(data, uriOrContent);
      } else {
        return this.estimateFromDataMultiSig(data);
      }
    } else {
      const baseGas = await this.instance.updateRevision.estimateGasAsync(
        this.ethApi.toBigNumber(contentId),
        uriForEstimate,
        hash,
        signature,
        {},
      );
      let additionalGas = 0;
      if (archive) {
        additionalGas = await this.estimateFromContent(uriOrContent, data.data!.length);
      }
      return baseGas + additionalGas;
    }
  }

  public async estimateFromDataMultiSig(data: TransactionConfig, content?: any): Promise<number> {
    const address = await this.multisigProxy.getMultisigAddress();
    const contract = await Multisig.atUntrusted(this.ethApi, address!);
    const baseGas = await contract.estimateTransaction(address!, this.ethApi.toBigNumber(0), data.data!);
    let additionalGas = 0;
    if (content) {
      const multiSigData = await contract.getRawTransaction(address!, this.ethApi.toBigNumber(0), data.data!);
      additionalGas = await this.estimateFromContent(content, multiSigData.data!.length);
    }
    return baseGas + additionalGas;
  }

  public async estimateFromContent(content: any, dataLength: number): Promise<number> {
    const revision = typeof content === "string" ? content : JSON.stringify(content);
    const buffer = await deflate(revision);
    const hex = bufferToHex(buffer);
    // @ts-ignore
    // TODO(dankins): ignoring typescript error, make sure this works
    const length = bufferToHex(setLengthLeft(toBuffer(dataLength), 8));
    const extra = hex.substr(2) + length.substr(2);
    return estimateRawHex(extra);
  }

  public async publishURIAndHash(
    uri: string,
    hash: string,
    author: string = "",
    signature: string = "",
  ): Promise<TwoStepEthTransaction<ContentId | MultisigTransaction>> {
    if (!(await this.isEditor()) && (await this.isOwner())) {
      return this.twoStepOrMulti(
        await this.multisigProxy.publishContent.sendTransactionAsync(uri, hash, author, signature),
        findContentId,
      );
    } else {
      await this.requireEditor();

      return createTwoStepTransaction(
        this.ethApi,
        await this.instance.publishContent.sendTransactionAsync(uri, hash, author, signature),
        findContentId,
      );
    }
  }

  public async updateRevisionURIAndHash(
    contentId: ContentId,
    uri: string,
    hash: string,
    signature: string = "0x",
  ): Promise<TwoStepEthTransaction<RevisionId | MultisigTransaction>> {
    if (contentId === 0) {
      await this.requireOwner();

      return this.twoStepOrMulti(
        await this.multisigProxy.updateRevision.sendTransactionAsync(
          this.ethApi.toBigNumber(contentId),
          uri,
          hash,
          signature,
        ),
        findRevisionId,
      );
    } else if (!(await this.isEditor()) && (await this.isOwner())) {
      return this.twoStepOrMulti(
        await this.multisigProxy.updateRevision.sendTransactionAsync(
          this.ethApi.toBigNumber(contentId),
          uri,
          hash,
          signature,
        ),
        findRevisionId,
      );
    } else {
      await this.requireEditor();

      return createTwoStepTransaction(
        this.ethApi,
        await this.instance.updateRevision.sendTransactionAsync(
          this.ethApi.toBigNumber(contentId),
          uri,
          hash,
          signature,
        ),
        findRevisionId,
      );
    }
  }

  public async addArchiveToMultisig(data: TransactionConfig, hex: string, gas: number): Promise<TransactionConfig> {
    const multiSigAddress = await this.multisigProxy.getMultisigAddress();
    const contract = await Multisig.atUntrusted(this.ethApi, multiSigAddress!);
    const multiSigTxData = await contract.getRawTransaction(this.address, this.ethApi.toBigNumber(0), data.data!);
    // @ts-ignore
    // TODO(dankins): ignoring typescript error, make sure this works
    const length = bufferToHex(setLengthLeft(toBuffer(multiSigTxData.data!.length), 8));
    const extra = hex.substr(2) + length.substr(2);
    multiSigTxData.gas = gas;
    multiSigTxData.data = multiSigTxData.data + extra;
    return multiSigTxData;
  }

  public async publishWithArchive(
    content: any,
    hash: string,
    author: string = "",
    signature: string = "",
  ): Promise<TwoStepEthTransaction<MultisigTransaction | ContentId>> {
    const revision = typeof content === "string" ? content : JSON.stringify(content);
    const gas = await this.estimatePublishURIAndHash(content, hash, author, signature, true);
    const data = await this.instance.publishContent.getRaw("self-tx:1.0", hash, author, signature, { gas });
    const buffer = await deflate(revision);
    const hex = bufferToHex(buffer);
    if (!(await this.isEditor()) && (await this.isOwner())) {
      const multiSigData = await this.addArchiveToMultisig(data, hex, gas);
      return createTwoStepTransaction(this.ethApi, await this.ethApi.sendTransaction(multiSigData), findContentId);
    } else {
      await this.requireEditor();
      const txData = await this.instance.publishContent.getRaw("self-tx:1.0", hash, author, signature, { gas });

      // @ts-ignore
      // TODO(dankins): ignoring typescript error, make sure this works
      const length = bufferToHex(setLengthLeft(toBuffer(txData.data!.length), 8));

      // @ts-ignore
      // TODO(dankins): ignoring typescript error, make sure this works
      const extra = hex.substr(2) + length.substr(2);
      txData.data = txData.data + extra;
      txData.gas = gas;
      return createTwoStepTransaction(this.ethApi, await this.ethApi.sendTransaction(txData), findContentId);
    }
  }

  public async updateRevisionURIAndHashWithArchive(
    contentId: ContentId,
    content: any,
    hash: string,
    signature: string = "",
  ): Promise<TwoStepEthTransaction<RevisionId | MultisigTransaction>> {
    const revision = typeof content === "string" ? content : JSON.stringify(content);
    const gas = await this.estimateUpdateURIAndHash(contentId, content, hash, signature, true);
    const data = await this.instance.updateRevision.getRaw(
      this.ethApi.toBigNumber(contentId),
      "self-tx:1.0",
      hash,
      signature,
      { gas },
    );
    const buffer = await deflate(revision);
    const hex = bufferToHex(buffer);
    if (!(await this.isEditor()) && (await this.isOwner())) {
      const multiSigData = await this.addArchiveToMultisig(data, hex, gas);
      return createTwoStepTransaction(this.ethApi, await this.ethApi.sendTransaction(multiSigData), findRevisionId);
    } else {
      await this.requireEditor();
      const txData = await this.instance.updateRevision.getRaw(
        this.ethApi.toBigNumber(contentId),
        "self-tx:1.0",
        hash,
        signature,
        { gas },
      );
      // @ts-ignore
      // TODO(dankins): ignoring typescript error, make sure this works
      const length = bufferToHex(setLengthLeft(toBuffer(txData.data!.length), 8));
      const extra = hex.substr(2) + length.substr(2);
      txData.data = txData.data + extra;
      txData.gas = gas;
      return createTwoStepTransaction(this.ethApi, await this.ethApi.sendTransaction(txData), findRevisionId);
    }
  }

  public async contentIdFromTxHash(txHash: TxHash): Promise<number> {
    const publishReceipt = await this.ethApi.awaitReceipt<CivilTransactionReceipt>(txHash);

    return findContentId(publishReceipt);
  }

  /**
   * Allows editor to publish content on the ethereum storage and record it in the
   * Blockchain Newsroom.
   * The content can also be pre-approved by the author through their signature using their private key
   * @param content The content that should be put in the content provider
   * @param signedData An object representing author's approval concerning this content
   * @returns An id assigned on Ethereum to the uri, or a multig transaction if it requires more confirmations
   */
  public async publishContent(
    content: string,
    signedData?: ApprovedRevision,
  ): Promise<TwoStepEthTransaction<ContentId | MultisigTransaction>> {
    const { storageHeader, author, signature } = await this.uploadToStorage(content, signedData);
    if (this.isOwner()) {
      return this.twoStepOrMulti(
        await this.multisigProxy.publishContent.sendTransactionAsync(
          storageHeader.uri,
          storageHeader.contentHash!,
          author,
          signature,
        ),
        findContentId,
      );
    } else {
      await this.requireEditor();

      return createTwoStepTransaction(
        this.ethApi,
        await this.instance.publishContent.sendTransactionAsync(
          storageHeader.uri,
          storageHeader.contentHash!,
          author,
          signature,
        ),
        findContentId,
      );
    }
  }

  public async revisionFromTxHash(txHash: TxHash): Promise<RevisionId> {
    const revisionReceipt = await this.ethApi.awaitReceipt<CivilTransactionReceipt>(txHash);
    return findRevisionId(revisionReceipt);
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
  ): Promise<TwoStepEthTransaction<RevisionId | MultisigTransaction>> {
    const { storageHeader, signature } = await this.uploadToStorage(content, signedData);

    if (this.isOwner()) {
      return this.twoStepOrMulti(
        await this.multisigProxy.updateRevision.sendTransactionAsync(
          this.ethApi.toBigNumber(contentId),
          storageHeader.uri,
          storageHeader.contentHash!,
          signature,
        ),
        findRevisionId,
      );
    } else {
      await this.requireEditor();

      return createTwoStepTransaction(
        this.ethApi,
        await this.instance.updateRevision.sendTransactionAsync(
          this.ethApi.toBigNumber(contentId),
          storageHeader.uri,
          storageHeader.contentHash!,
          signature,
        ),
        findRevisionId,
      );
    }
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
  ): Promise<TwoStepEthTransaction<CivilTransactionReceipt | MultisigTransaction>> {
    const contentHeader = await this.loadContentHeader(new BigNumber(contentId), revisionId);
    this.verifyApprovedRevision(contentHeader, signedData);
    if (!is0x0Address(contentHeader.author) && contentHeader.author !== signedData.author) {
      throw new Error(CivilErrors.MalformedParams);
    }

    if (this.isOwner()) {
      return this.twoStepOrMulti(
        await this.multisigProxy.signRevision.sendTransactionAsync(
          this.ethApi.toBigNumber(contentId),
          this.ethApi.toBigNumber(revisionId),
          signedData.author,
          signedData.signature,
        ),
        receipt => receipt,
      );
    } else {
      await this.requireEditor();

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
  }
  //#endregion

  /**
   * Signs that specific content with the current private key of the user of this library with their approval
   * @param content Data to sign
   * @returns An object containing all information to represent what has the author approved
   */
  public async approveByAuthor(content: string): Promise<ApprovedRevision> {
    const author = await requireAccount(this.ethApi).toPromise();

    const contentHash = hashContent(content);
    const message = prepareNewsroomMessage(this.address, contentHash);

    const { signature } = await this.ethApi.signMessage(message, author);
    return {
      author,
      contentHash,
      signature,
      date: new Date().toISOString(),
      newsroomAddress: this.address,
    };
  }

  public async approveByAuthorPersonalSign(contentHash: Hex): Promise<ApprovedRevision> {
    const author = await requireAccount(this.ethApi).toPromise();
    const name = await this.getName();
    const message = prepareUserFriendlyNewsroomMessage(this.address, contentHash, name);
    const { signature } = await this.ethApi.signMessage(message, author);
    const date = new Date().toISOString();
    return {
      author,
      contentHash,
      signature,
      date,
      newsroomAddress: this.address,
    };
  }

  private async requireEditor(): Promise<void> {
    await this.requireRole(NewsroomRoles.Editor);
  }

  private async requireRole(role: NewsroomRoles): Promise<void> {
    const account = await requireAccount(this.ethApi).toPromise();
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

  /**
   * Used when the transaction might go through a multisig wallet
   * In that case, more confirmations might be needed from other owners
   */
  private twoStepOrMulti<T>(
    tx: MultisigProxyTransaction,
    transformation: (receipt: CivilTransactionReceipt) => T | Promise<T>,
  ): TwoStepEthTransaction<T | MultisigTransaction> {
    return createTwoStepTransaction(this.ethApi, tx.txHash, async receipt => {
      if (tx.isProxied && !findEvent<MultisigEvents.Logs.Execution>(receipt, MultisigEvents.Events.Execution)) {
        const transactionId = await tx.proxiedId!();
        return this.multisigProxy.requireMultisig().transaction(transactionId);
      }
      return transformation(receipt);
    });
  }
}
