import * as React from "react";
import {
  ListingDetailPhaseCardComponentProps,
  ChallengePhaseProps,
  PhaseWithExpiryProps,
  RequestAppealProps,
} from "./types";
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
import { buttonSizes, InvertedButton } from "../Button";
import { TransactionButtonNoModal } from "../TransactionButton";
import { ProgressBarCountdownTimer } from "../PhaseCountdown/";
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";
import { ChallengePhaseDetail } from "./ChallengePhaseDetail";
import NeedHelp from "./NeedHelp";
import { QuestionToolTip } from "../QuestionToolTip";

const RequestAppealButton: React.FunctionComponent<
  ListingDetailPhaseCardComponentProps &
    PhaseWithExpiryProps &
    ChallengePhaseProps &
    ChallengeResultsProps &
    RequestAppealProps
> = props => {
  if (props.requestAppealURI) {
    return (
      <>
        <InvertedButton size={buttonSizes.MEDIUM} to={props.requestAppealURI}>
          Request an Appeal
        </InvertedButton>
      </>
    );
  }

  return (
    <TransactionButtonNoModal transactions={props.transactions!}>
      Request Appeal from Civil Council
    </TransactionButtonNoModal>
  );
};

export const ChallengeRequestAppealCard: React.FunctionComponent<
  ListingDetailPhaseCardComponentProps &
    PhaseWithExpiryProps &
    ChallengePhaseProps &
    ChallengeResultsProps &
    RequestAppealProps
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
          toolTipText={<RequestAppealToolTipText phaseLength={props.phaseLength} />}
          flavorText="under challenge"
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
      <StyledListingDetailPhaseCardSection>
        <CTACopy>If you disagree with the community, you may request an appeal to the Civil Council.</CTACopy>
        <RequestAppealButton {...props} />
      </StyledListingDetailPhaseCardSection>

      <NeedHelp faqURL={props.faqURL} />
    </StyledListingDetailPhaseCardContainer>
  );
};
