import * as React from "react";
import { EthAddress } from "@joincivil/core";
import {
  StyledListingSummaryContainer,
  StyledListingSummaryTop,
  StyledListingSummarySection,
  StyledListingSummaryNewsroomName,
  StyledListingSummaryDescription,
  NewsroomIcon,
} from "./styledComponents";
import { buttonSizes, InvertedButton } from "../Button";
import { TextCountdownTimer } from "../PhaseCountdown/";
import {
  AwaitingApprovalStatusLabel,
  CommitVoteStatusLabel,
  RevealVoteStatusLabel,
  ReadyToCompleteStatusLabel,
  AwaitingDecisionStatusLabel,
  AwaitingAppealChallengeStatusLabel,
} from "../ApplicationPhaseStatusLabels";

export interface ListingSummaryComponentProps {
  listingAddress?: EthAddress;
  name?: string;
  description?: string;
  listingDetailURL?: string;
  isInApplication?: boolean;
  canBeChallenged?: boolean;
  canBeWhitelisted?: boolean;
  inChallengeCommitVotePhase?: boolean;
  inChallengeRevealPhase?: boolean;
  canResolveChallenge?: boolean;
  isAwaitingAppealJudgement?: boolean;
  isAwaitingAppealChallenge?: boolean;
  isInAppealChallengeCommitPhase?: boolean;
  isInAppealChallengeRevealPhase?: boolean;
  canListingAppealChallengeBeResolved?: boolean;
  appExpiry?: number;
  commitEndDate?: number;
  revealEndDate?: number;
}

export class ListingSummaryComponent extends React.Component<ListingSummaryComponentProps> {
  public render(): JSX.Element {
    return (
      <StyledListingSummaryContainer>
        <StyledListingSummaryTop>
          <NewsroomIcon />
          <div>
            <StyledListingSummaryNewsroomName>{this.props.name}</StyledListingSummaryNewsroomName>

            {this.renderPhaseLabel()}

            {this.renderPhaseCountdown()}

            <InvertedButton size={buttonSizes.SMALL} to={this.props.listingDetailURL}>
              View Details
            </InvertedButton>
          </div>
        </StyledListingSummaryTop>
        <StyledListingSummarySection>
          <StyledListingSummaryDescription>{this.props.description}</StyledListingSummaryDescription>
        </StyledListingSummarySection>
      </StyledListingSummaryContainer>
    );
  }

  private renderPhaseLabel = (): JSX.Element | undefined => {
    if (this.props.isInApplication) {
      return <AwaitingApprovalStatusLabel />;
    } else if (this.props.inChallengeCommitVotePhase || this.props.isInAppealChallengeCommitPhase) {
      return <CommitVoteStatusLabel />;
    } else if (this.props.inChallengeRevealPhase || this.props.isInAppealChallengeRevealPhase) {
      return <RevealVoteStatusLabel />;
    } else if (
      this.props.canBeWhitelisted ||
      this.props.canResolveChallenge ||
      this.props.canListingAppealChallengeBeResolved
    ) {
      return <ReadyToCompleteStatusLabel />;
    } else if (this.props.isAwaitingAppealJudgement) {
      return <AwaitingDecisionStatusLabel />;
    } else if (this.props.isAwaitingAppealChallenge) {
      return <AwaitingAppealChallengeStatusLabel />;
    }
    return;
  };

  private renderPhaseCountdown = (): JSX.Element | undefined => {
    let expiry: number | undefined;
    if (this.props.isInApplication) {
      expiry = this.props.appExpiry;
    } else if (this.props.inChallengeCommitVotePhase) {
      expiry = this.props.commitEndDate;
    } else if (this.props.inChallengeRevealPhase) {
      expiry = this.props.revealEndDate;
    }

    const warn = this.props.inChallengeCommitVotePhase || this.props.inChallengeRevealPhase;

    if (expiry) {
      return <TextCountdownTimer endTime={expiry!} warn={warn} />;
    }

    return;
  };
}
