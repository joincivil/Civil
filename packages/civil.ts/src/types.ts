import BigNumber from "bignumber.js";
import * as Web3 from "web3";

export interface Artifact {
  contractName: string;
  abi: Web3.ContractAbi;
  bytecode: string;
  deployedBytecode: string;
  networks: {
    [id: number]: {
      address: string;
    };
  };
}

export interface ContentHeader {
  id?: number;
  author: EthAddress;
  timestamp: Date;
  uri: string;
}

// TODO(ritave, dankins): Decide on content schema and update this type
export interface NewsroomContent extends ContentHeader {
  content: string;
}

export interface MapObject<T = any> {
  [index: string]: T;
}

export type FilterCallback = (err: Error, result: Web3.LogEntryEvent) => void;

export type EventFunction<T> = (
  paramFilters?: T,
  filterObject?: Web3.FilterObject,
  callback?: FilterCallback,
) => Web3.FilterResult;

export type TypedEventFilter<T> = {
  [P in keyof T]?: T[P]|Array<T[P]>;
};

export interface TxDataBase {
  gas?: number|string|BigNumber;
  gasPrice?: number|string|BigNumber;
  nonce?: number;
}

export interface TxData extends TxDataBase {
  from?: EthAddress;
}

export interface TxDataPayable extends TxData {
  value: number|string|BigNumber;
}

export type TxDataAll = Partial<TxDataPayable>;

export interface TransactionObject extends TxDataBase {
  from: EthAddress;
  value?: number|string|BigNumber;
  to?: EthAddress;
  data?: string;
}

export type EthAddress = string;
export type TxHash = string;
export type Uri = string;
