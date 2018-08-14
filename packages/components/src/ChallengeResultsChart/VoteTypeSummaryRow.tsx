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
import { VoteTypeSummaryRowProps, VoteTypeLabelProps } from "./types";
import { CHALLENGE_RESULTS_VOTE_TYPES } from "./constants";

const voteTypeLabel: VoteTypeLabelProps = {
  [CHALLENGE_RESULTS_VOTE_TYPES.REMAIN]: (
    <>
      <span>✓</span> Remain
    </>
  ),

  [CHALLENGE_RESULTS_VOTE_TYPES.REMOVE]: (
    <>
      <span>✕</span> Remove
    </>
  ),
};

export const VoteTypeSummaryRow: React.StatelessComponent<VoteTypeSummaryRowProps> = props => {
  return (
    <VoteTypeSummary>
      <VotesPerTokenContainer>
        <VotesPerTokenVote vote={props.voteType}>{voteTypeLabel[props.voteType]}</VotesPerTokenVote>
        <VotesPerTokenCount>{props.votesCount}</VotesPerTokenCount>
      </VotesPerTokenContainer>

      <BreakdownBarContainer>
        <BreakdownBarPercentageLabel>
          {props.votesPercent.indexOf("NaN") < 0 ? props.votesPercent : "0"}%
        </BreakdownBarPercentageLabel>
        <BreakdownBarTotal>
          <BreakdownBarPercentage vote={props.voteType} percentage={props.votesPercent} />
        </BreakdownBarTotal>
      </BreakdownBarContainer>
    </VoteTypeSummary>
  );
};
