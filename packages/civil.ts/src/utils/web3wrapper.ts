import { Observable } from "rxjs";
import * as Web3 from "web3";
import { promisify } from "../utils/language";

import { Artifact, MapObject } from "../types";

// TODO(ritave): Estimate defaults from the node
const defaults = {
  gas: 412388,
  gasPrice: 100000000000,
};

export class Web3Wrapper {
  public web3: Web3;

  constructor(provider: Web3.Provider) {
    this.setProvider(provider);
  }

  public setProvider(provider: Web3.Provider) {
    this.web3 = new Web3(provider);
    if (!this.web3.eth.defaultAccount && this.web3.eth.accounts.length > 0) {
      this.web3.eth.defaultAccount = this.web3.eth.accounts[0];
    }
  }

  public getReceipt(txHash:string): Promise<Web3.TransactionReceipt> {
    return promisify<Web3.TransactionReceipt>(this.web3.eth.getTransactionReceipt)(txHash);
  }
}
