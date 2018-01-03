import * as Web3 from "web3";
import { TxDataPayable } from "../../types";

export class BaseContract {
  protected defaults: Partial<TxDataPayable>;
  protected instance: Web3.ContractInstance;

  constructor(instance: Web3.ContractInstance) {
    this.instance = instance;
  }
}
