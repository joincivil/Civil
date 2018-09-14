import * as React from "react";
import { ListingDetailPhaseCardComponentProps, PhaseWithExpiryProps, SubmitChallengeProps } from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseDisplayName,
  CTACopy,
} from "./styledComponents";
import { NewApplicationDisplayNameText, NewApplicationToolTipText, WaitingApprovalToolTipText } from "./textComponents";
import { buttonSizes, InvertedButton } from "../Button";
import { TransactionInvertedButton } from "../TransactionButton";
import { ProgressBarCountdownTimer } from "../PhaseCountdown/";
import { QuestionToolTip } from "../QuestionToolTip";

export class InApplicationCard extends React.Component<
  ListingDetailPhaseCardComponentProps & PhaseWithExpiryProps & SubmitChallengeProps
> {
  public render(): JSX.Element {
    return (
      <StyledListingDetailPhaseCardContainer>
        <StyledListingDetailPhaseCardSection>
          <StyledPhaseDisplayName>
            <NewApplicationDisplayNameText />
            <QuestionToolTip explainerText={<NewApplicationToolTipText />} />
          </StyledPhaseDisplayName>
          <ProgressBarCountdownTimer
            endTime={this.props.endTime}
            totalSeconds={this.props.phaseLength}
            displayLabel="Waiting for approval"
            toolTipText={<WaitingApprovalToolTipText />}
            flavorText="under community review"
          />
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
