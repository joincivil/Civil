import * as React from "react";
import { ListingSummaryComponentProps } from "./types";
import { ChallengeResultsProps } from "../ChallengeResultsChart";
import {
  StyledListingSummaryContainer,
  StyledListingSummary,
  StyledListingSummarySection,
  StyledUnderChallengeBanner,
} from "./styledComponents";
import { UnderChallengeBannerText } from "./textComponents";
import ChallengeOrAppealStatementSummary from "./ChallengeOrAppealStatementSummary";
import ListingPhaseLabel from "./ListingPhaseLabel";
import NewsroomInfo from "./NewsroomInfo";
import SummaryActionButton from "./SummaryActionButton";
import PhaseCountdownOrTimestamp from "./PhaseCountdownOrTimestamp";
import AppealJudgementBanner from "./AppealJudgementBanner";
import ChallengeResults from "./ChallengeResults";

export interface ListingSummaryApprovedComponentProps
  extends ListingSummaryComponentProps,
    Partial<ChallengeResultsProps> {}

export class ListingSummaryApprovedComponent extends React.Component<ListingSummaryApprovedComponentProps> {
  public render(): JSX.Element {
    const {
      challengeID,
      challengeStatementSummary,
      appealStatementSummary,
      appealChallengeStatementSummary,
      canResolveChallenge,
      canListingAppealBeResolved,
      canListingAppealChallengeBeResolved,
    } = this.props;

    let banner;

    if (canListingAppealBeResolved || canListingAppealChallengeBeResolved) {
      banner = <AppealJudgementBanner {...this.props} />;
    } else if (challengeID) {
      banner = (
        <StyledUnderChallengeBanner>
          <UnderChallengeBannerText />
        </StyledUnderChallengeBanner>
      );
    }

    return (
      <StyledListingSummaryContainer>
        <StyledListingSummary hasTopPadding={!challengeID}>
          {banner}

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
