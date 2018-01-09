import BigNumber from "bignumber.js";
import * as Web3 from "web3";
import { NewsroomEventArgs } from "./contracts/generated/newsroom";

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
  data?: string;
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

export enum SolidityTypes {
  Address = "address",
  Uint256 = "uint256",
  Uint8 = "uint8",
  Uint = "uint",
}

// There is one in web3 typing, but it's not existent during runtimes
// we force it to exist by creating one with the same name
export enum AbiType {
  Function = "function",
  Constructor = "constructor",
  Event = "event",
  Fallback = "fallback",
}

// When new contracts come in, add more
export type ContractEventArgs = NewsroomEventArgs;
