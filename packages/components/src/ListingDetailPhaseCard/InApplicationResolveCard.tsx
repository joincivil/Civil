import * as React from "react";
import { ListingDetailPhaseCardComponentProps } from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseDisplayName,
  CTACopy,
} from "./styledComponents";
import { TransactionInvertedButton } from "../TransactionButton";

export class InApplicationResolveCard extends React.Component<ListingDetailPhaseCardComponentProps> {
  public render(): JSX.Element {
    return (
      <StyledListingDetailPhaseCardContainer>
        <StyledListingDetailPhaseCardSection>
          <StyledPhaseDisplayName>New Application</StyledPhaseDisplayName>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <CTACopy>This listing has passed the application process</CTACopy>
          <TransactionInvertedButton
            transactions={this.props.transactions!}
            modalContentComponents={this.props.modalContentComponents}
          >
            Add To Registry
          </TransactionInvertedButton>
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }
}
