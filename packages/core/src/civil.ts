import { currentNetwork, EthApi, requireAccount } from "@joincivil/ethapi";
import {
  BigNumber,
  EthAddress,
  EthSignedMessage,
  TxHash,
  parseEther,
  ContentData,
  StorageHeader,
} from "@joincivil/typescript-types";
import { CivilErrors, networkNames } from "@joincivil/utils";
import * as Debug from "debug";
import { Observable } from "rxjs/Observable";
import { CivilTransactionReceipt, FallbackProvider, TwoStepEthTransaction } from ".";
import { ContentProvider, ContentProviderCreator } from "./content/contentprovider";
import { IPFSProvider } from "./content/ipfsprovider";
import { Artifact, artifacts } from "./contracts/generated/artifacts";
import { Newsroom } from "./contracts/newsroom";
import { CivilTCR } from "./contracts/tcr/civilTCR";
import { Council } from "./contracts/tcr/council";
import { createTwoStepSimple } from "./contracts/utils/contracts";
import { CVLToken } from "./contracts/tcr/cvltoken";

import { provider as Provider } from "web3-core";

// See debug in npm, you can use `localStorage.debug = "civil:*" to enable logging
const debug = Debug("civil:main");

export interface CivilOptions {
  web3Provider?: Provider;
  ContentProvider?: ContentProviderCreator;
  debug?: true;
}

/**
 * Single entry-point to the civil.ts library
 * It abstracts most of the web3 and Ethereum communication.
 * Since all the calls to the Ethereum network take time, it is written using Promises,
 * and all of them can fail (for eg. when the connection to the node drops)
 */
export class Civil {
  private ethApi: EthApi;
  private contentProvider: ContentProvider;

  /**
   * An optional object, conforming to Web3 provider interface can be provided.
   * If no provider is given, civil.ts shall try to automagically infer which provider to use.
   * First by checking for any injected ones (such as Metamask) and in the last case defaulting
   * to default http on localhost.
   * @param web3Provider Explicitly provide an Ethereum Node connection provider
   */
  constructor(options?: CivilOptions) {
    const opts: CivilOptions = { ...options };

    if (opts.debug === true) {
      Debug.enable("civil:*");
      debug('Enabled debug for "civil:*" namespace');
    }

    if (!opts.web3Provider) {
      throw new Error("no web3Provider in options");
    }
    const provider = opts.web3Provider;
    this.ethApi = new EthApi(provider, Object.values<Artifact>(artifacts).map(a => a.abi));

    const providerConstructor = opts.ContentProvider || FallbackProvider.build([IPFSProvider]);
    this.contentProvider = new providerConstructor({ ethApi: this.ethApi });
  }

  public toBigNumber(num: number | string | BigNumber): any {
    return this.ethApi.toBigNumber(num);
  }
  public toWei(num: number): BigNumber {
    return this.ethApi.toWei(num);
  }
  public toChecksumAddress(address: string): any {
    return this.ethApi.toChecksumAddress(address);
  }

  public async signMessage(message: string, account?: EthAddress): Promise<EthSignedMessage> {
    return this.ethApi.signMessage(message, account);
  }

  public async currentProviderEnable(): Promise<boolean> {
    if (this.ethApi.currentProvider && (this.ethApi.currentProvider as any).enable) {
      try {
        await (this.ethApi.currentProvider as any).enable();
        return true;
      } catch (e) {
        return false;
      }
    } else {
      return true;
    }
  }

  /**
   * @returns Currently default user account used, undefined if none unlocked/found
   */
  public get accountStream(): Observable<EthAddress | undefined> {
    return this.ethApi.accountStream;
  }

  public get networkStream(): Observable<number> {
    return this.ethApi.networkStream;
  }

  public get networkNameStream(): Observable<string> {
    return this.ethApi.networkStream.map((item: number): string => networkNames[item] || "unknown");
  }

  /**
   * Returns the current provider that is used by all things Civil in the Core
   */
  public get currentProvider(): Provider {
    return this.ethApi.currentProvider;
  }

