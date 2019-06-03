import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "./styleConstants";

export const StyledBaseStatus = styled.div`
  background-color: ${colors.primary.BLACK};
  color: ${colors.basic.WHITE};
  display: inline-block;
  font: bold 12px/15px ${fonts.SANS_SERIF};
  letter-spacing: 1px;
  margin: 0 0 9px;
  padding: 5px 8px;
  text-transform: uppercase;
`;

const StyledAwaitingStatuslabel = styled(StyledBaseStatus)`
  background-color: ${colors.accent.CIVIL_BLUE_FADED_2};
  color: ${colors.primary.BLACK};
`;

const StyledAwaitingAppealStatuslabel = styled(StyledBaseStatus)`
  background-color: ${colors.accent.CIVIL_RED_VERY_FADED};
  color: ${colors.primary.BLACK};
`;

const StyledCommitVoteStatus = styled(StyledBaseStatus)`
  background-color: ${colors.accent.CIVIL_YELLOW};
  color: ${colors.primary.BLACK};
`;

const StyledRevealVoteStatus = styled(StyledBaseStatus)`
  background-color: ${colors.accent.CIVIL_TEAL_FADED};
  color: ${colors.primary.BLACK};
`;

const StyledReadyToCompleteStatus = styled(StyledBaseStatus)`
  background-color: ${colors.accent.CIVIL_BLUE};
  color: ${colors.basic.WHITE};
`;

export const AwaitingApprovalStatusLabel: React.FunctionComponent = props => {
  return <StyledAwaitingStatuslabel>Awaiting Approval</StyledAwaitingStatuslabel>;
};

export const AwaitingAppealRequestLabel: React.FunctionComponent = props => {
  return <StyledAwaitingStatuslabel>Awaiting Request to Appeal</StyledAwaitingStatuslabel>;
};

export const AwaitingDecisionStatusLabel: React.FunctionComponent = props => {
  return <StyledAwaitingStatuslabel>Awaiting Council Decision</StyledAwaitingStatuslabel>;
};

export const AwaitingAppealChallengeStatusLabel: React.FunctionComponent = props => {
  return <StyledAwaitingAppealStatuslabel>Challenge Council Decision</StyledAwaitingAppealStatuslabel>;
};

export const CommitVoteStatusLabel: React.FunctionComponent = props => {
  return <StyledCommitVoteStatus>Submit Vote</StyledCommitVoteStatus>;
};

export const RevealVoteStatusLabel: React.FunctionComponent = props => {
  return <StyledRevealVoteStatus>Confirm Vote</StyledRevealVoteStatus>;
};

export const ReadyToCompleteStatusLabel: React.FunctionComponent = props => {
  return <StyledReadyToCompleteStatus>Ready To Update</StyledReadyToCompleteStatus>;
};
