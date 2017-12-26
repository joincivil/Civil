import * as Debug from "debug";
import * as Web3 from "web3";

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
      // Try to use the injected provider
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

  public newsroomAtUntrusted(address: EthAddress): Newsroom {
    return new Newsroom(this.web3Wrapper, address);
  }
}
