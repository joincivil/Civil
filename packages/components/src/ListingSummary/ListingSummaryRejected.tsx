import * as React from "react";
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";
import { ListingSummaryComponentProps } from "./types";
import {
  StyledListingSummaryContainer,
  StyledListingSummary,
  StyledListingSummarySection,
  ChallengeResultsContain,
} from "./styledComponents";
import NewsroomInfo from "./NewsroomInfo";
import SummaryActionButton from "./SummaryActionButton";

export const ListingSummaryRejectedComponent: React.SFC<ListingSummaryComponentProps & ChallengeResultsProps> = props => {
  return (
    <StyledListingSummaryContainer>
      <StyledListingSummary hasTopPadding={true}>
        <NewsroomInfo {...props} />

        <ChallengeResultsContain>
          <ChallengeResults
            headerText={`Challenge #${props.challengeID} Results`}
            totalVotes={props.totalVotes}
            votesFor={props.votesFor}
            votesAgainst={props.votesAgainst}
            percentFor={props.percentFor}
            percentAgainst={props.percentAgainst}
          />
        </ChallengeResultsContain>
        <StyledListingSummarySection>
          <SummaryActionButton {...props} />
        </StyledListingSummarySection>
      </StyledListingSummary>
    </StyledListingSummaryContainer>
  );
};
