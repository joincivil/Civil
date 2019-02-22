import * as React from "react";
import * as ReactDOM from "react-dom";
import { PhaseWithExpiryProps, ChallengePhaseProps, RevealVoteProps } from "../ListingDetailPhaseCard/types";
import {
  StyledPhaseKicker,
  StyledPhaseDisplayName,
  FormHeader,
  FormCopy,
} from "../ListingDetailPhaseCard/styledComponents";
import { ChallengePhaseDetail } from "../ListingDetailPhaseCard/ChallengePhaseDetail";
import { RevealVote } from "../ListingDetailPhaseCard/RevealVote";
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
} from "./ParameterizerStyledComponents";
import {
  CreateProposalParamNameLabelText,
  CreateProposalParamCurrentValueLabelText,
  ChallengeProposalNewValueLabelText,
} from "./textComponents";

export interface ChallengeProposalRevealVoteProps {
  parameterDisplayName: string | JSX.Element;
  parameterCurrentValue: string;
  parameterProposalValue: string;
  transactions?: any[];
  modalContentComponents?: any;
  userHasRevealedVote?: boolean;
  userHasCommittedVote?: boolean;
  handleClose(): void;
  postExecuteTransactions?(): any;
}

export type TChallengeProposalRevealVoteProps = ChallengeProposalRevealVoteProps &
  PhaseWithExpiryProps &
  ChallengePhaseProps &
  RevealVoteProps;

export class ChallengeProposalRevealVote extends React.Component<TChallengeProposalRevealVoteProps> {
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
              {this.renderRevealVote()}
            </StyledSection>
          </StyledCreateProposalContent>
        </StyledChallengeProposalContainer>
      </StyledCreateProposalOuter>,
      this.bucket,
    );
  }

  private renderRevealVote = (): JSX.Element => {
    if (!this.props.userHasCommittedVote) {
      return (
        <>
          <FormHeader>You did not participate in this challenge</FormHeader>
          <FormCopy>You did not commit a vote, so there is nothing here for you to reveal</FormCopy>
        </>
      );
    } else if (this.props.userHasRevealedVote) {
      return (
        <>
          <FormHeader>You have revealed your vote</FormHeader>
          <FormCopy>
            Thank you for participating! Please check back after the challenge ends to see if you have earned a reward{" "}
          </FormCopy>
        </>
      );
    } else {
      return (
        <>
          <RevealVote
            voteOption={this.props.voteOption}
            salt={this.props.salt}
            onInputChange={this.props.onInputChange}
            transactions={this.props.transactions}
            postExecuteTransactions={this.props.postExecuteTransactions}
          >
            Should this proposal be <b>accepted</b> or <b>rejected</b> from the Civil Registry?
          </RevealVote>
        </>
      );
    }
  };
}
