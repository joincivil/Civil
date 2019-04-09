import * as React from "react";
import {
  VoteTypeSummary,
  VotesPerTokenContainer,
  VotesPerTokenVote,
  VotesPerTokenCount,
  BreakdownBarContainer,
  BreakdownBarPercentageLabel,
  BreakdownBarTotalContainer,
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
      </VotesPerTokenContainer>

      <BreakdownBarContainer>
        <BreakdownBarPercentageLabel>
          {props.votesPercent && (props.votesPercent.indexOf("NaN") < 0 ? props.votesPercent : "0")}%
        </BreakdownBarPercentageLabel>

        <BreakdownBarTotalContainer>
          <BreakdownBarTotal>
            <BreakdownBarPercentage vote={props.voteType} percentage={props.votesPercent} color={color} />
          </BreakdownBarTotal>
          <VotesPerTokenCount>{props.votesCount}</VotesPerTokenCount>
        </BreakdownBarTotalContainer>
      </BreakdownBarContainer>
    </VoteTypeSummary>
  );
};
