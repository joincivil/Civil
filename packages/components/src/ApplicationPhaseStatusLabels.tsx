import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "./styleConstants";

const StyledBaseStatus = styled.div`
  background-color: ${colors.primary.BLACK};
  color: ${colors.basic.WHITE};
  display: inline-block;
  font: bold 12px/15px ${fonts.SANS_SERIF};
  letter-spacing: 1px;
  margin: 0 0 9px;
  padding: 5px 8px;
  text-transform: uppercase;
`;

const StyledAwaitingStatuslabel = StyledBaseStatus.extend`
  background-color: ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.primary.BLACK};
`;

const StyledCommitVoteStatus = StyledBaseStatus.extend`
  background-color: ${colors.accent.CIVIL_YELLOW};
  color: ${colors.primary.BLACK};
`;

const StyledRevealVoteStatus = StyledBaseStatus.extend`
  background-color: ${colors.accent.CIVIL_TEAL_FADED};
  color: ${colors.primary.BLACK};
`;

const StyledReadyToCompleteStatus = StyledBaseStatus.extend`
  background-color: ${colors.accent.CIVIL_BLUE};
  color: ${colors.basic.WHITE};
`;

export const AwaitingApprovalStatusLabel: React.SFC = props => {
  return <StyledAwaitingStatuslabel>Awaiting Approval</StyledAwaitingStatuslabel>;
};

export const AwaitingDecisionStatusLabel: React.SFC = props => {
  return <StyledAwaitingStatuslabel>Awaiting Decision</StyledAwaitingStatuslabel>;
};

export const AwaitingAppealChallengeStatusLabel: React.SFC = props => {
  return <StyledAwaitingStatuslabel>Awaiting Appeal Challenge</StyledAwaitingStatuslabel>;
};

export const CommitVoteStatusLabel: React.SFC = props => {
  return <StyledCommitVoteStatus>Accepting Votes</StyledCommitVoteStatus>;
};

export const RevealVoteStatusLabel: React.SFC = props => {
  return <StyledRevealVoteStatus>Revealing Votes</StyledRevealVoteStatus>;
};

export const RequestingAppealStatusLabel: React.SFC = props => {
  return <StyledBaseStatus>Requesting Appeal</StyledBaseStatus>;
};

export const ReadyToCompleteStatusLabel: React.SFC = props => {
  return <StyledReadyToCompleteStatus>Ready To Complete</StyledReadyToCompleteStatus>;
};
