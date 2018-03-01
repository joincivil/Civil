import * as Web3 from "web3";
import { TxDataPayable } from "../types";

export interface ContractConfiguration {
  estimationMultiplier: number;
  txDefaults: Partial<TxDataPayable>;
}

const DEFAULT_CONFIG: ContractConfiguration = {
  estimationMultiplier: 1.5,
  txDefaults: {},
};

export class BaseContract {
  protected configuration: ContractConfiguration;
  protected instance: Web3.ContractInstance;

  constructor(instance: Web3.ContractInstance, config: Partial<ContractConfiguration> = {}) {
    this.instance = instance;
    this.configuration = {
      ...DEFAULT_CONFIG,
      ...config,
    };
  }

  public get address(): string {
    return this.instance.address;
  }
}
