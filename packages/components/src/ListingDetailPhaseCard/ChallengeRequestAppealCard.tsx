import * as React from "react";
import { ListingDetailPhaseCardComponentProps, ChallengePhaseProps, PhaseWithExpiryProps } from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseKicker,
  StyledPhaseDisplayName,
  CTACopy,
} from "./styledComponents";
import {
  UnderChallengePhaseDisplayNameText,
  UnderChallengeToolTipText,
  RequestAppealToolTipText,
} from "./textComponents";
import { TransactionInvertedButton } from "../TransactionButton";
import { ProgressBarCountdownTimer } from "../PhaseCountdown/";
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";
import { ChallengePhaseDetail } from "./ChallengePhaseDetail";
import { NeedHelp } from "./NeedHelp";
import { QuestionToolTip } from "../QuestionToolTip";

export const ChallengeRequestAppealCard: React.StatelessComponent<
  ListingDetailPhaseCardComponentProps & PhaseWithExpiryProps & ChallengePhaseProps & ChallengeResultsProps
> = props => {
  return (
    <StyledListingDetailPhaseCardContainer>
      <StyledListingDetailPhaseCardSection>
        <StyledPhaseKicker>Challenge ID {props.challengeID}</StyledPhaseKicker>
        <StyledPhaseDisplayName>
          <UnderChallengePhaseDisplayNameText />
          <QuestionToolTip explainerText={<UnderChallengeToolTipText />} positionBottom={true} />
        </StyledPhaseDisplayName>
        <ProgressBarCountdownTimer
          endTime={props.endTime}
          totalSeconds={props.phaseLength}
          displayLabel="Accepting Appeal Requests"
          toolTipText={<RequestAppealToolTipText />}
          flavorText="under challenge"
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
      <StyledListingDetailPhaseCardSection>
        <CTACopy>If you disagree with the community, you may request an appeal to the Civil Council.</CTACopy>
        <TransactionInvertedButton
          transactions={props.transactions!}
          modalContentComponents={props.modalContentComponents}
        >
          Request Appeal from Civil Council
        </TransactionInvertedButton>
      </StyledListingDetailPhaseCardSection>

      <NeedHelp />
    </StyledListingDetailPhaseCardContainer>
  );
};
