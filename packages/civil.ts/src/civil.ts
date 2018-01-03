import * as Debug from "debug";
import * as Web3 from "web3";

import { artifacts } from "./artifacts";
import { NewsroomContract } from "./contracts/generated/newsroom";
import { Newsroom } from "./contracts/newsroom";
import { EthAddress } from "./types";
import { Web3Wrapper } from "./utils/web3wrapper";

// See debug in npm, you can use `localStorage.debug = "civil:*" to enable logging
const debug = Debug("civil:main");

// Possible injected web3 instance, used for the injected provider
/* tslint:disable */
var web3: Web3 | undefined;
/* tslint:enable */

export class Civil {
  private web3Wrapper: Web3Wrapper;

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
  }

  public async newsroomDeployTrusted(): Promise<Newsroom> {
    const instance = await NewsroomContract.deployTrusted.sendTransactionAsync(this.web3Wrapper.web3);
    return new Newsroom(this.web3Wrapper, instance);
  }

  public newsroomAtUntrusted(address: EthAddress): Newsroom {
    const instance = NewsroomContract.atUntrusted(this.web3Wrapper.web3, address);
    return new Newsroom(this.web3Wrapper, instance);
  }
}
