import BigNumber from "bignumber.js";
import * as Web3 from "web3";
import { DecodedLogEntry, DecodedLogEntryEvent } from "@joincivil/typescript-types";
import { CivilLogs } from "./contracts/generated/events";

export type ContentId = number;

export interface ContentHeader {
  id?: ContentId;
  author?: EthAddress;
  timestamp?: Date;
  uri: string;
  contentHash: Hex;
}

// TODO(ritave, dankins): Decide on content schema and update this type
export interface NewsroomContent extends ContentHeader {
  content: any;
}

export interface SignedRevision {
  newsroomAddress: EthAddress;
  contentHash: Hex;
  author: EthAddress;
  signature: EthAddress;
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

export type EthAddress = string;
export type Bytes32 = string;
export type TxHash = string;
export type Uri = string;
export type Hex = string;

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
export { Web3Wrapper } from "./utils/web3wrapper";

export interface TwoStepEthTransaction<T = CivilTransactionReceipt> {
  txHash: TxHash;
  awaitReceipt(blockConfirmations?: number): Promise<T>;
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

/**
 * The data associated with a Challenge
 */
export interface ChallengeData {
  rewardPool: BigNumber;
  challenger: EthAddress;
  resolved: boolean;
  stake: BigNumber;
  totalTokens: BigNumber;
  poll: PollData;
  requestAppealExpiry: BigNumber;
  appeal?: AppealData;
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

/**
 * Minimal amount of information needed to recover the public address of signer
 */
export interface EthSignedMessageRecovery {
  messageHash: Hex;
  // RLP Encoded
  signature: Hex;
}

export interface EthSignedMessage extends EthSignedMessageRecovery {
  message: string;
  /**
   * To avoid bad actors signing transactions on your behalf, Ethereum nodes prepend
   * additional string on top of your message before signing, according to the spec.
   *
   * This property contains the actual raw string that was hashed and signed.
   */
  rawMessage: string;
  // Coordinates of the signature (32 bytes first and 32 bytes second)
  r: Hex;
  s: Hex;
  // Recovery value + 27
  v: Hex;
  signer: EthAddress;
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
  Reporter = "reporter",
}
