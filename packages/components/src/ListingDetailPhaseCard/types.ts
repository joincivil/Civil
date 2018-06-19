import { EthAddress } from "@joincivil/core";
import BigNumber from "bignumber.js";

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
  // challengeID: BigNumber;
  tokenBalance: number;
  salt: string | undefined;
  numTokens: number | undefined;
  onInputChange(propsData: any): void;
  submit(): void;
}
