import * as React from "react";
import { ListingDetailPhaseCardComponentProps, AppealDecisionProps } from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseDisplayName,
  CTACopy,
  FormCopy,
} from "./styledComponents";
import { buttonSizes, Button } from "../Button";
import { TransactionInvertedButton } from "../TransactionButton";

export class AppealResolveCard extends React.Component<ListingDetailPhaseCardComponentProps & AppealDecisionProps> {
  public render(): JSX.Element {
    const decisionText = this.props.appealGranted ? "grant" : "dismiss";
    return (
      <StyledListingDetailPhaseCardContainer>
        <StyledListingDetailPhaseCardSection>
          <StyledPhaseDisplayName>Appeal to Council</StyledPhaseDisplayName>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <CTACopy>Civil Council Decision</CTACopy>
          <FormCopy>
            The Civil Council has decided to {decisionText} the appeal. Read more about their methodology and how
            they’ve come to this decision.
          </FormCopy>
          <Button size={buttonSizes.MEDIUM}>Read about this decision</Button>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <TransactionInvertedButton
            size={buttonSizes.MEDIUM}
            transactions={this.props.transactions!}
            modalContentComponents={this.props.modalContentComponents}
          >
            Resolve Appeal
          </TransactionInvertedButton>
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }
}
