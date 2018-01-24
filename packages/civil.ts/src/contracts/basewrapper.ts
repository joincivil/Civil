import { Web3Wrapper } from "../utils/web3wrapper";
import { BaseContract } from "./basecontract";

export class BaseWrapper<InstanceType extends BaseContract> {
  protected instance: InstanceType;
  protected web3Wrapper: Web3Wrapper;

  constructor(web3Wrapper: Web3Wrapper, instance: InstanceType) {
    this.instance = instance;
    this.web3Wrapper = web3Wrapper;
  }

  /**
   * @returns An addess of the wrapped smart-contract
   */
  public get address() {
    return this.instance.address;
  }
}
