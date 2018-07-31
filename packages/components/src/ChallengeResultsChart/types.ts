import * as React from "react";

export interface ChallengeResultsProps {
  totalVotes: string;
  votesFor: string;
  votesAgainst: string;
  percentFor: string;
  percentAgainst: string;
  headerText?: string;
  styledHeaderComponent?: React.StatelessComponent;
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
