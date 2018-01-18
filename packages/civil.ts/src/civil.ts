import * as Debug from "debug";
import * as Web3 from "web3";

import { artifacts } from "./artifacts";
import { NewsroomContract } from "./contracts/generated/newsroom";
import { Newsroom } from "./contracts/newsroom";
import { Artifact, EthAddress, TxData } from "./types";
import { AbiDecoder } from "./utils/abidecoder";
import { Web3Wrapper } from "./utils/web3wrapper";

// See debug in npm, you can use `localStorage.debug = "civil:*" to enable logging
const debug = Debug("civil:main");

// Possible injected web3 instance, used for the injected provider
/* tslint:disable */
var web3: Web3 | undefined;
/* tslint:enable */

/**
 * Single entry-point to the civil.ts library
 * It abstracts most of the web3 and Ethereum communication.
 * Since all the calls to the Ethereum network take time, it is written using Promises,
 * and all of them can fail (for eg. when the connection to the node drops)
 */
export class Civil {
  private web3Wrapper: Web3Wrapper;
  private abiDecoder: AbiDecoder;

  /**
   * An optional object, conforming to Web3 provider interface can be provided.
   * If no provider is given, civil.ts shall try to automagically infer which provider to use.
   * First by checking for any injected ones (such as Metamask) and in the last case defaulting
   * to default http on localhost.
   * @param web3Provider Explicitly provide an Ethereum Node connection provider
   */
  constructor(web3Provider?: Web3.Provider) {
    let provider = web3Provider;
    if (!provider) {
      // Try to use the window's injected provider
      if (typeof web3 !== "undefined") {
        provider = web3.currentProvider;
      } else {
        // TODO(ritave): Research using infura
        provider = new Web3.providers.HttpProvider("http://localhost:8545");
        debug("No web3 provider provided or found injected, defaulting to HttpProvider");
      }
    }
    this.web3Wrapper = new Web3Wrapper(provider);
    this.abiDecoder = new AbiDecoder(Object.values<Artifact>(artifacts).map((a) => a.abi));
  }

  /**
   * @returns Currently default user account used, undefined if none unlocked/found
   */
  public get userAccount() {
    return this.web3Wrapper.account;
  }

  /**
   * Create a new Newsroom on the current Ethereum network with the bytecode included in this library
   * The smart contract is trusted since it comes from a trusted source (us).
   * This call may require user input - such as approving a transaction in Metamask
   */
  public async newsroomDeployTrusted(): Promise<Newsroom> {
    const txData: TxData = { from: this.userAccount };
    const instance = await NewsroomContract.deployTrusted.sendTransactionAsync(this.web3Wrapper.web3, txData);
    return new Newsroom(this.web3Wrapper, instance, this.abiDecoder);
  }

  /**
   * Returns a Newsroom object, which is an abstraction layer to
   * the smart-contract located a Ethereum on `address` in the current network.
   * No sanity checks are done concerning that smart-contracts, and so the contract
   * might a bad actor or not implementing Newsroom ABIs at all.
   * @param address The address on current Ethereum network where the smart-contract is located
   */
  public newsroomAtUntrusted(address: EthAddress): Newsroom {
    const instance = NewsroomContract.atUntrusted(this.web3Wrapper.web3, address);
    return new Newsroom(this.web3Wrapper, instance, this.abiDecoder);
  }

  /**
   * Changes the provider that is used by the Civil library.
   * All existing smart-contract object will switch to the new library behind the scenes.
   * This may invalidate any Ethereum calls in transit or event listening
   * @param web3Provider The new provider that shall replace the old one
   */
  public setProvider(web3Provider: Web3.Provider) {
    this.web3Wrapper.setProvider(web3Provider);
  }
}
