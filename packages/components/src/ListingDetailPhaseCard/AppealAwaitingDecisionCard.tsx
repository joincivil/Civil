import * as React from "react";
import { getLocalDateTimeStrings } from "@joincivil/utils";
import { ListingDetailPhaseCardComponentProps, ChallengePhaseProps, PhaseWithExpiryProps } from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseDisplayName,
  StyledPhaseKicker,
  CTACopy,
  MetaRow,
  MetaItem,
  MetaItemValue,
  MetaItemValueLong,
  MetaItemLabel,
} from "./styledComponents";
import { WaitingCouncilDecisionToolTipText } from "./textComponents";
import { TransactionButtonNoModal } from "../TransactionButton";
import { ProgressBarCountdownTimer } from "../PhaseCountdown/";
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";
import { ChallengePhaseDetail } from "./ChallengePhaseDetail";
import { NeedHelp } from "./NeedHelp";
import { TextInput } from "../input";

export interface AppealProps {
  requester: string;
  appealFeePaid: string;
  txIdToConfirm?: number;
  uriValue?: string;
  onChange?(name: string, value: string): any;
}

export interface AppealAwaitingDecisionCardState {
  grantURI: string;
}

export type AppealAwaitingDecisionCardProps = ListingDetailPhaseCardComponentProps &
  PhaseWithExpiryProps &
  ChallengePhaseProps &
  ChallengeResultsProps &
  AppealProps;

const GrantAppealButton: React.StatelessComponent<AppealAwaitingDecisionCardProps> = props => {
  let text = "Grant Appeal";
  if (props.txIdToConfirm) {
    text = "Confirm Appeal";
  }
  return (
    <div>
      {!props.txIdToConfirm && <TextInput name="uri" value={props.uriValue} onChange={props.onChange} />}

      <TransactionButtonNoModal
        transactions={props.transactions!}
        disabledOnMobile={true}
        onMobileClick={props.onMobileTransactionClick}
      >
        {text}
      </TransactionButtonNoModal>
    </div>
  );
};

export const AppealAwaitingDecisionCard: React.StatelessComponent<AppealAwaitingDecisionCardProps> = props => {
  const localDateTime = getLocalDateTimeStrings(props.endTime);
  return (
    <StyledListingDetailPhaseCardContainer>
      <StyledListingDetailPhaseCardSection>
        <StyledPhaseKicker>Challenge ID {props.challengeID}</StyledPhaseKicker>
        <StyledPhaseDisplayName>Appeal to Council</StyledPhaseDisplayName>
        <ProgressBarCountdownTimer
          endTime={props.endTime}
          totalSeconds={props.phaseLength}
          displayLabel="Waiting for Council's decision"
          toolTipText={<WaitingCouncilDecisionToolTipText phaseLength={props.phaseLength} />}
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
          didChallengeSucceed={props.didChallengeSucceed}
        />
      </StyledListingDetailPhaseCardSection>

      <StyledListingDetailPhaseCardSection>
        <MetaRow>
          <MetaItem>
            <MetaItemLabel>Requester</MetaItemLabel>
            <MetaItemValueLong>{props.requester}</MetaItemValueLong>
          </MetaItem>
        </MetaRow>
        <MetaRow>
          <MetaItem>
            <MetaItemLabel>Appeal Fee Paid</MetaItemLabel>
            <MetaItemValue>{props.appealFeePaid}</MetaItemValue>
          </MetaItem>
        </MetaRow>
      </StyledListingDetailPhaseCardSection>

      <StyledListingDetailPhaseCardSection>
        <CTACopy>
          Check back on {localDateTime[0]} for Civil Council’s decision to reject or grant the appeal. Read more for
          details of this appeal.
        </CTACopy>

        {props.transactions && <GrantAppealButton {...props} />}
      </StyledListingDetailPhaseCardSection>

      <NeedHelp />
    </StyledListingDetailPhaseCardContainer>
  );
};
