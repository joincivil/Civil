import { currentNetwork, EthApi, ProviderBackport, Web310Provider } from "@joincivil/ethapi";
import { EthSignedMessage, TxHash, Uri } from "@joincivil/typescript-types";
import { CivilErrors, networkNames } from "@joincivil/utils";
import BigNumber from "bignumber.js";
import * as Debug from "debug";
import { Observable } from "rxjs/Observable";
import * as Web3 from "web3";
import { FallbackProvider } from ".";
import { ContentProvider, ContentProviderCreator } from "./content/contentprovider";
import { IPFSProvider } from "./content/ipfsprovider";
import { Artifact, artifacts } from "./contracts/generated/artifacts";
import { Newsroom } from "./contracts/newsroom";
import { CivilTCR } from "./contracts/tcr/civilTCR";
import { Council } from "./contracts/tcr/council";

// See debug in npm, you can use `localStorage.debug = "civil:*" to enable logging
const debug = Debug("civil:main");

export interface CivilOptions {
  web3Provider?: Web3.Provider | Web310Provider;
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

    let provider: Web3.Provider;
    if (opts.web3Provider) {
      if (!(opts.web3Provider as any).sendAsync) {
        provider = new ProviderBackport(opts.web3Provider as Web310Provider);
      } else {
        provider = opts.web3Provider as Web3.Provider;
      }
    } else {
      provider = EthApi.detectProvider();
    }
    this.ethApi = new EthApi(provider, Object.values<Artifact>(artifacts).map(a => a.abi));

    const providerConstructor = opts.ContentProvider || FallbackProvider.build([IPFSProvider]);
    this.contentProvider = new providerConstructor({ ethApi: this.ethApi });
  }

  public toBigNumber(num: number | string): any {
    return this.ethApi.toBigNumber(num);
  }

  public async signMessage(message: string, account?: EthAddress): Promise<EthSignedMessage> {
    return this.ethApi.signMessage(message, account);
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

  /**
   * Returns the current provider that is used by all things Civil in the Core
   */
  public get currentProvider(): Web3.Provider {
    return this.ethApi.currentProvider;
  }

  /**
   * Changes the web3 provider that is used by the Civil library.
   * All existing smart-contract object will switch to the new library behind the scenes.
   * This may invalidate any Ethereum calls in transit or event listening
   * @param web3Provider The new provider that shall replace the old one
   */
  public set currentProvider(web3Provider: Web3.Provider) {
    this.ethApi.currentProvider = web3Provider;
  }

  /**
   * Create a new Newsroom owned by a multisig on the current Ethereum network with the
   * bytecode included in this library
   * The smart contract is trusted since it comes from a trusted source (us).
   * This call may require user input - such as approving a transaction in Metamask
   */
  public async newsroomDeployTrusted(newsroomName: string): Promise<TwoStepEthTransaction<Newsroom>> {
    return Newsroom.deployTrusted(this.ethApi, this.contentProvider, newsroomName);
  }

  public async estimateNewsroomDeployTrusted(newsroomName: string): Promise<number> {
    return Newsroom.estimateDeployTrusted(newsroomName, this.ethApi);
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
   * @returns A URI that points to the content
   */
  public async publishContent(content: string): Promise<Uri> {
    const { uri } = await this.contentProvider.put(content);
    return uri;
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
}
