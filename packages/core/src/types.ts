import { DecodedLogEntry, DecodedLogEntryEvent, EthAddress, Hex } from "@joincivil/typescript-types";
import BigNumber from "bignumber.js";
import * as Web3 from "web3";
import { CivilLogs } from "./contracts/generated/events";

// For backwards compatibillity
export { EthAddress, Hex } from "@joincivil/typescript-types";

export type ContentData = string | object;
export type ContentId = number;
export type RevisionId = ContentId;

export interface StorageHeader {
  uri: string;
  /**
   * Normalized content schema hashed using keccak256 algorithm
   */
  contentHash: Hex;
}

export interface SignedContentHeader {
  author: EthAddress;
  signature: Hex;
  verifySignature(): boolean;
}

export interface BaseContentHeader extends StorageHeader {
  contentId: ContentId;
  revisionid?: RevisionId;
  timestamp: Date;
}

export interface EthContentHeader extends BaseContentHeader, SignedContentHeader {}

// TODO(ritave, dankins): Decide on content schema and update this type
export interface NewsroomContent extends EthContentHeader {
  content: ContentData;
}

export interface ApprovedRevision {
  author: EthAddress;
  contentHash: Hex;
  signature: Hex;
  newsroomAddress: EthAddress;
}

export interface MapObject<T = any> {
  [index: string]: T;
}

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

export interface DecodedTransactionReceipt<L extends DecodedLogEntry> {
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
  logs: Array<L | Web3.LogEntry>;
}

export type CivilTransactionReceipt = DecodedTransactionReceipt<CivilLogs>;

export { ContentProvider, ContentProviderCreator, ContentProviderOptions } from "./content/contentprovider";
export { EthApi } from "./utils/ethapi";

export interface TwoStepEthTransaction<T = CivilTransactionReceipt> {
  txHash: TxHash;
  awaitReceipt(blockConfirmations?: number): Promise<T>;
}

export interface NewsroomWrapper {
  address: EthAddress;
  data: NewsroomData;
}

export interface NewsroomData {
  name: string;
  owners: EthAddress[];
  charter?: NewsroomContent;
}

export interface ListingWrapper {
  address: EthAddress;
  data: ListingData;
}

/**
 * This represents the Listing data
 */
export interface ListingData {
  appExpiry: BigNumber;
  isWhitelisted: boolean;
  owner: EthAddress;
  unstakedDeposit: BigNumber;
  challengeID: BigNumber;
  challenge?: ChallengeData;
}

export interface PollData {
  commitEndDate: BigNumber;
  revealEndDate: BigNumber;
  voteQuorum: BigNumber;
  votesFor: BigNumber;
  votesAgainst: BigNumber;
}

export interface WrappedChallengeData {
  listingAddress: EthAddress;
  challengeID: BigNumber;
  challenge: ChallengeData;
}

/**
 * The data associated with a Challenge
 */
export interface ChallengeData {
  statement?: ContentData;
  rewardPool: BigNumber;
  challenger: EthAddress;
  resolved: boolean;
  stake: BigNumber;
  totalTokens: BigNumber;
  poll: PollData;
  requestAppealExpiry: BigNumber;
  appeal?: AppealData;
}

export interface UserChallengeData {
  didUserCommit?: boolean;
  didUserReveal?: boolean;
  didUserCollect?: boolean;
  didUserRescue?: boolean;
  didCollectAmount?: BigNumber;
  isVoterWinner?: boolean;
}

/**
 * This represents the Appeal data for a Listing
 */
export interface AppealData {
  requester: EthAddress;
  appealFeePaid: BigNumber;
  appealPhaseExpiry: BigNumber;
  appealGranted: boolean;
  appealOpenToChallengeExpiry: BigNumber;
  appealChallengeID: BigNumber;
  appealChallenge?: AppealChallengeData;
}

/**
 * The data associated with a Challenge
 */
export interface AppealChallengeData {
  rewardPool: BigNumber;
  challenger: EthAddress;
  resolved: boolean;
  stake: BigNumber;
  totalTokens: BigNumber;
  poll: PollData;
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

export interface Param {
  paramName: string;
  value: BigNumber;
}

// tslint:disable-next-line
export interface TimestampedEvent<T extends DecodedLogEntryEvent> extends DecodedLogEntryEvent {
  timestamp(): Promise<number>;
}

// TODO(ritave): generate roles from smart-contract
/**
 * Roles that are supported by the Newsroom
 * - Editor can approve or deny contant, as well as assigning roles to actors
 * - Reported who can propose content for the Editors to approve
 */
export enum NewsroomRoles {
  Editor = "editor",
}
