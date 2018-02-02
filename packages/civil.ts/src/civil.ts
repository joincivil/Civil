import * as Debug from "debug";
import * as Web3 from "web3";

import { ContentProvider } from "./content/providers/contentprovider";
import { InMemoryProvider } from "./content/providers/inmemoryprovider";
import { Newsroom } from "./contracts/newsroom";
import { EthAddress } from "./types";
import { Web3Wrapper } from "./utils/web3wrapper";

// See debug in npm, you can use `localStorage.debug = "civil:*" to enable logging
const debug = Debug("civil:main");

export interface CivilOptions {
  web3Provider?: Web3.Provider;
  contentProvider?: ContentProvider;
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
  public async newsroomDeployTrusted(): Promise<Newsroom> {
    return Newsroom.deployTrusted(this.web3Wrapper, this.contentProvider);
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
   * Changes the provider that is used by the Civil library.
   * All existing smart-contract object will switch to the new library behind the scenes.
   * This may invalidate any Ethereum calls in transit or event listening
   * @param web3Provider The new provider that shall replace the old one
   */
  public setProvider(web3Provider: Web3.Provider): void {
    this.web3Wrapper.setProvider(web3Provider);
  }
}
