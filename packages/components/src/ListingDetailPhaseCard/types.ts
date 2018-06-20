import { EthAddress } from "@joincivil/core";

export interface ListingDetailPhaseCardComponentProps {
  challenge?: any;
  listing?: any;
  transactions?: any[];
}

export interface PhaseWithExpiryProps {
  endTime: number;
  phaseLength: number;
}

export interface ChallengePhaseProps {
  challenger: EthAddress;
  rewardPool: string;
  stake: string;
}

export interface ChallengeResultsProps {
  totalVotes: string;
  votesFor: string;
  votesAgainst: string;
  percentFor: string;
  percentAgainst: string;
}

export interface CommitVoteProps {
  tokenBalance: number;
  salt?: string;
  numTokens?: string;
  transactions: any[];
  onInputChange(propsData: any, validateFn?: () => boolean): void;
}

export interface RevealVoteProps {
  salt: string | undefined;
  transactions: any[];
  onInputChange(propsData: any, validateFn?: () => boolean): void;
}

export interface RevealVoteProps {
  salt: string | undefined;
  transactions: any[];
  onInputChange(propsData: any): void;
}
