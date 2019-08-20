import * as React from "react";
import { StyledSubTabCount } from "./DashboardStyledComponents";
import {
  SubTabAllChallengesVotedText,
  SubTabRevealVoteText,
  SubTabClaimRewardsText,
  SubTabRescueTokensText,
  SubTabChallengesCompletedText,
  SubTabChallengesStakedText,
} from "./DashboardTextComponents";

export interface DashboardActivityTabTitleProps {
  count?: number;
}

const DashboardActivityTabTitle: React.FunctionComponent<DashboardActivityTabTitleProps> = props => {
  return (
    <>
      {props.children}
      <StyledSubTabCount>{props.count || "0"}</StyledSubTabCount>
    </>
  );
};

export const AllChallengesDashboardTabTitle: React.FunctionComponent<DashboardActivityTabTitleProps> = props => {
  return (
    <DashboardActivityTabTitle count={props.count}>
      <SubTabAllChallengesVotedText />
    </DashboardActivityTabTitle>
  );
};

export const RevealVoteDashboardTabTitle: React.FunctionComponent<DashboardActivityTabTitleProps> = props => {
  return (
    <DashboardActivityTabTitle count={props.count}>
      <SubTabRevealVoteText />
    </DashboardActivityTabTitle>
  );
};

export const ClaimRewardsDashboardTabTitle: React.FunctionComponent<DashboardActivityTabTitleProps> = props => {
  return (
    <DashboardActivityTabTitle count={props.count}>
      <SubTabClaimRewardsText />
    </DashboardActivityTabTitle>
  );
};

export const RescueTokensDashboardTabTitle: React.FunctionComponent<DashboardActivityTabTitleProps> = props => {
  return (
    <DashboardActivityTabTitle count={props.count}>
      <SubTabRescueTokensText />
    </DashboardActivityTabTitle>
  );
};

export const ChallengesCompletedDashboardTabTitle: React.FunctionComponent<DashboardActivityTabTitleProps> = props => {
  return (
    <DashboardActivityTabTitle count={props.count}>
      <SubTabChallengesCompletedText />
    </DashboardActivityTabTitle>
  );
};

export const ChallengesStakedDashboardTabTitle: React.FunctionComponent<DashboardActivityTabTitleProps> = props => {
  return (
    <DashboardActivityTabTitle count={props.count}>
      <SubTabChallengesStakedText />
    </DashboardActivityTabTitle>
  );
};
