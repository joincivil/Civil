import * as React from "react";
import { ChallengeResultsProps } from "../ChallengeResultsChart";
import { ListingSummaryComponentProps } from "./types";
import { StyledListingSummary, StyledListingSummarySection } from "./styledComponents";
import ListingSummaryBase from "./ListingSummaryBase";
import NewsroomInfo from "./NewsroomInfo";
import SummaryActionButton from "./SummaryActionButton";
import ChallengeResults, { AppealChallengeResults } from "./ChallengeResults";
import AppealJudgementBanner from "./AppealJudgementBanner";

export const ListingSummaryRejectedComponent: React.SFC<
  ListingSummaryComponentProps & ChallengeResultsProps
> = props => {
  const { appeal, appealRequested } = props;

  const hasTopPadding = !appeal && !appealRequested;
  return (
    <ListingSummaryBase {...props}>
      <StyledListingSummary hasTopPadding={hasTopPadding}>
        <AppealJudgementBanner {...props} />
        <NewsroomInfo {...props} />

        <ChallengeResults {...props} />
        <AppealChallengeResults {...props} />

        <StyledListingSummarySection>
          <SummaryActionButton {...props} />
        </StyledListingSummarySection>
      </StyledListingSummary>
    </ListingSummaryBase>
  );
};
