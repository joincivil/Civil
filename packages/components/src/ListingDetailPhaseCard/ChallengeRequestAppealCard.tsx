import * as React from "react";
import { ListingDetailPhaseCardComponentProps, PhaseWithExpiryProps, ChallengeResultsProps } from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseDisplayName,
  CTACopy,
} from "./styledComponents";
import { buttonSizes } from "../Button";
import { TransactionInvertedButton } from "../TransactionButton";
import { ProgressBarCountdownTimer } from "../PhaseCountdown/";
import { ChallengeResults } from "./ChallengeResults";

export class ChallengeRequestAppealCard extends React.Component<
  ListingDetailPhaseCardComponentProps & PhaseWithExpiryProps & ChallengeResultsProps
> {
  public render(): JSX.Element {
    return (
      <StyledListingDetailPhaseCardContainer>
        <StyledListingDetailPhaseCardSection>
          <StyledPhaseDisplayName>Under Challenge</StyledPhaseDisplayName>
          <ProgressBarCountdownTimer
            endTime={this.props.endTime}
            totalSeconds={this.props.phaseLength}
            displayLabel="Accepting Appeal Requests"
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
          <TransactionInvertedButton
            size={buttonSizes.MEDIUM}
            transactions={this.props.transactions!}
            modalContentComponents={this.props.modalContentComponents}
          >
            Request Appeal from Civil Council
          </TransactionInvertedButton>
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }
}
