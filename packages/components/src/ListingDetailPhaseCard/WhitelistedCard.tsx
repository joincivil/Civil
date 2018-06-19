import * as React from "react";
import { ListingDetailPhaseCardComponentProps } from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseDisplayName,
  MetaItemValue,
  MetaItemLabel,
  CTACopy,
} from "./styledComponents";
import { buttonSizes } from "../Button";
import { TransactionButton } from "../TransactionButton";

export class WhitelistedCard extends React.Component<ListingDetailPhaseCardComponentProps> {
  public render(): JSX.Element {
    return (
      <StyledListingDetailPhaseCardContainer>
        <StyledListingDetailPhaseCardSection>
          <StyledPhaseDisplayName>Approved Newsroom</StyledPhaseDisplayName>
          <MetaItemValue>May 5, 2018, 8:30 GMT-0400</MetaItemValue>
          <MetaItemLabel>Approved date</MetaItemLabel>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <MetaItemValue>1,000 CVL</MetaItemValue>
          <MetaItemLabel>Amount of tokens deposited</MetaItemLabel>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <CTACopy>
            If you believe this newsroom does not align with the <a href="#">Civil Constitution</a>, you may{" "}
            <a href="#">submit a challenge</a>.
          </CTACopy>
          <TransactionButton size={buttonSizes.MEDIUM} style="inverted" transactions={this.props.transactions!}>
            Submit a Challenge
          </TransactionButton>
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }
}
