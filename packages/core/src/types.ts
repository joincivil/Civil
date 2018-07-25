import {
  Bytes32,
  DecodedLogEntryEvent,
  DecodedTransactionReceipt,
  EthAddress,
  Hex,
  TxHash,
} from "@joincivil/typescript-types";
import BigNumber from "bignumber.js";
import { CivilLogs } from "./contracts/generated/events";

// For backwards compatibillity
export {
  Bytes32,
  DecodedTransactionReceipt,
  EthAddress,
  Hex,
  TxData,
  TxDataAll,
  TxDataBase,
  TxDataPayable,
  TxHash,
  Uri,
} from "@joincivil/typescript-types";
export { ContentProvider, ContentProviderCreator, ContentProviderOptions } from "./content/contentprovider";

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

export type CivilTransactionReceipt = DecodedTransactionReceipt<CivilLogs>;

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
