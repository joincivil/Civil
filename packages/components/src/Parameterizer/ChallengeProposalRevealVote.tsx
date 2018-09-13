import * as React from "react";
import { PhaseWithExpiryProps, ChallengePhaseProps, RevealVoteProps } from "../ListingDetailPhaseCard/types";
import { StyledPhaseKicker, StyledPhaseDisplayName } from "../ListingDetailPhaseCard/styledComponents";
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
  SECTION_PADDING,
} from "./styledComponents";
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
  handleClose(): void;
}

export type TChallengeProposalRevealVoteProps = ChallengeProposalRevealVoteProps &
  PhaseWithExpiryProps &
  ChallengePhaseProps &
  RevealVoteProps;

export const ChallengeProposalRevealVote: React.SFC<TChallengeProposalRevealVoteProps> = props => {
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
            <RevealVote
              salt={props.salt}
              onInputChange={props.onInputChange}
              transactions={props.transactions}
              modalContentComponents={props.modalContentComponents}
            >
              Should this proposal be <b>accepted</b> or <b>rejected</b> from the Civil Registry?
            </RevealVote>
          </StyledSection>
        </StyledCreateProposalContent>
      </StyledChallengeProposalContainer>
    </StyledCreateProposalOuter>
  );
};
