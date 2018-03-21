import * as Debug from "debug";
import * as Web3 from "web3";

import { ContentProvider } from "./content/contentprovider";
import { InMemoryProvider } from "./content/inmemoryprovider";
import { Newsroom } from "./contracts/newsroom";
import { EthAddress, TxHash, CivilTransactionReceipt, TwoStepEthTransaction } from "./types";
import { OwnedAddressTCRWithAppeals } from "./contracts/ownedAddressTCRWithAppeals";
import { Web3Wrapper } from "./utils/web3wrapper";
import { CivilErrors } from "./utils/errors";
import { artifacts } from "./contracts/generated/artifacts";
import { EIP20 } from "./contracts/eip20";
import { Voting } from "./contracts/voting";

// See debug in npm, you can use `localStorage.debug = "civil:*" to enable logging
const debug = Debug("civil:main");

export interface CivilOptions {
  web3Provider?: Web3.Provider;
  contentProvider?: ContentProvider;
  debug?: true;
}

/**
 * Single entry-point to the civil.ts library
 * It abstracts most of the web3 and Ethereum communication.
 * Since all the calls to the Ethereum network take time, it is written using Promises,
 * and all of them can fail (for eg. when the connection to the node drops)
 */
export class Civil {
  private web3Wrapper: Web3Wrapper;
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
      debug("Enabled debug for \"civil:*\" namespace");
    }

    let web3Provider = opts.web3Provider;
    if (!web3Provider) {
      // Try to use the window's injected provider
      if (typeof window !== "undefined" && (window as any).web3 !== "undefined") {
        const injectedWeb3: Web3 = (window as any).web3;
        web3Provider = injectedWeb3.currentProvider;
        debug("Using injected web3 provider");
      } else {
        // TODO(ritave): Research using Infura
        web3Provider = new Web3.providers.HttpProvider("http://localhost:8545");
        debug("No web3 provider provided or found injected, defaulting to HttpProvider");
      }
    }
    // TODO(ritave): Constructor can throw when the eg. HttpProvider can't connect to Http
    //               It shouldn't, and should just set null account
    this.web3Wrapper = new Web3Wrapper(web3Provider);

    // TODO(ritave): Choose a better default provider
    this.contentProvider = opts.contentProvider || new InMemoryProvider(this.web3Wrapper);
  }

  /**
   * @returns Currently default user account used, undefined if none unlocked/found
   */
  public get userAccount(): string | undefined {
    return this.web3Wrapper.account;
  }

  /**
   * Create a new Newsroom on the current Ethereum network with the bytecode included in this library
   * The smart contract is trusted since it comes from a trusted source (us).
   * This call may require user input - such as approving a transaction in Metamask
   */
  public async newsroomDeployTrusted(newsroomName: string): Promise<TwoStepEthTransaction<Newsroom>> {
    return Newsroom.deployTrusted(this.web3Wrapper, this.contentProvider, newsroomName);
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
   * Returns a Newsroom object, which is an abstraction layer to
   * the smart-contract located a Ethereum on `address` in the current network.
   * No sanity checks are done concerning that smart-contracts, and so the contract
   * might a bad actor or not implementing Newsroom ABIs at all.
   * @param address The address on current Ethereum network where the smart-contract is located
   */
  public newsroomAtUntrusted(address: EthAddress): Newsroom {
    return Newsroom.atUntrusted(this.web3Wrapper, this.contentProvider, address);
  }

  /**
   * Returns the deployed TCR address for the current network
   */
  public getDeployedTCRAddressForCurrentNetwork(): EthAddress {
    const networkId = Number.parseInt(this.web3Wrapper.web3.version.network);
    return artifacts.OwnedAddressTCRWithAppeals.networks[networkId].address;
  }

  /**
   * Returns a OwnedAddressTCRWithAppeals object, which is an abstraction layer to
   * the smart-contract located on Ethereum in the current network. Instance returned
   * is associated with the contract deployed via truffle migrations (address is
   * locate in the artifacts file).
   */
  public getDeployedOwnedAddressTCRWithAppeals(): OwnedAddressTCRWithAppeals {
    const tcrAddress = this.getDeployedTCRAddressForCurrentNetwork();
    return OwnedAddressTCRWithAppeals.atUntrusted(this.web3Wrapper, this.contentProvider, tcrAddress);
  }

  /**
   * Returns the EIP20 instance associated with the deployed OwnedAddressTCRWithAppeals
   */
  public async getEIP20ForDeployedTCR(): Promise<EIP20> {
    const tcr = this.getDeployedOwnedAddressTCRWithAppeals();
    const tokenAddress = await tcr.getTokenAddress();
    return EIP20.atUntrusted(this.web3Wrapper, tokenAddress);
  }

  /**
   * Returns the Voting instance associated with the deployed OwnedAddressTCRWithAppeals
   */
  public async getVotingForDeployedTCR(): Promise<Voting> {
    const tcr = this.getDeployedOwnedAddressTCRWithAppeals();
    const votingAddress = await tcr.getVotingAddress();
    return Voting.atUntrusted(this.web3Wrapper, votingAddress);
  }

  /**
   * Changes the provider that is used by the Civil library.
   * All existing smart-contract object will switch to the new library behind the scenes.
   * This may invalidate any Ethereum calls in transit or event listening
   * @param web3Provider The new provider that shall replace the old one
   */
  public setProvider(web3Provider: Web3.Provider): void {
    this.web3Wrapper.setProvider(web3Provider);
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
    return this.web3Wrapper.awaitReceipt(transactionHash, blockConfirmations);
  }
}