  /**
   * Changes the web3 provider that is used by the Civil library.
   * All existing smart-contract object will switch to the new library behind the scenes.
   * This may invalidate any Ethereum calls in transit or event listening
   * @param web3Provider The new provider that shall replace the old one
   */
  public set currentProvider(web3Provider: Provider) {
    this.ethApi.currentProvider = web3Provider;
  }

  /**
   * Create a new Newsroom owned by a multisig on the current Ethereum network with the
   * bytecode included in this library
   * The smart contract is trusted since it comes from a trusted source (us).
   * This call may require user input - such as approving a transaction in Metamask
   */
  public async newsroomDeployTrusted(
    newsroomName: string,
    charterUri: string = "",
    charterHash: string = "",
  ): Promise<TwoStepEthTransaction<Newsroom>> {
    return Newsroom.deployTrusted(this.ethApi, this.contentProvider, newsroomName, charterUri, charterHash);
  }

  public async estimateNewsroomDeployTrusted(
    newsroomName: string,
    charterUri: string,
    charterHash: string,
  ): Promise<number> {
    return Newsroom.estimateDeployTrusted(this.ethApi, newsroomName, charterUri, charterHash);
  }

  /**
   * Create a new Newsroom which is not owned by a multisig on the current Ethereum network with the
   * bytecode included in this library
   * The smart contract is trusted since it comes from a trusted source (us).
   * This call may require user input - such as approving a transaction in Metamask
   */
  public async newsroomDeployNonMultisigTrusted(newsroomName: string): Promise<TwoStepEthTransaction<Newsroom>> {
    return Newsroom.deployNonMultisigTrusted(this.ethApi, this.contentProvider, newsroomName);
  }

  /**
   * Returns a Newsroom object, that was beforehand put into blockchain's mempool,
   * or already mined into a block.
   * If the Newsroom was already mined, returns it immediately, otherwise
   * waits until it's put onto blockchain.
   * @see {@link Civil.awaitReceipt}
   * @param transactionHash The transaction hash which creates the Newsroom
   * @param blockConfirmations How many blocks should be mined before the Newsroom is considered immutabely created
   * @throws {CivilErrors.MalformedParams} If the transaction is not a Newsroom creation transaction
   */
  public async newsroomFromTxHashUntrusted(transactionHash: TxHash, blockConfirmations?: number): Promise<Newsroom> {
    const receipt = await this.awaitReceipt(transactionHash, blockConfirmations);
    if (!receipt.contractAddress) {
      throw new Error(CivilErrors.MalformedParams);
    }
    return this.newsroomAtUntrusted(receipt.contractAddress);
  }

  /**
   * Returns a Newsroom object, that was beforehand put into blockchain's mempool using the factory method,
   * or already mined into a block.
   * If the Newsroom was already mined, returns it immediately, otherwise
   * waits until it's put onto blockchain.
   * @see {@link Civil.awaitReceipt}
   * @param transactionHash The transaction hash which creates the Newsroom
   * @param blockConfirmations How many blocks should be mined before the Newsroom is considered immutabely created
   */
  public async newsroomFromFactoryTxHashUntrusted(
    transactionHash: TxHash,
    blockConfirmations?: number,
  ): Promise<Newsroom> {
    const receipt = await this.awaitReceipt(transactionHash, blockConfirmations);
    return Newsroom.fromFactoryReceipt(receipt, this.ethApi, this.contentProvider);
  }

  /**
   * Returns a Newsroom object, which is an abstraction layer to
   * the smart-contract located a Ethereum on `address` in the current network.
   * No sanity checks are done concerning that smart-contracts, and so the contract
   * might a bad actor or not implementing Newsroom ABIs at all.
   * @param address The address on current Ethereum network where the smart-contract is located
   */
  public async newsroomAtUntrusted(address: EthAddress): Promise<Newsroom> {
    return Newsroom.atUntrusted(this.ethApi, this.contentProvider, address);
  }

