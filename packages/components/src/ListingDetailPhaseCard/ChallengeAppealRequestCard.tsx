import * as React from "react";
import {
  ListingDetailPhaseCardComponentProps,
  PhaseWithExpiryProps,
  ChallengeResultsProps
} from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseDisplayName,
  CTACopy,
} from "./styledComponents";
import { buttonSizes, InvertedButton } from "../Button";
import { ProgressBarCountdownTimer } from "../PhaseCountdown/";
import { ChallengeResults } from "./ChallengeResults";

export class ChallengeRequestAppealCard extends React.Component<
  ListingDetailPhaseCardComponentProps & PhaseWithExpiryProps & ChallengeResultsProps
> {
  public render(): JSX.Element {
    const now = Date.now() / 1000;
    const oneDay = 86400;
    const endTime = now + oneDay * 4.25;
    const phaseLength = oneDay * 7;
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
          <ChallengeResults
            totalVotes={this.props.totalVotes}
            votesFor={this.props.votesFor}
            votesAgainst={this.props.votesAgainst}
            percentFor={this.props.percentFor}
            percentAgainst={this.props.percentAgainst}
          />
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <CTACopy>If you disagree with the community, you may request an appeal to the Civil Council.</CTACopy>
          <InvertedButton size={buttonSizes.MEDIUM}>Request Appeal from Civil Council</InvertedButton>
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }
}
