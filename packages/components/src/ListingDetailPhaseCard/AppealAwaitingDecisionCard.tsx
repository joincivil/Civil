import * as React from "react";
import { getLocalDateTimeStrings } from "@joincivil/utils";
import { ListingDetailPhaseCardComponentProps, PhaseWithExpiryProps } from "./types";
import {
  StyledListingDetailPhaseCardContainer,
  StyledListingDetailPhaseCardSection,
  StyledPhaseDisplayName,
  MetaItemValue,
  MetaItemLabel,
  CTACopy,
} from "./styledComponents";
import { ProgressBarCountdownTimer } from "../PhaseCountdown/";
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";
import { buttonSizes } from "../Button";
import { TransactionInvertedButton } from "../TransactionButton";

export interface AppealProps {
  requester: string;
  appealFeePaid: string;
}

export class AppealAwaitingDecisionCard extends React.Component<
  ListingDetailPhaseCardComponentProps & PhaseWithExpiryProps & AppealProps & ChallengeResultsProps
> {
  public render(): JSX.Element {
    const localDateTime = getLocalDateTimeStrings(this.props.endTime);
    return (
      <StyledListingDetailPhaseCardContainer>
        <StyledListingDetailPhaseCardSection>
          <StyledPhaseDisplayName>Appeal to Council</StyledPhaseDisplayName>
          <ProgressBarCountdownTimer
            endTime={this.props.endTime}
            totalSeconds={this.props.phaseLength}
            displayLabel="Waiting for Council's decision"
            flavorText="under Appeal to Council"
          />
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <MetaItemValue>{this.props.requester}</MetaItemValue>
          <MetaItemLabel>Requester</MetaItemLabel>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <MetaItemValue>{this.props.appealFeePaid}</MetaItemValue>
          <MetaItemLabel>Appeal Fee Paid</MetaItemLabel>
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <CTACopy>
            Check back on {localDateTime[0]} for the Civil Council’s decision to reject or grant the appeal. Read more
            for details of this appeal.
          </CTACopy>
          {this.props.transactions && this.renderGrantAppealButton()}
        </StyledListingDetailPhaseCardSection>
        <StyledListingDetailPhaseCardSection>
          <ChallengeResults
            totalVotes={this.props.totalVotes}
            votesFor={this.props.votesFor}
            votesAgainst={this.props.votesAgainst}
            percentFor={this.props.percentFor}
            percentAgainst={this.props.percentAgainst}
          />
        </StyledListingDetailPhaseCardSection>
      </StyledListingDetailPhaseCardContainer>
    );
  }

  private renderGrantAppealButton = (): JSX.Element => {
    return (
      <TransactionInvertedButton
        size={buttonSizes.MEDIUM}
        transactions={this.props.transactions!}
        modalContentComponents={this.props.modalContentComponents}
      >
        Grant Appeal
      </TransactionInvertedButton>
    );
  };
}
