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
import { buttonSizes, InvertedButton } from "../Button";
import { ProgressBarCountdownTimer } from "../PhaseCountdown/";
import { ChallengeResults } from "./ChallengeResults";

export class ChallengeRequestAppealCard extends React.Component<ListingDetailPhaseCardComponentProps> {
  public render(): JSX.Element {
    const now = Date.now() / 1000;
    const oneDay = 86400;
    const endTime = now + oneDay * 4.25;
    const phaseLength = oneDay * 7;
    return (
      <StyledListingDetailPhaseCardContainer>
        <StyledListingDetailPhaseCardSection>
          <StyledPhaseDisplayName>Under Challenge</StyledPhaseDisplayName>
          <ProgressBarCountdownTimer
            endTime={endTime}
            totalSeconds={phaseLength}
            displayLabel="Revealing votes"
            flavorText="under challenge"
          />
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <MetaItemValue>1,000 CVL</MetaItemValue>
          <MetaItemLabel>Amount of tokens deposited</MetaItemLabel>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <ChallengeResults />
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <CTACopy>If you disagree with the community, you may request an appeal to the Civil Council.</CTACopy>
          <InvertedButton size={buttonSizes.MEDIUM}>Request Appeal from Civil Council</InvertedButton>
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }
}
