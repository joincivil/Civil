import * as React from "react";
import * as ReactDOM from "react-dom";
import { PhaseWithExpiryProps, ChallengePhaseProps, CommitVoteProps } from "../ListingDetailPhaseCard/types";
import { StyledPhaseKicker, StyledPhaseDisplayName } from "../ListingDetailPhaseCard/styledComponents";
import { ChallengePhaseDetail } from "../ListingDetailPhaseCard/ChallengePhaseDetail";
import { CommitVote } from "../ListingDetailPhaseCard/CommitVote";
import { UnderChallengePhaseDisplayNameText } from "../ListingDetailPhaseCard/textComponents";
import { TwoPhaseProgressBarCountdownTimer } from "../PhaseCountdown/";
import {
  StyledCreateProposalOuter,
  StyledChallengeProposalContainer,
  StyledCreateProposalHeaderClose,
  StyledCreateProposalContent,
  StyledSection,
  StyledMetaName,
  StyledMetaValue,
} from "./styledComponents";
import {
  CreateProposalParamNameLabelText,
  CreateProposalParamCurrentValueLabelText,
  ChallengeProposalNewValueLabelText,
} from "./textComponents";

export interface ChallengeProposalCommitVoteProps {
  parameterDisplayName: string | JSX.Element;
  parameterCurrentValue: string;
  parameterProposalValue: string;
  transactions?: any[];
  modalContentComponents?: any;
  handleClose(): void;
}

export type TChallengeProposalCommitVoteProps = ChallengeProposalCommitVoteProps &
  PhaseWithExpiryProps &
  ChallengePhaseProps &
  CommitVoteProps;

export class ChallengeProposalCommitVote extends React.Component<TChallengeProposalCommitVoteProps> {
  public bucket: HTMLDivElement = document.createElement("div");

  public componentDidMount(): void {
    document.body.appendChild(this.bucket);
  }

  public componentWillUnmount(): void {
    document.body.removeChild(this.bucket);
  }

  public render(): React.ReactPortal {
    return ReactDOM.createPortal(
      <StyledCreateProposalOuter>
        <StyledChallengeProposalContainer>
          <StyledCreateProposalHeaderClose onClick={this.props.handleClose}>✖</StyledCreateProposalHeaderClose>

          <StyledCreateProposalContent>
            <StyledSection>
              <StyledPhaseKicker>Challenge ID {this.props.challengeID}</StyledPhaseKicker>
              <StyledPhaseDisplayName>
                <UnderChallengePhaseDisplayNameText />
              </StyledPhaseDisplayName>
              <TwoPhaseProgressBarCountdownTimer
                endTime={this.props.endTime}
                totalSeconds={this.props.phaseLength}
                displayLabel="Accepting votes"
                secondaryDisplayLabel="Confirming Votes"
                flavorText="under challenge"
                activePhaseIndex={0}
              />
            </StyledSection>

            <StyledSection>
              <StyledMetaName>
                <CreateProposalParamNameLabelText />
              </StyledMetaName>
              <StyledMetaValue>{this.props.parameterDisplayName}</StyledMetaValue>
            </StyledSection>

            <StyledSection>
              <StyledMetaName>
                <CreateProposalParamCurrentValueLabelText />
              </StyledMetaName>
              <StyledMetaValue>{this.props.parameterCurrentValue}</StyledMetaValue>
            </StyledSection>

            <StyledSection>
              <StyledMetaName>
                <ChallengeProposalNewValueLabelText />
              </StyledMetaName>
              <StyledMetaValue>{this.props.parameterProposalValue}</StyledMetaValue>
            </StyledSection>

            <StyledSection>
              <ChallengePhaseDetail
                challengeID={this.props.challengeID}
                challenger={this.props.challenger}
                rewardPool={this.props.rewardPool}
                stake={this.props.stake}
              />
            </StyledSection>

            <StyledSection>
              <StyledPhaseKicker>Challenge ID {this.props.challengeID}</StyledPhaseKicker>
              <CommitVote
                tokenBalance={this.props.tokenBalance}
                votingTokenBalance={this.props.votingTokenBalance}
                salt={this.props.salt}
                numTokens={this.props.numTokens}
                onInputChange={this.props.onInputChange}
                userHasCommittedVote={this.props.userHasCommittedVote}
                onReviewVote={this.props.onReviewVote}
                onCommitMaxTokens={this.props.onCommitMaxTokens}
              >
                Should this proposal be <b>accepted</b> or <b>rejected</b> from the Civil Registry?
              </CommitVote>
            </StyledSection>
          </StyledCreateProposalContent>
        </StyledChallengeProposalContainer>
      </StyledCreateProposalOuter>,
      this.bucket,
    );
  }
}
