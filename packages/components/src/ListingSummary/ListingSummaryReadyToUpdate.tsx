import * as React from "react";
import { ChallengeResultsProps } from "../ChallengeResultsChart";
import { ListingSummaryComponentProps } from "./types";
import { StyledListingSummary, StyledListingSummarySection } from "./styledComponents";
import ListingSummaryBase from "./ListingSummaryBase";
import ChallengeResults, { AppealChallengeResults } from "./ChallengeResults";
import ChallengeOrAppealStatementSummary from "./ChallengeOrAppealStatementSummary";
import NewsroomInfo from "./NewsroomInfo";
import SummaryActionButton from "./SummaryActionButton";
import ChallengeResultsBanner from "./ChallengeResultsBanner";

export interface ListingSummaryReadyToUpdateComponentProps
  extends ListingSummaryComponentProps,
    Partial<ChallengeResultsProps> {}

export const ListingSummaryReadyToUpdateComponent: React.SFC<ListingSummaryReadyToUpdateComponentProps> = props => {
  return (
    <ListingSummaryBase {...props}>
      <StyledListingSummary>
        <ChallengeResultsBanner {...props} />

        <NewsroomInfo {...props} />

        <ChallengeResults {...props} />
        <AppealChallengeResults {...props} />

        <StyledListingSummarySection>
          <ChallengeOrAppealStatementSummary {...props} />
          <SummaryActionButton {...props} />
        </StyledListingSummarySection>
      </StyledListingSummary>
    </ListingSummaryBase>
  );
};
