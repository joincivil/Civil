import * as React from "react";
import {
  ListingDetailPhaseCardComponentProps,
  PhaseWithExpiryProps,
  ChallengePhaseProps,
  CommitVoteProps,
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
import { ProgressBarCountdownTimer } from "../PhaseCountdown/";
import { CommitVote } from "./CommitVote";

export class AppealChallengeCommitVoteCard extends React.Component<
  ListingDetailPhaseCardComponentProps & PhaseWithExpiryProps & ChallengePhaseProps & CommitVoteProps
> {
  public render(): JSX.Element {
    return (
      <StyledListingDetailPhaseCardContainer>
        <StyledListingDetailPhaseCardSection>
          <StyledPhaseDisplayName>Challenge Appeal Decision</StyledPhaseDisplayName>
          <ProgressBarCountdownTimer
            endTime={this.props.endTime}
            totalSeconds={this.props.phaseLength}
            displayLabel="Accepting votes"
            flavorText="under challenge"
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
          <CommitVote
            tokenBalance={this.props.tokenBalance}
            salt={this.props.salt}
            numTokens={this.props.numTokens}
            onInputChange={this.props.onInputChange}
            transactions={this.props.transactions}
          />
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }
}
