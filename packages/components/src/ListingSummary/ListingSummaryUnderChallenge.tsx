import * as React from "react";
import { ListingSummaryComponentProps } from "./types";
import { ChallengeResultsProps } from "../ChallengeResultsChart";
import {
  StyledListingSummaryContainer,
  StyledListingSummary,
  StyledListingSummarySection,
  StyledBaseResultsBanner,
  StyledRejectedResultsBanner,
} from "./styledComponents";
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

export class ListingSummaryUnderChallengeComponent extends React.Component<ListingSummaryUnderChallengeComponentProps> {
  public render(): JSX.Element {
    const {
      challengeID,
      challengeStatementSummary,
      appealStatementSummary,
      appealChallengeID,
      appealChallengeStatementSummary,
      appeal,
    } = this.props;

    const hasTopPadding = !(appeal && appeal.appealGranted);

    return (
      <StyledListingSummaryContainer>
        <StyledListingSummary hasTopPadding={hasTopPadding}>
          <AppealJudgementBanner {...this.props} />

          <ListingPhaseLabel {...this.props} />

          <NewsroomInfo {...this.props} />

          <ChallengeResults {...this.props} />

          <StyledListingSummarySection>
            <ChallengeOrAppealStatementSummary {...this.props} />

            <PhaseCountdownOrTimestamp {...this.props} />

            <SummaryActionButton {...this.props} />
          </StyledListingSummarySection>
        </StyledListingSummary>
      </StyledListingSummaryContainer>
    );
  }
}
