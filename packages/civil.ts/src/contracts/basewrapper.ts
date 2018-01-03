import BigNumber from "bignumber.js";
import { TxDataAll } from "../types";
import { Web3Wrapper } from "../utils/web3wrapper";

class BaseWrapper {
  private web3Wrapper: Web3Wrapper;

  constructor(web3Wrapper: Web3Wrapper) {
    this.web3Wrapper = web3Wrapper;
  }

  protected get defaults(): Promise<TxDataAll> {
    return Promise.resolve({
      gasPrice: this.web3Wrapper.web3.eth.gasPrice,
    });
  }
}
