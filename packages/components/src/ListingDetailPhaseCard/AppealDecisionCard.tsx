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
  CTACopy,
} from "./styledComponents";
import { ChallangeCouncilToolTipText } from "./textComponents";
import { ProgressBarCountdownTimer } from "../PhaseCountdown/";
import { TransactionInvertedButton } from "../TransactionButton";
import { ChallengePhaseDetail } from "./ChallengePhaseDetail";
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";
import { NeedHelp } from "./NeedHelp";
import { AppealDecisionDetail } from "./AppealDecisionDetail";

export const AppealDecisionCard: React.SFC<
  ListingDetailPhaseCardComponentProps &
    PhaseWithExpiryProps &
    ChallengePhaseProps &
    AppealDecisionProps &
    ChallengeResultsProps
> = props => {
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
          rewardPool={props.rewardPool}
          stake={props.stake}
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
        />
      </StyledListingDetailPhaseCardSection>

      <AppealDecisionDetail appealGranted={props.appealGranted} />

      <StyledListingDetailPhaseCardSection>
        <CTACopy>
          If you believe this newsroom does not align with the Civil Constitution, you may challenge the Council’s
          decision.
        </CTACopy>
        <TransactionInvertedButton
          transactions={props.transactions!}
          modalContentComponents={props.modalContentComponents}
        >
          Submit a Challenge
        </TransactionInvertedButton>
      </StyledListingDetailPhaseCardSection>

      <NeedHelp />
    </StyledListingDetailPhaseCardContainer>
  );
};
