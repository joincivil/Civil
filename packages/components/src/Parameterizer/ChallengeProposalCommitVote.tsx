import * as React from "react";
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
  SECTION_PADDING,
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

export const ChallengeProposalCommitVote: React.SFC<TChallengeProposalCommitVoteProps> = props => {
  return (
    <StyledCreateProposalOuter>
      <StyledChallengeProposalContainer>
        <StyledCreateProposalHeaderClose onClick={props.handleClose}>✖</StyledCreateProposalHeaderClose>

        <StyledCreateProposalContent>
          <StyledSection>
            <StyledPhaseKicker>Challenge ID {props.challengeID}</StyledPhaseKicker>
            <StyledPhaseDisplayName>
              <UnderChallengePhaseDisplayNameText />
            </StyledPhaseDisplayName>
            <TwoPhaseProgressBarCountdownTimer
              endTime={props.endTime}
              totalSeconds={props.phaseLength}
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
            <StyledMetaValue>{props.parameterDisplayName}</StyledMetaValue>
          </StyledSection>

          <StyledSection>
            <StyledMetaName>
              <CreateProposalParamCurrentValueLabelText />
            </StyledMetaName>
            <StyledMetaValue>{props.parameterCurrentValue}</StyledMetaValue>
          </StyledSection>

          <StyledSection>
            <StyledMetaName>
              <ChallengeProposalNewValueLabelText />
            </StyledMetaName>
            <StyledMetaValue>{props.parameterProposalValue}</StyledMetaValue>
          </StyledSection>

          <ChallengePhaseDetail
            challengeID={props.challengeID}
            challenger={props.challenger}
            rewardPool={props.rewardPool}
            stake={props.stake}
            padding={SECTION_PADDING}
          />

          <StyledSection>
            <StyledPhaseKicker>Challenge ID {props.challengeID}</StyledPhaseKicker>
            <CommitVote
              tokenBalance={props.tokenBalance}
              salt={props.salt}
              numTokens={props.numTokens}
              onInputChange={props.onInputChange}
              userHasCommittedVote={props.userHasCommittedVote}
              onReviewVote={props.onReviewVote}
            >
              Should this proposal be <b>accepted</b> or <b>rejected</b> from the Civil Registry?
            </CommitVote>
          </StyledSection>
        </StyledCreateProposalContent>
      </StyledChallengeProposalContainer>
    </StyledCreateProposalOuter>
  );
};
