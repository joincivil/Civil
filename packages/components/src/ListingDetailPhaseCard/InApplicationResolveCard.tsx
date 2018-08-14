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
          <StyledPhaseDisplayName>Application Accepted</StyledPhaseDisplayName>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <CTACopy>
            This application is complete. To update this Newsroom's status on the Civil Registry, please{" "}
            <a href="#">add to registry</a>.
          </CTACopy>
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
