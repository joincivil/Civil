import * as React from "react";
import { ChallengeResultsProps } from "../ChallengeResultsChart";
import { ListingSummaryComponentProps } from "./types";
import { StyledListingSummaryContainer, StyledListingSummary, StyledListingSummarySection } from "./styledComponents";
import NewsroomInfo from "./NewsroomInfo";
import SummaryActionButton from "./SummaryActionButton";
import ChallengeResults, { AppealChallengeResults } from "./ChallengeResults";
import AppealJudgementBanner from "./AppealJudgementBanner";

export const ListingSummaryRejectedComponent: React.SFC<
  ListingSummaryComponentProps & ChallengeResultsProps
> = props => {
  const { appeal } = props;

  const hasTopPadding = !(appeal && appeal.appealGranted);
  return (
    <StyledListingSummaryContainer>
      <StyledListingSummary hasTopPadding={hasTopPadding}>
        <AppealJudgementBanner {...props} />
        <NewsroomInfo {...props} />

        <ChallengeResults {...props} />
        <AppealChallengeResults {...props} />

        <StyledListingSummarySection>
          <SummaryActionButton {...props} />
        </StyledListingSummarySection>
      </StyledListingSummary>
    </StyledListingSummaryContainer>
  );
};
