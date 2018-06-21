import * as React from "react";
import { ListingDetailPhaseCardComponentProps, PhaseWithExpiryProps, ChallengeResultsProps } from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseDisplayName,
  MetaItemValue,
  MetaItemLabel,
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
          <MetaItemValue>1,000 CVL</MetaItemValue>
          <MetaItemLabel>Amount of tokens deposited</MetaItemLabel>
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
          <TransactionInvertedButton size={buttonSizes.MEDIUM} transactions={this.props.transactions!}>Request Appeal from Civil Council</TransactionInvertedButton>
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }
}
