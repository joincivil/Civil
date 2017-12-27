import * as Web3 from "web3";

export interface Artifact {
  contractName: string;
  abi: Web3.ContractAbi;
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

export type EventFunction = (
  paramFilters?: MapObject,
  filterObject?: Web3.FilterObject,
  callback?: FilterCallback,
) => Web3.FilterResult;

export type EthAddress = string;
export type Uri = string;
