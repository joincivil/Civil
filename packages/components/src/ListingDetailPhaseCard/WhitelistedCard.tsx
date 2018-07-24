import * as React from "react";
import { ListingDetailPhaseCardComponentProps, SubmitChallengeProps } from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseDisplayName,
  MetaItemValue,
  MetaItemLabel,
  CTACopy,
} from "./styledComponents";
import { buttonSizes, InvertedButton } from "../Button";
import { TransactionInvertedButton } from "../TransactionButton";

export class WhitelistedCard extends React.Component<ListingDetailPhaseCardComponentProps & SubmitChallengeProps> {
  public render(): JSX.Element {
    return (
      <StyledListingDetailPhaseCardContainer>
        <StyledListingDetailPhaseCardSection>
          <StyledPhaseDisplayName>Approved Newsroom</StyledPhaseDisplayName>
          <MetaItemValue>May 5, 2018, 8:30 GMT-0400</MetaItemValue>
          <MetaItemLabel>Approved date</MetaItemLabel>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <CTACopy>
            If you believe this newsroom does not align with the <a href="#">Civil Constitution</a>, you may{" "}
            <a href="#">submit a challenge</a>.
          </CTACopy>
          {this.renderSubmitChallengeButton()}
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }

  private renderSubmitChallengeButton = (): JSX.Element => {
    if (this.props.handleSubmitChallenge) {
      return (
        <InvertedButton size={buttonSizes.MEDIUM} onClick={this.props.handleSubmitChallenge}>
          Submit a Challenge
        </InvertedButton>
      );
    }

    return (
      <TransactionInvertedButton transactions={this.props.transactions!}>Submit a Challenge</TransactionInvertedButton>
    );
  };
}
