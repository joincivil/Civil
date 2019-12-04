import { AbiItem } from "web3-utils";
import { TransactionReceipt, Log } from "web3-core";

// make sure that typescript-types/ethers is using the same version as web3's abi-encoder ether
import { utils } from "ethers";

export type BigNumber = utils.BigNumber;
export const { BigNumber, bigNumberify, parseEther, formatEther, parseUnits, commify } = utils;

// this isn't exported: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/web3/eth/contract.d.ts#L6
export interface ContractOptions {
  address?: string;
  jsonInterface?: AbiItem[];
  data?: string;
  from?: string;
  gasPrice?: string;
  gas?: number;
}

export interface DecodedLogBase<A, E extends string> {
  event: E;
  returnValues: A;
  args: A;
}

export interface DecodedLogEntry<A = any, E extends string = string> extends Log, DecodedLogBase<A, E> {}

export interface DecodedLogEntryEvent<A = any, E extends string = string> extends DecodedLogBase<A, E>, Log {}

export interface DecodedTransactionReceipt<L extends Log = Log> extends TransactionReceipt {
  logs: L[];
}

export type EthAddress = string;
export type Hex = string;

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

export interface EthContentHeader extends BaseContentHeader, SignedContentHeader {
  blockNumber?: number | null;
  transactionHash?: TxHash | null;
}

export type ContentData = string | object;
export type ContentId = number;
export type RevisionId = ContentId;

export interface StorageHeader {
  uri: string;
  /**
   * Normalized content schema hashed using keccak256 algorithm
   */
  contentHash?: Hex;
}

export interface SignedContentHeader {
  author: EthAddress;
  signature: Hex;
  verifySignature(): boolean;
}

export interface BaseContentHeader extends StorageHeader {
  contentId?: ContentId;
  revisionId?: RevisionId;
  timestamp?: Date;
}

/** Any piece of newsroom content, e.g. an article or the charter. */
export interface NewsroomContent extends EthContentHeader {
  content: ContentData;
}

/** The first article: the charter. */
export interface CharterContent extends NewsroomContent {
  content: CharterData;
}

export interface ConstitutionSignature {
  signer: EthAddress;
  signature: Hex;
  message: string;
}

export interface CharterData {
  name: string;
  logoUrl: string;
  newsroomUrl: string;
  tagline: string;
  roster: RosterMember[];
  signatures: ConstitutionSignature[];
  mission: {
    purpose: string;
    structure: string;
    revenue: string;
    encumbrances: string;
    miscellaneous: string;
  };
  socialUrls?: { [type: string]: string };
}

export interface RosterMember {
  name: string;
  role: string;
  bio: string;
  ethAddress?: EthAddress;
  socialUrls?: { [type: string]: string };
  avatarUrl?: string;
  signature?: string;
}

export interface ApprovedRevision {
  author: EthAddress;
  contentHash: Hex;
  signature: Hex;
  newsroomAddress: EthAddress;
  date: string;
}

export interface NewsroomListing {
  newsroom: NewsroomWrapper;
  listing: ListingWrapper;
}

export interface NewsroomWrapper {
  address: EthAddress;
  data: NewsroomData;
}

export interface NewsroomData {
  name: string;
  owner: EthAddress;
  owners: EthAddress[];
  charterHeader?: EthContentHeader;
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
  prevChallengeID?: BigNumber;
  prevChallenge?: ChallengeData;
  approvalDate?: BigNumber;
  lastGovState?: string;
  lastUpdatedDate?: BigNumber;
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
  challengeStatementURI?: string;
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
  canUserReveal?: boolean;
  didUserCollect?: boolean;
  canUserCollect?: boolean;
  didUserRescue?: boolean;
  canUserRescue?: boolean;
  didCollectAmount?: BigNumber;
  isVoterWinner?: boolean;
  salt?: BigNumber;
  numTokens?: BigNumber;
  choice?: BigNumber;
  voterReward?: BigNumber;
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
  appealStatementURI?: string;
  appealGrantedStatementURI?: string;
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
  appealChallengeStatementURI?: string;
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

export interface ParamPropChallengeData {
  rewardPool: BigNumber;
  challenger: EthAddress;
  resolved: boolean;
  stake: BigNumber;
  totalTokens: BigNumber;
  poll: PollData;
}

export interface PollIDWithBlockNum {
  pollID: BigNumber;
  blockNum: number;
}

export interface AppealChallengeChallengeID {
  appealChallengeID: BigNumber;
  challengeID: BigNumber;
}

export interface WrappedChallengeID {
  listingAddress: EthAddress;
  challengeID: BigNumber;
}

export interface WrappedAppealChallengeID {
  listingAddress: EthAddress;
  appealChallengeToChallengeID: AppealChallengeChallengeID;
}

export interface WrappedPropID {
  propID: string;
  challengeID: BigNumber;
}

export interface MapObject<T = any> {
  [index: string]: T;
}
