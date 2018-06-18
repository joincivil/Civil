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
import { ProgressBarCountdownTimer } from "../PhaseCountdown/";
import { ChallengeResults } from "./ChallengeResults";

export class AppealAwaitingDecisionCard extends React.Component<ListingDetailPhaseCardComponentProps> {
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
            displayLabel="Waiting for Council's decision"
            flavorText="under Appeal to Council"
          />
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <MetaItemValue>1,000 CVL</MetaItemValue>
          <MetaItemLabel>Amount of tokens deposited</MetaItemLabel>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <CTACopy>
            Check back on August 24, 2018 for Civil Council’s decision to reject or grant the appeal. Read more for
            details of this appeal.
          </CTACopy>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <ChallengeResults />
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }
}
