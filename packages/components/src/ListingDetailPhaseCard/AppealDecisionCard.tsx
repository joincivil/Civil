import * as React from "react";
import { ListingDetailPhaseCardComponentProps, PhaseWithExpiryProps } from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseDisplayName,
  CTACopy,
  FormCopy,
} from "./styledComponents";
import { buttonSizes, Button } from "../Button";
import { ProgressBarCountdownTimer } from "../PhaseCountdown/";
import { TransactionInvertedButton } from "../TransactionButton";

export interface AppealDecisionProps {
  appealGranted: boolean;
}

export class AppealDecisionCard extends React.Component<
  ListingDetailPhaseCardComponentProps & PhaseWithExpiryProps & AppealDecisionProps
> {
  public render(): JSX.Element {
    const decisionText = this.props.appealGranted ? "grant" : "dismiss";
    return (
      <StyledListingDetailPhaseCardContainer>
        <StyledListingDetailPhaseCardSection>
          <StyledPhaseDisplayName>Appeal to Council</StyledPhaseDisplayName>
          <ProgressBarCountdownTimer
            endTime={this.props.endTime}
            totalSeconds={this.props.phaseLength}
            displayLabel="Request to challenge Council's decision"
            flavorText="under Appeal to Council"
          />
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
          <CTACopy>
            If you believe this newsroom does not align with the Civil Constitution, you may challenge the Council’s
            decision.
          </CTACopy>
          <TransactionInvertedButton size={buttonSizes.MEDIUM} transactions={this.props.transactions!}>
            Submit a Challenge
          </TransactionInvertedButton>
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }
}
