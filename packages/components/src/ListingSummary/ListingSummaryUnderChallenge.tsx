import * as React from "react";

import { ChallengeResultsProps } from "../ChallengeResultsChart";

import { ListingSummaryComponentProps } from "./types";
import { StyledListingSummary, StyledListingSummarySection } from "./styledComponents";
import ListingSummaryBase from "./ListingSummaryBase";
import ChallengeOrAppealStatementSummary from "./ChallengeOrAppealStatementSummary";
import ListingPhaseLabel from "./ListingPhaseLabel";
import NewsroomInfo from "./NewsroomInfo";
import SummaryActionButton from "./SummaryActionButton";
import ChallengeResults from "./ChallengeResults";
import PhaseCountdownOrTimestamp from "./PhaseCountdownOrTimestamp";
import AppealJudgementBanner from "./AppealJudgementBanner";

export interface ListingSummaryUnderChallengeComponentProps
  extends ListingSummaryComponentProps,
    Partial<ChallengeResultsProps> {}

export const ListingSummaryUnderChallengeComponent: React.FunctionComponent<
  ListingSummaryUnderChallengeComponentProps
> = props => {
  const { appeal, appealRequested } = props;

  const hasTopPadding = !appeal && !appealRequested;

  return (
    <ListingSummaryBase {...props}>
      <StyledListingSummary hasTopPadding={hasTopPadding}>
        <AppealJudgementBanner {...props} />

        <ListingPhaseLabel {...props} />

        <NewsroomInfo {...props} />

        <ChallengeResults {...props} />

        <StyledListingSummarySection>
          <ChallengeOrAppealStatementSummary {...props} />

          <PhaseCountdownOrTimestamp {...props} />

          <SummaryActionButton {...props} />
        </StyledListingSummarySection>
      </StyledListingSummary>
    </ListingSummaryBase>
  );
};
