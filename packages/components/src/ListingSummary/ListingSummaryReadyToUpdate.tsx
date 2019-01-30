import * as React from "react";
import { ChallengeResultsProps } from "../ChallengeResultsChart";
import { ListingSummaryComponentProps } from "./types";
import { StyledListingSummaryContainer, StyledListingSummary, StyledListingSummarySection } from "./styledComponents";
import ChallengeResults, { AppealChallengeResults } from "./ChallengeResults";
import ChallengeOrAppealStatementSummary from "./ChallengeOrAppealStatementSummary";
import NewsroomInfo from "./NewsroomInfo";
import SummaryActionButton from "./SummaryActionButton";
import ChallengeResultsBanner from "./ChallengeResultsBanner";

export interface ListingSummaryReadyToUpdateComponentProps
  extends ListingSummaryComponentProps,
    Partial<ChallengeResultsProps> {}

export class ListingSummaryReadyToUpdateComponent extends React.Component<ListingSummaryReadyToUpdateComponentProps> {
  public render(): JSX.Element {
    return (
      <StyledListingSummaryContainer>
        <StyledListingSummary>
          <ChallengeResultsBanner {...this.props} />

          <NewsroomInfo {...this.props} />

          <ChallengeResults {...this.props} />
          <AppealChallengeResults {...this.props} />

          <StyledListingSummarySection>
            <ChallengeOrAppealStatementSummary {...this.props} />
            <SummaryActionButton {...this.props} />
          </StyledListingSummarySection>
        </StyledListingSummary>
      </StyledListingSummaryContainer>
    );
  }
}
