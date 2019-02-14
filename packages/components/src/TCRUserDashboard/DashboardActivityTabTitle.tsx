import * as React from "react";
import { StyledSubTabCount } from "./styledComponents";
import {
  SubTabAllChallengesVotedText,
  SubTabRevealVoteText,
  SubTabClaimRewardsText,
  SubTabRescueTokensText,
  SubTabChallengesCompletedText,
  SubTabChallengesStakedText,
} from "./textComponents";

export interface DashboardActivityTabTitleProps {
  count?: number;
}

const DashboardActivityTabTitle: React.SFC<DashboardActivityTabTitleProps> = props => {
  return (
    <>
      {props.children}
      <StyledSubTabCount>{props.count || "0"}</StyledSubTabCount>
    </>
  );
};

export const AllChallengesDashboardTabTitle: React.SFC<DashboardActivityTabTitleProps> = props => {
  return (
    <DashboardActivityTabTitle count={props.count}>
      <SubTabAllChallengesVotedText />
    </DashboardActivityTabTitle>
  );
};

export const RevealVoteDashboardTabTitle: React.SFC<DashboardActivityTabTitleProps> = props => {
  return (
    <DashboardActivityTabTitle count={props.count}>
      <SubTabRevealVoteText />
    </DashboardActivityTabTitle>
  );
};

export const ClaimRewardsDashboardTabTitle: React.SFC<DashboardActivityTabTitleProps> = props => {
  return (
    <DashboardActivityTabTitle count={props.count}>
      <SubTabClaimRewardsText />
    </DashboardActivityTabTitle>
  );
};

export const RescueTokensDashboardTabTitle: React.SFC<DashboardActivityTabTitleProps> = props => {
  return (
    <DashboardActivityTabTitle count={props.count}>
      <SubTabRescueTokensText />
    </DashboardActivityTabTitle>
  );
};

export const ChallengesCompletedDashboardTabTitle: React.SFC<DashboardActivityTabTitleProps> = props => {
  return (
    <DashboardActivityTabTitle count={props.count}>
      <SubTabChallengesCompletedText />
    </DashboardActivityTabTitle>
  );
};

export const ChallengesStakedDashboardTabTitle: React.SFC<DashboardActivityTabTitleProps> = props => {
  return (
    <DashboardActivityTabTitle count={props.count}>
      <SubTabChallengesStakedText />
    </DashboardActivityTabTitle>
  );
};
