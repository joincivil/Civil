import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { EthAddress } from "@joincivil/core";
import { colors, fonts } from "./styleConstants";
import { SectionHeading } from "./Heading";
import { buttonSizes, InvertedButton } from "./Button";
import { TextCountdownTimer } from "./PhaseCountdown/";
import {
  AwaitingApprovalStatusLabel,
  CommitVoteStatusLabel,
  RevealVoteStatusLabel,
  ReadyToCompleteStatusLabel,
  AwaitingDecisionStatusLabel,
  AwaitingAppealChallengeStatusLabel,
} from "./ApplicationPhaseStatusLabels";

const StyledListingSummaryContainer = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  box-shadow: inset 0 1px 0 0 ${colors.accent.CIVIL_GRAY_4}, 0 2px 4px 0 ${colors.accent.CIVIL_GRAY_3};
  box-sizing: border-box;
  height: 491px;
  margin: 0 30px 48px 0;
  width: 379px;

  &:nth-child(3n + 3) {
    margin-right: 0;
  }
`;

const StyledListingSummaryNewsroomName = SectionHeading.extend`
  margin: 0 0 16px;
`;

const StyledListingSummaryHed = styled.div`
  display: flex;
  padding: 27px 23px 30px;
`;

const StyledListingSummaryHedContent = styled.div`
  max-width: calc(100% - 97px);
`

const StyledListingSummaryDek = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.primary.CIVIL_GRAY_1};
  font: normal 18px/33px ${fonts.SANS_SERIF};
  padding: 27px 23px 30px;
`;

const NewsroomIcon = styled.figure`
  background: ${colors.accent.CIVIL_GRAY_4};
  margin: 0 17px 0 0;
  height: 80px;
  min-width: 80px;
`;

export interface ListingSummaryComponentProps {
  address?: EthAddress;
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
        <StyledListingSummaryHed>
          <NewsroomIcon />
          <StyledListingSummaryHedContent>
            <StyledListingSummaryNewsroomName>{this.props.name}</StyledListingSummaryNewsroomName>

            {this.renderPhaseLabel()}

            {this.renderPhaseCountdown()}

            <InvertedButton size={buttonSizes.SMALL} to={this.props.listingDetailURL}>
              View Details
            </InvertedButton>
          </StyledListingSummaryHedContent>
        </StyledListingSummaryHed>
        <StyledListingSummaryDek>{this.props.description}</StyledListingSummaryDek>
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
