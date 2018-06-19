import * as React from "react";
import { ListingDetailPhaseCardComponentProps, PhaseWithExpiryProps, ChallengePhaseProps } from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseDisplayName,
  MetaItemValue,
  MetaItemLabel,
} from "./styledComponents";
import { ProgressBarCountdownTimer } from "../PhaseCountdown/";
import { CommitVote } from "./CommitVote";

export class ChallengeCommitVoteCard extends React.Component<
  ListingDetailPhaseCardComponentProps & PhaseWithExpiryProps & ChallengePhaseProps
> {
  public render(): JSX.Element {
    return (
      <StyledListingDetailPhaseCardContainer>
        <StyledListingDetailPhaseCardSection>
          <StyledPhaseDisplayName>Under Challenge</StyledPhaseDisplayName>
          <ProgressBarCountdownTimer
            endTime={this.props.endTime}
            totalSeconds={this.props.phaseLength}
            displayLabel="Accepting votes"
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
        <StyledListingDetailPhaseCardSection>
          <CommitVote />
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }
}
