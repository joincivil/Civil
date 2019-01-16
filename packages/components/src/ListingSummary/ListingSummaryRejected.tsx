import * as React from "react";
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";
import { ListingSummaryComponentProps } from "./types";
import {
  StyledListingSummaryContainer,
  StyledListingSummary,
  StyledListingSummarySection,
  StyledChallengeResultsHeader,
  ChallengeResultsContain,
} from "./styledComponents";
import NewsroomInfo from "./NewsroomInfo";
import SummaryActionButton from "./SummaryActionButton";

export const ListingSummaryRejectedComponent: React.SFC<
  ListingSummaryComponentProps & ChallengeResultsProps
> = props => {
  const challengeIDDisplay = props.challengeID ? `#${props.challengeID}` : "";
  return (
    <StyledListingSummaryContainer>
      <StyledListingSummary hasTopPadding={true}>
        <NewsroomInfo {...props} />

        <ChallengeResultsContain>
          <ChallengeResults
            headerText={`Challenge ${challengeIDDisplay} Results`}
            styledHeaderComponent={StyledChallengeResultsHeader}
            totalVotes={props.totalVotes}
            votesFor={props.votesFor}
            votesAgainst={props.votesAgainst}
            percentFor={props.percentFor}
            percentAgainst={props.percentAgainst}
            didChallengeSucceed={props.didChallengeSucceed}
          />
        </ChallengeResultsContain>
        <StyledListingSummarySection>
          <SummaryActionButton {...props} />
        </StyledListingSummarySection>
      </StyledListingSummary>
    </StyledListingSummaryContainer>
  );
};
