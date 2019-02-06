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
import { VoteTypeSummaryRowProps, VoteTypeLabelProps, VoteTypeColorProps } from "./types";
import { CHALLENGE_RESULTS_VOTE_TYPES } from "./constants";
import { colors } from "../styleConstants";

const voteTypeLabel: VoteTypeLabelProps = {
  [CHALLENGE_RESULTS_VOTE_TYPES.REMAIN]: (
    <>
      <span>✓</span> Accept
    </>
  ),
  [CHALLENGE_RESULTS_VOTE_TYPES.REMOVE]: (
    <>
      <span>✕</span> Reject
    </>
  ),
  [CHALLENGE_RESULTS_VOTE_TYPES.OVERTURN]: <>Overturn</>,
  [CHALLENGE_RESULTS_VOTE_TYPES.UPHOLD]: <>Uphold</>,
};

const voteColor: VoteTypeColorProps = {
  [CHALLENGE_RESULTS_VOTE_TYPES.REMAIN]: colors.accent.CIVIL_TEAL,
  [CHALLENGE_RESULTS_VOTE_TYPES.REMOVE]: colors.accent.CIVIL_RED,
  [CHALLENGE_RESULTS_VOTE_TYPES.OVERTURN]: colors.accent.CIVIL_ORANGE,
  [CHALLENGE_RESULTS_VOTE_TYPES.UPHOLD]: colors.accent.CIVIL_GREEN,
};

export const VoteTypeSummaryRow: React.StatelessComponent<VoteTypeSummaryRowProps> = props => {
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
