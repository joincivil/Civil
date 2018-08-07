import * as React from "react";
import {
  ListingDetailPhaseCardComponentProps,
  PhaseWithExpiryProps,
  ChallengePhaseProps,
  RevealVoteProps,
} from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseDisplayName,
  MetaItemValue,
  MetaItemLabel,
  CTACopy,
  FormCopy,
} from "./styledComponents";
import { buttonSizes, Button } from "../Button";
import { TwoPhaseProgressBarCountdownTimer } from "../PhaseCountdown/";
import { RevealVote } from "./RevealVote";

export class AppealChallengeRevealVoteCard extends React.Component<
  ListingDetailPhaseCardComponentProps & PhaseWithExpiryProps & ChallengePhaseProps & RevealVoteProps
> {
  public render(): JSX.Element {
    return (
      <StyledListingDetailPhaseCardContainer>
        <StyledListingDetailPhaseCardSection>
          <StyledPhaseDisplayName>Challenge Appeal Decision</StyledPhaseDisplayName>
          <TwoPhaseProgressBarCountdownTimer
            endTime={this.props.endTime}
            totalSeconds={this.props.phaseLength}
            displayLabel="Revealing votes"
            secondaryDisplayLabel="Accepting votes"
            flavorText="under challenge"
            activePhaseIndex={1}
          />
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <CTACopy>Civil Council Decision</CTACopy>
          <FormCopy>
            The Civil Council has decided to grant the appeal. Read more about their methodology and how they’ve come to
            this decision.
          </FormCopy>
          <Button size={buttonSizes.MEDIUM}>Read about this decision</Button>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <MetaItemValue>{this.props.challenger}</MetaItemValue>
          <MetaItemLabel>Challenger</MetaItemLabel>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <MetaItemValue>{this.props.rewardPool}</MetaItemValue>
          <MetaItemLabel>Reward Pool</MetaItemLabel>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <MetaItemValue>{this.props.stake}</MetaItemValue>
          <MetaItemLabel>Stake</MetaItemLabel>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <RevealVote
            salt={this.props.salt}
            onInputChange={this.props.onInputChange}
            transactions={this.props.transactions}
            modalContentComponents={this.props.modalContentComponents}
          />
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }
}