  /**
   * Only one TCR is needed for in each network, a singleton living at a specific
   * Ethereum address, used by everyone.
   * @returns A singleton instance of TCR living on the current network
   * @throws {CivilErrors.UnsupportedNetwork} In case we're trying to get a non-deployed singleton
   */
  public async tcrSingletonTrusted(): Promise<CivilTCR> {
    return CivilTCR.singleton(this.ethApi, this.contentProvider);
  }

  public async councilSingletonTrusted(): Promise<Council> {
    return Council.singleton(this.ethApi);
  }

  public async cvlTokenSingletonTrusted(multisigAddress?: EthAddress): Promise<CVLToken> {
    return CVLToken.singletonTrusted(this.ethApi, multisigAddress);
  }

  /**
   * Same as `tcrSingletonTrusted` but is async and supports (but does not require) a multisig proxy. This is a separate function because most TCR instances don't need multisig and can continue to use synchronous `tcrSingletonTrusted` function.
   * @param multisigAddress (optional) Multisig through which to proxy interactions with this TCR
   * @returns Promise containing singleton instance of TCR living on the current network
   * @throws {CivilErrors.UnsupportedNetwork} In case we're trying to get a non-deployed singleton
   */
  public async tcrSingletonTrustedMultisigSupport(multisigAddress?: EthAddress): Promise<CivilTCR> {
    return CivilTCR.singletonMultisigProxy(this.ethApi, this.contentProvider, multisigAddress);
  }

  /**
   * Waits for the transaction located through the hash gets into the blockchain
   * and returns it's receipt after it gets in.
   * Optionally, since Blockchain can reorganize sometimes and transactions are revoked,
   * you can wait for some blocks, which exponentionally decreases reorg chances, until
   * the transaction is considered confirmed.
   * @param transactionHash The hash of transaction you wanna confirm got into blockchain
   * @param blockConfirmations How man blocks after the block with transaction should wait before confirming
   */
  public async awaitReceipt(transactionHash: TxHash, blockConfirmations?: number): Promise<CivilTransactionReceipt> {
    return this.ethApi.awaitReceipt<CivilTransactionReceipt>(transactionHash, blockConfirmations);
  }

  /**
   * Stores content on a content provider (defaults to IPFS)
   * @param content The the data that you want to store, in the future, probably a JSON
   * @param options Options to be passed to the provider
   * @returns StorageHeader with info about published content
   */
  public async publishContent(content: string, options?: object): Promise<StorageHeader> {
    return this.contentProvider.put(content, options);
  }

  public async getContent(header: StorageHeader): Promise<ContentData | undefined> {
    try {
      const content = await this.contentProvider.get(header);
      return content;
    } catch (e) {
      debug(`Resolving Content failed for EthContentHeader: ${header}`, e);
      return;
    }
  }

  public async getBareContent(uri: string): Promise<ContentData | undefined> {
    try {
      const content = await this.contentProvider.get({
        uri,
        contentHash: "",
      });
      return content;
    } catch (e) {
      debug(`Resolving Content failed for uri: ${uri}`, e);
      return;
    }
  }

  public async currentBlock(): Promise<number> {
    return this.ethApi.getLatestBlockNumber();
  }

  public async networkName(): Promise<string> {
    return networkNames[await currentNetwork(this.ethApi)] || "unknown network";
  }

  public async getGasPrice(): Promise<BigNumber> {
    return this.ethApi.getGasPrice();
  }

  public async accountBalance(account: EthAddress): Promise<number> {
    return this.ethApi.accountBalace(account);
  }

  public async simplePayment(recipient: EthAddress, amountInETH: string): Promise<TwoStepEthTransaction> {
    const wei = parseEther(amountInETH);
    const account = await requireAccount(this.ethApi).toPromise();
    return createTwoStepSimple(
      this.ethApi,
      await this.ethApi.sendTransaction({ from: account, to: recipient, value: wei.toString(), gas: 26000 }),
    );
  }
}
