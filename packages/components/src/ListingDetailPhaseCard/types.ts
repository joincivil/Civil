import { EthAddress } from "@joincivil/core";

export interface ListingDetailPhaseCardComponentProps {
  challenge?: any;
  listing?: any;
  listingAddress?: EthAddress;
  transactions?: any[];
  constitutionURI?: string;
  onMobileTransactionClick?(): any;
}

export interface PhaseWithExpiryProps {
  endTime: number;
  phaseLength: number;
  secondaryPhaseLength?: number;
}

export interface SubmitChallengeProps {
  submitChallengeURI?: string;
}

export interface RequestAppealProps {
  requestAppealURI?: string;
}

export interface ChallengePhaseProps {
  challengeID?: string;
  isViewingUserChallenger?: boolean;
  challenger?: EthAddress;
  rewardPool?: string;
  stake?: string;
  userHasCommittedVote?: boolean;
  userHasRevealedVote?: boolean;
}

export interface VoteBaseProps {
  newsroomName?: string;
  isAppealChallenge?: boolean;
  salt?: string;
  voteOption?: string;
  onInputChange(propsData: any, validateFn?: () => boolean): void;
  postExecuteTransactions?(): any;
}

export interface CommitVoteProps extends VoteBaseProps {
  tokenBalance: number;
  votingTokenBalance: number;
  tokenBalanceDisplay: string;
  votingTokenBalanceDisplay: string;
  numTokens?: string;
  userHasCommittedVote?: boolean;
  userHasRevealedVote?: boolean;
  buttonText?: string | JSX.Element;
  onCommitMaxTokens(): void;
  onReviewVote(): void;
}

export interface RevealVoteProps extends VoteBaseProps {
  transactions: any[];
}

export interface AppealDecisionProps {
  appealRequested?: boolean;
  appealGranted?: boolean;
  submitAppealChallengeURI?: string;
}

export interface AppealChallengePhaseProps {
  appealChallengeID?: string;
}

export interface AppealChallengeResultsProps {
  appealChallengeTotalVotes?: string;
  appealChallengeVotesFor?: string;
  appealChallengeVotesAgainst?: string;
  appealChallengePercentFor?: string;
  appealChallengePercentAgainst?: string;
  didAppealChallengeSucceed?: boolean;
}
