import { EthAddress } from "@joincivil/typescript-types";
import { EthApi } from "@joincivil/ethapi";
import { BaseContract } from "./basecontract";

export class BaseWrapper<InstanceType extends BaseContract> {
  protected instance: InstanceType;
  protected ethApi: EthApi;
  protected defaultBlock: number;

  constructor(ethApi: EthApi, instance: InstanceType, defaultBlock: number) {
    this.instance = instance;
    this.ethApi = ethApi;
    this.defaultBlock = defaultBlock;
  }

  /**
   * @returns An addess of the wrapped smart-contract
   */
  public get address(): EthAddress {
    return this.instance.address;
  }
}
