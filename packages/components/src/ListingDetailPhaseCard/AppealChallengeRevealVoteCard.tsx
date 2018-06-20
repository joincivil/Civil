import * as React from "react";
import { ListingDetailPhaseCardComponentProps, PhaseWithExpiryProps, RevealVoteProps } from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseDisplayName,
  CTACopy,
  FormCopy,
} from "./styledComponents";
import { buttonSizes, Button } from "../Button";
import { ProgressBarCountdownTimer } from "../PhaseCountdown/";
import { RevealVote } from "./RevealVote";

export class AppealChallengeRevealVoteCard extends React.Component<
  ListingDetailPhaseCardComponentProps & PhaseWithExpiryProps & RevealVoteProps
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
          <CTACopy>Civil Council Decision</CTACopy>
          <FormCopy>
            The Civil Council has decided to grant the appeal. Read more about their methodology and how they’ve come to
            this decision.
          </FormCopy>
          <Button size={buttonSizes.MEDIUM}>Read about this decision</Button>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <RevealVote
            salt={this.props.salt}
            onInputChange={this.props.onInputChange}
            transactions={this.props.transactions}
          />
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }
}
