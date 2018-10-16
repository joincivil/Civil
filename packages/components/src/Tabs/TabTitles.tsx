import * as React from "react";
import { StyledTabCount } from "./TabsStyled";
import {
  TabNewApplicationsText,
  TabUnderChallengeText,
  TabAppealToCouncilText,
  TabChallengeCouncilAppealText,
  TabReadyToUpdateText,
} from "./textComponents";

export interface TabTitleProps {
  count?: number;
}

const TabTitle: React.SFC<TabTitleProps> = props => {
  return (
    <>
      {props.children}
      <StyledTabCount>{props.count || "0"}</StyledTabCount>
    </>
  );
};

export const NewApplicationsTabTitle: React.SFC<TabTitleProps> = props => {
  return (
    <TabTitle count={props.count}>
      <TabNewApplicationsText />
    </TabTitle>
  );
};

export const UnderChallengeTabTitle: React.SFC<TabTitleProps> = props => {
  return (
    <TabTitle count={props.count}>
      <TabUnderChallengeText />
    </TabTitle>
  );
};

export const AppealToCouncilTabTitle: React.SFC<TabTitleProps> = props => {
  return (
    <TabTitle count={props.count}>
      <TabAppealToCouncilText />
    </TabTitle>
  );
};

export const ChallengeCouncilAppealTabTitle: React.SFC<TabTitleProps> = props => {
  return (
    <TabTitle count={props.count}>
      <TabChallengeCouncilAppealText />
    </TabTitle>
  );
};

export const ReadyToUpdateTabTitle: React.SFC<TabTitleProps> = props => {
  return (
    <TabTitle count={props.count}>
      <TabReadyToUpdateText />
    </TabTitle>
  );
};
