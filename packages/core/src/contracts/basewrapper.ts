import { EthAddress } from "../types";
import { EthApi } from "../utils/ethapi";
import { BaseContract } from "./basecontract";

export class BaseWrapper<InstanceType extends BaseContract> {
  protected instance: InstanceType;
  protected ethApi: EthApi;

  constructor(ethApi: EthApi, instance: InstanceType) {
    this.instance = instance;
    this.ethApi = ethApi;
  }

  /**
   * @returns An addess of the wrapped smart-contract
   */
  public get address(): EthAddress {
    return this.instance.address;
  }
}
