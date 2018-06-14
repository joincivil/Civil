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

const StyledCommitVoteStatus = StyledBaseStatus.extend`
  background-color: ${colors.accent.CIVIL_YELLOW};
  color: ${colors.primary.BLACK};
`;
const StyledRevealVoteStatus = StyledBaseStatus.extend`
  background-color: ${colors.accent.CIVIL_TEAL_FADED};
  color: ${colors.primary.BLACK};
`;

export class AwaitingApprovalStatusLabel extends React.Component {
  public render(): JSX.Element {
    return <StyledBaseStatus>Awaiting Approval</StyledBaseStatus>;
  }
}

export class CommitVoteStatusLabel extends React.Component {
  public render(): JSX.Element {
    return <StyledCommitVoteStatus>Accepting Votes</StyledCommitVoteStatus>;
  }
}

export class RevealVoteStatusLabel extends React.Component {
  public render(): JSX.Element {
    return <StyledRevealVoteStatus>Revealing Votes</StyledRevealVoteStatus>;
  }
}

export class RequestingAppealStatusLabel extends React.Component {
  public render(): JSX.Element {
    return <StyledBaseStatus>Requesting Appeal</StyledBaseStatus>;
  }
}
