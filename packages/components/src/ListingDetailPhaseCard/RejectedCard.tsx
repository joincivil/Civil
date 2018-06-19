import * as React from "react";
import { ListingDetailPhaseCardComponentProps, ChallengeResultsProps } from "./types";
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

export class RejectedCard extends React.Component<ListingDetailPhaseCardComponentProps & ChallengeResultsProps> {
  public render(): JSX.Element {
    return (
      <StyledListingDetailPhaseCardContainer>
        <StyledListingDetailPhaseCardSection>
          <StyledPhaseDisplayName>Rejected Newsroom</StyledPhaseDisplayName>
          <MetaItemValue>May 5, 2018, 8:30 GMT-0400</MetaItemValue>
          <MetaItemLabel>Rejected date</MetaItemLabel>
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
      </StyledListingDetailPhaseCardContainer>
    );
  }
}
