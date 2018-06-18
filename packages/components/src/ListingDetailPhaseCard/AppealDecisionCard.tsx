import * as React from "react";
import { ListingDetailPhaseCardComponentProps } from "./types";
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

export class AppealDecisionCard extends React.Component<ListingDetailPhaseCardComponentProps> {
  public render(): JSX.Element {
    const now = Date.now() / 1000;
    const oneDay = 86400;
    const endTime = now + oneDay * 4.25;
    const phaseLength = oneDay * 7;
    return (
      <StyledListingDetailPhaseCardContainer>
        <StyledListingDetailPhaseCardSection>
          <StyledPhaseDisplayName>Appeal to Council</StyledPhaseDisplayName>
          <ProgressBarCountdownTimer
            endTime={endTime}
            totalSeconds={phaseLength}
            displayLabel="Request to challenge Council's decision"
            flavorText="under Appeal to Council"
          />
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <MetaItemValue>1,000 CVL</MetaItemValue>
          <MetaItemLabel>Amount of tokens deposited</MetaItemLabel>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <CTACopy>Civil Council Decision</CTACopy>
          <FormCopy>
            The Civil Council has decided to grant the appeal. Read more about their methodology and how they’ve come to
            this decision.
          </FormCopy>
          <Button size={buttonSizes.MEDIUM}>Read about this decision</Button>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <CTACopy>
            If you believe this newsroom does not align with the Civil Constitution, you may challenge the Council’s
            decision.{" "}
          </CTACopy>
          <InvertedButton size={buttonSizes.MEDIUM}>Submit a Challenge</InvertedButton>
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }
}
