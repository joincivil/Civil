import { Observable } from "rxjs";
import * as Web3 from "web3";
import { promisify } from "../utils/language";

import { Artifact, EthAddress, MapObject } from "../types";

export class Web3Wrapper {
  public web3: Web3;

  constructor(provider: Web3.Provider) {
    this.setProvider(provider);
  }

  public setProvider(provider: Web3.Provider) {
    this.web3 = new Web3(provider);
    this.web3.eth.defaultAccount = this.account!!;
  }

  public get account() {
    if (this.web3.eth.defaultAccount !== undefined) {
      return this.web3.eth.defaultAccount;
    }
    if (this.web3.eth.accounts.length > 0) {
      return this.web3.eth.accounts[0];
    }
    return undefined;
  }

  public getReceipt(txHash: string): Promise<Web3.TransactionReceipt> {
    return promisify<Web3.TransactionReceipt>(this.web3.eth.getTransactionReceipt)(txHash);
  }
}
