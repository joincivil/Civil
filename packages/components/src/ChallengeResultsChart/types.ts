import * as React from "react";

export interface ChallengeResultsProps {
  challengeID?: string;
  totalVotes: string;
  votesFor: string;
  votesAgainst: string;
  percentFor: string;
  percentAgainst: string;
  didChallengeSucceed: boolean;
  headerText?: string;
  noHeader?: boolean;
  noExplainerText?: boolean;
  styledHeaderComponent?: React.StatelessComponent;
  collapsable?: boolean;
  open?: boolean;
}

export interface BreakdownBarPercentageProps {
  vote: string;
  percentage: string;
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
