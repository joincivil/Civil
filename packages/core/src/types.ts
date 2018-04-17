import BigNumber from "bignumber.js";
import * as Web3 from "web3";

import { CivilEventArgs } from "./contracts/generated/artifacts";

export type ContentId = number;

export interface ContentHeader {
  id?: ContentId;
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

export type TypedEventFilter<T> = { [P in keyof T]?: T[P] | Array<T[P]> };

export interface TxDataBase {
  gas?: number | string | BigNumber;
  gasPrice?: number | string | BigNumber;
  nonce?: number;
  data?: string;
}

export interface TxData extends TxDataBase {
  from?: EthAddress;
}

export interface TxDataPayable extends TxData {
  value: number | string | BigNumber;
}

export interface TxDataAll extends Partial<TxDataPayable> {
  to?: EthAddress;
}

export interface TransactionObject extends TxDataBase {
  from: EthAddress;
  value?: number | string | BigNumber;
  to?: EthAddress;
  data?: string;
}

export type EthAddress = string;
export type Bytes32 = string;
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

export { CivilEventArgs, Artifact } from "./contracts/generated/artifacts";

export interface DecodedTransactionReceipt<T> {
  blockHash: string;
  blockNumber: number;
  transactionHash: string;
  transactionIndex: number;
  from: string;
  to: string;
  status: null | string | 0 | 1;
  cumulativeGasUsed: number;
  gasUsed: number;
  contractAddress: string | null;
  logs: Array<Web3.DecodedLogEntry<T> | Web3.LogEntry>;
}

export type CivilTransactionReceipt = DecodedTransactionReceipt<CivilEventArgs>;

export interface TwoStepEthTransaction<T = CivilTransactionReceipt> {
  txHash: TxHash;
  awaitReceipt(blockConfirmations?: number): Promise<T>;
}

/**
 * This represents the Listing data
 */
export interface Listing {
  appExpiry: BigNumber;
  isWhitelisted: boolean;
  owner: EthAddress;
  unstakedDeposit: BigNumber;
  challengeID: BigNumber;
}

/**
 * The data associated with a Challenge
 */
export interface Challenge {
  rewardPool: BigNumber;
  challenger: EthAddress;
  resolved: boolean;
  stake: BigNumber;
  totalTokens: BigNumber;
}

/**
 * This represents the Appeal data for a Listing
 */
export interface Appeal {
  requester: EthAddress;
  appealFeePaid: BigNumber;
  appealPhaseExpiry: BigNumber;
  appealGranted: boolean;
  appealOpenToChallengeExpiry: BigNumber;
  appealChallengeID: BigNumber;
}

/**
 * This enum represents the various states a listing can be in.
 * A listing can be both whitelisted and in the challenge process.
 */
export enum ListingState {
  NOT_FOUND,
  APPLYING,
  READY_TO_WHITELIST,
  CHALLENGED_IN_COMMIT_VOTE_PHASE,
  CHALLENGED_IN_REVEAL_VOTE_PHASE,
  READY_TO_RESOLVE_CHALLENGE,
  WAIT_FOR_APPEAL_REQUEST,
  IN_APPEAL_PHASE,
  READY_TO_RESOLVE_APPEAL,
  WHITELISTED_WITHOUT_CHALLENGE,
}

export type PollID = BigNumber;

/**
 * This enum represents the various states a Parameterizer Proposal can be in.
 */
export enum ParamProposalState {
  NOT_FOUND,
  APPLYING,
  READY_TO_PROCESS,
  CHALLENGED_IN_COMMIT_VOTE_PHASE,
  CHALLENGED_IN_REVEAL_VOTE_PHASE,
  READY_TO_RESOLVE_CHALLENGE,
}

/**
 * Interface describing the data associated with Parameterizer Proposals
 */
export interface ParamProp {
  propID: Bytes32;
  paramName: string;
  proposedValue: BigNumber;
  pollID?: BigNumber;
}
