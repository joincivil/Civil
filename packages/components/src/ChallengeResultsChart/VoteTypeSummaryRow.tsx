import * as React from "react";
import {
  VoteTypeSummary,
  VotesPerTokenContainer,
  VotesPerTokenVote,
  VotesPerTokenCount,
  BreakdownBarContainer,
  BreakdownBarPercentageLabel,
  BreakdownBarTotal,
  BreakdownBarPercentage,
} from "./styledComponents";
import { VoteTypeSummaryRowProps } from "./types";
import { voteColor } from "./constants";
import { voteTypeLabel } from "./ChallengeResultsChartTextComponents";

export const VoteTypeSummaryRow: React.FunctionComponent<VoteTypeSummaryRowProps> = props => {
  const color = voteColor[props.voteType];
  return (
    <VoteTypeSummary>
      <VotesPerTokenContainer>
        <VotesPerTokenVote vote={props.voteType}>{voteTypeLabel[props.voteType]}</VotesPerTokenVote>
        <VotesPerTokenCount>{props.votesCount}</VotesPerTokenCount>
      </VotesPerTokenContainer>

      <BreakdownBarContainer>
        <BreakdownBarPercentageLabel>
          {props.votesPercent && (props.votesPercent.indexOf("NaN") < 0 ? props.votesPercent : "0")}%
        </BreakdownBarPercentageLabel>
        <BreakdownBarTotal>
          <BreakdownBarPercentage vote={props.voteType} percentage={props.votesPercent} color={color} />
        </BreakdownBarTotal>
      </BreakdownBarContainer>
    </VoteTypeSummary>
  );
};
