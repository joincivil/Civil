
import { Contract as IContract } from "./interfaces/contract";

import Contract from "web3/eth/contract";
import { Tx as SendOptions } from "web3/eth/types";
import { EthApi } from "@joincivil/ethapi";

export interface ContractConfiguration {
  estimationMultiplier: number;
  txDefaults: Partial<SendOptions>;
}

const DEFAULT_CONFIG: ContractConfiguration = {
  estimationMultiplier: 1.5,
  txDefaults: {},
};

export class BaseContract implements IContract {
  protected configuration: ContractConfiguration;
  protected instance: Contract;
  protected ethApi: EthApi;

  constructor(instance: Contract, ethApi: EthApi, config: Partial<ContractConfiguration> = {}) {
    this.instance = instance;
    this.configuration = {
      ...DEFAULT_CONFIG,
      ...config,
    };
    this.ethApi = ethApi;
  }

  public get address(): string {
    return this.instance.options.address;
  }
}
