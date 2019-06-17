import * as React from "react";
import {
  AppealDecisionProps,
  ListingDetailPhaseCardComponentProps,
  ChallengePhaseProps,
  PhaseWithExpiryProps,
} from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseKicker,
  StyledPhaseDisplayName,
  StyledVisibleOnDesktop,
  StyledVisibleOnMobile,
  CTACopy,
} from "./styledComponents";
import { ChallangeCouncilToolTipText } from "./textComponents";
import { ProgressBarCountdownTimer } from "../PhaseCountdown/";
import { TransactionButtonNoModal } from "../TransactionButton";
import { Button, buttonSizes } from "../Button";
import { ChallengePhaseDetail } from "./ChallengePhaseDetail";
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";
import NeedHelp from "./NeedHelp";
import { AppealDecisionDetail } from "./AppealDecisionDetail";

export const AppealDecisionCard: React.FunctionComponent<
  ListingDetailPhaseCardComponentProps &
    PhaseWithExpiryProps &
    ChallengePhaseProps &
    AppealDecisionProps &
    ChallengeResultsProps
> = props => {
  const renderSubmitChallengeButton = (): JSX.Element => {
    if (props.submitAppealChallengeURI) {
      return (
        <>
          <StyledVisibleOnDesktop>
            <Button size={buttonSizes.MEDIUM} to={props.submitAppealChallengeURI}>
              Submit a Challenge
            </Button>
          </StyledVisibleOnDesktop>
          <StyledVisibleOnMobile>
            <Button size={buttonSizes.MEDIUM} onClick={props.onMobileTransactionClick}>
              Submit a Challenge
            </Button>
          </StyledVisibleOnMobile>
        </>
      );
    }

    return <TransactionButtonNoModal transactions={props.transactions!}>Submit a Challenge</TransactionButtonNoModal>;
  };

  return (
    <StyledListingDetailPhaseCardContainer>
      <StyledListingDetailPhaseCardSection>
        <StyledPhaseKicker>Challenge ID {props.challengeID}</StyledPhaseKicker>
        <StyledPhaseDisplayName>Appeal to Council</StyledPhaseDisplayName>
        <ProgressBarCountdownTimer
          endTime={props.endTime}
          totalSeconds={props.phaseLength}
          displayLabel="Request to challenge Council's decision"
          toolTipText={<ChallangeCouncilToolTipText phaseLength={props.phaseLength} />}
          flavorText="under Appeal to Council"
        />
      </StyledListingDetailPhaseCardSection>

      <StyledListingDetailPhaseCardSection>
        <ChallengePhaseDetail
          challengeID={props.challengeID}
          challenger={props.challenger}
          isViewingUserChallenger={props.isViewingUserChallenger}
          rewardPool={props.rewardPool}
          stake={props.stake}
          dispensationPct={props.dispensationPct}
        />
      </StyledListingDetailPhaseCardSection>

      <StyledListingDetailPhaseCardSection>
        <ChallengeResults
          collapsable={true}
          totalVotes={props.totalVotes}
          votesFor={props.votesFor}
          votesAgainst={props.votesAgainst}
          percentFor={props.percentFor}
          percentAgainst={props.percentAgainst}
          didChallengeSucceed={props.didChallengeOriginallySucceed}
        />
      </StyledListingDetailPhaseCardSection>

      <AppealDecisionDetail
        appealGranted={props.appealGranted}
        appealGrantedStatementURI={props.appealGrantedStatementURI}
      />

      <StyledListingDetailPhaseCardSection>
        <CTACopy>
          If you believe this newsroom does not align with the Civil Constitution, you may challenge the Council’s
          decision.
        </CTACopy>

        {renderSubmitChallengeButton()}
      </StyledListingDetailPhaseCardSection>

      <NeedHelp faqURL={props.faqURL} />
    </StyledListingDetailPhaseCardContainer>
  );
};
