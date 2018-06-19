import * as React from "react";
import { ListingDetailPhaseCardComponentProps, PhaseWithExpiryProps } from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseDisplayName,
  MetaItemValue,
  MetaItemLabel,
  CTACopy,
  FormCopy,
} from "./styledComponents";
import { buttonSizes, Button, InvertedButton } from "../Button";
import { ProgressBarCountdownTimer } from "../PhaseCountdown/";
import { ChallengeResults } from "./ChallengeResults";
import { RevealVote } from "./RevealVote";

export class AppealChallengeRevealVoteCard extends React.Component<
  ListingDetailPhaseCardComponentProps & PhaseWithExpiryProps
> {
  public render(): JSX.Element {
    return (
      <StyledListingDetailPhaseCardContainer>
        <StyledListingDetailPhaseCardSection>
          <StyledPhaseDisplayName>Challenge Appeal Decision</StyledPhaseDisplayName>
          <ProgressBarCountdownTimer
            endTime={this.props.endTime}
            totalSeconds={this.props.phaseLength}
            displayLabel="Revealing votes"
            flavorText="under challenge"
          />
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <MetaItemValue>1,000 CVL</MetaItemValue>
          <MetaItemLabel>Amount of tokens deposited</MetaItemLabel>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <CTACopy>Civil Council Decision</CTACopy>
          The Civil Council has decided to grant the appeal. Read more about their methodology and how they’ve come to
          this decision.
          <Button size={buttonSizes.MEDIUM}>Read about this decision</Button>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <RevealVote />
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }
}
