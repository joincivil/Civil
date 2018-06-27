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
  FormHeader,
  FormCopy,
} from "./styledComponents";
import { ProgressBarCountdownTimer } from "../PhaseCountdown/";
import { RevealVote } from "./RevealVote";

export class ChallengeRevealVoteCard extends React.Component<
  ListingDetailPhaseCardComponentProps & PhaseWithExpiryProps & ChallengePhaseProps & RevealVoteProps
> {
  public render(): JSX.Element {
    return (
      <StyledListingDetailPhaseCardContainer>
        <StyledListingDetailPhaseCardSection>
          <StyledPhaseDisplayName>Under Challenge</StyledPhaseDisplayName>
          <ProgressBarCountdownTimer
            endTime={this.props.endTime}
            totalSeconds={this.props.phaseLength}
            displayLabel="Revealing votes"
            flavorText="under challenge"
          />
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
        <StyledListingDetailPhaseCardSection>{this.renderCommitVote()}</StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }

  private renderCommitVote = (): JSX.Element => {
    if (!!this.props.userHasCommittedVote) {
      return (
        <>
          <FormHeader>You did not participate in this challenge</FormHeader>
          <FormCopy>You did not commit a vote, so there is nothing here for you to reveal</FormCopy>
        </>
      );
    } else if (this.props.userHasRevealedVote) {
      return (
        <>
          <FormHeader>You have revealed your vote</FormHeader>
          <FormCopy>
            Thank you for participating! Please check back after the challenge ends to see if you have earned a reward{" "}
          </FormCopy>
        </>
      );
    } else {
      return (
        <RevealVote
          salt={this.props.salt}
          onInputChange={this.props.onInputChange}
          transactions={this.props.transactions}
          modalContentComponents={this.props.modalContentComponents}
        />
      );
    }
  };
}
