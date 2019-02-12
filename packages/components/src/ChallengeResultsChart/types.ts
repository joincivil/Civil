import * as React from "react";

export interface ChallengeResultsProps {
  challengeID?: string;
  totalVotes: string;
  votesFor: string;
  votesAgainst: string;
  percentFor: string;
  percentAgainst: string;
  didChallengeOriginallySucceed?: boolean;
  didChallengeSucceed?: boolean;
  isAppealChallenge?: boolean;
  headerText?: string;
  noHeader?: boolean;
  noExplainerText?: boolean;
  styledHeaderComponent?: React.ComponentClass;
  collapsable?: boolean;
  open?: boolean;
}

export interface BreakdownBarPercentageProps {
  vote: string;
  percentage: string;
  color: string;
}

export interface VotesPerTokenVoteProps {
  vote?: string;
}

export interface VoteTypeSummaryRowProps {
  voteType: string;
  votesCount: string;
  votesPercent: string;
}

export interface VoteTypeLabelProps {
  [index: string]: JSX.Element;
}

export interface VoteTypeColorProps {
  [index: string]: string;
}

export interface UserVotingSummaryProps {
  choice: string;
  numTokens: string;
}
