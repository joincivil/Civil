import * as React from "react";
import { Link } from "react-router-dom";
import { ListingDetailPhaseCardComponentProps, PhaseWithExpiryProps, SubmitChallengeProps } from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseDisplayName,
  CTACopy,
  StyledVisibleOnDesktop,
  StyledVisibleOnMobile,
} from "./styledComponents";
import { NewApplicationDisplayNameText, NewApplicationToolTipText } from "./textComponents";
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
            <QuestionToolTip explainerText={<NewApplicationToolTipText />} positionBottom={true} />
          </StyledPhaseDisplayName>
          <ProgressBarCountdownTimer
            endTime={this.props.endTime}
            totalSeconds={this.props.phaseLength}
            displayLabel="Waiting for approval"
            toolTipText={<NewApplicationToolTipText phaseLength={this.props.phaseLength} />}
            flavorText="under community review"
          />
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <CTACopy>
            If you believe this newsroom does not align with the{" "}
            <a href={this.props.constitutionURI}>Civil Constitution</a>, you may{" "}
            <Link to={this.props.submitChallengeURI || "#"}>submit a challenge</Link>.
          </CTACopy>
          {this.renderSubmitChallengeButton()}
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }

  private renderSubmitChallengeButton = (): JSX.Element => {
    if (this.props.submitChallengeURI) {
      return (
        <>
          <StyledVisibleOnDesktop>
            <InvertedButton size={buttonSizes.MEDIUM} to={this.props.submitChallengeURI}>
              Submit a Challenge
            </InvertedButton>
          </StyledVisibleOnDesktop>
          <StyledVisibleOnMobile>
            <InvertedButton size={buttonSizes.MEDIUM} onClick={this.props.onMobileTransactionClick}>
              Submit a Challenge
            </InvertedButton>
          </StyledVisibleOnMobile>
        </>
      );
    }

    return (
      <TransactionInvertedButton transactions={this.props.transactions!}>Submit a Challenge</TransactionInvertedButton>
    );
  };
}
