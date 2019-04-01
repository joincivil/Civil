import * as React from "react";
import { ListingSummaryComponentProps } from "./types";
import { ChallengeResultsProps } from "../ChallengeResultsChart";
import { StyledListingSummary, StyledListingSummarySection, StyledUnderChallengeBanner } from "./styledComponents";
import ListingSummaryBase from "./ListingSummaryBase";
import { UnderChallengeBannerText } from "./textComponents";
import ChallengeOrAppealStatementSummary from "./ChallengeOrAppealStatementSummary";
import ListingPhaseLabel from "./ListingPhaseLabel";
import NewsroomInfo from "./NewsroomInfo";
import SummaryActionButton from "./SummaryActionButton";
import PhaseCountdownOrTimestamp from "./PhaseCountdownOrTimestamp";
import AppealJudgementBanner from "./AppealJudgementBanner";
import ChallengeResults, { AppealChallengeResults } from "./ChallengeResults";

export interface ListingSummaryApprovedComponentProps
  extends ListingSummaryComponentProps,
    Partial<ChallengeResultsProps> {}

export const ListingSummaryApprovedComponent: React.FunctionComponent<ListingSummaryApprovedComponentProps> = props => {
  const { challengeID, canListingAppealBeResolved, canListingAppealChallengeBeResolved } = props;

  let banner;

  if (canListingAppealBeResolved || canListingAppealChallengeBeResolved) {
    banner = <AppealJudgementBanner {...props} />;
  } else if (challengeID) {
    banner = (
      <StyledUnderChallengeBanner>
        <UnderChallengeBannerText />
      </StyledUnderChallengeBanner>
    );
  }

  return (
    <ListingSummaryBase {...props}>
      <StyledListingSummary hasTopPadding={!challengeID}>
        {banner}

        <ListingPhaseLabel {...props} />

        <NewsroomInfo {...props} />

        <ChallengeResults {...props} />
        <AppealChallengeResults {...props} />

        <StyledListingSummarySection>
          <ChallengeOrAppealStatementSummary {...props} />
          <PhaseCountdownOrTimestamp {...props} />

          <SummaryActionButton {...props} />
        </StyledListingSummarySection>
      </StyledListingSummary>
    </ListingSummaryBase>
  );
};
