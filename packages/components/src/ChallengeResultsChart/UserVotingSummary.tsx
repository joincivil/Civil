import * as React from "react";

import { UserVotingSummaryProps } from "./types";
import { voteTypeLabel } from "./ChallengeResultsChartTextComponents";
import { UserVotingSummaryContainer, UserVotingSummaryColumn, UserVotingSummaryColHeader } from "./styledComponents";

export const UserVotingSummary: React.FunctionComponent<UserVotingSummaryProps> = props => {
  return (
    <UserVotingSummaryContainer>
      <UserVotingSummaryColumn>
        <UserVotingSummaryColHeader>Voted For</UserVotingSummaryColHeader>
        {voteTypeLabel[props.choice]}
      </UserVotingSummaryColumn>

      <UserVotingSummaryColumn>
        <UserVotingSummaryColHeader>Voting Tokens Committed</UserVotingSummaryColHeader>
        {props.numTokens}
      </UserVotingSummaryColumn>
    </UserVotingSummaryContainer>
  );
};
