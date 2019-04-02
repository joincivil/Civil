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

const TabTitle: React.FunctionComponent<TabTitleProps> = props => {
  return (
    <>
      {props.children}
      <StyledTabCount>{props.count || "0"}</StyledTabCount>
    </>
  );
};

export const NewApplicationsTabTitle: React.FunctionComponent<TabTitleProps> = props => {
  return (
    <TabTitle count={props.count}>
      <TabNewApplicationsText />
    </TabTitle>
  );
};

export const UnderChallengeTabTitle: React.FunctionComponent<TabTitleProps> = props => {
  return (
    <TabTitle count={props.count}>
      <TabUnderChallengeText />
    </TabTitle>
  );
};

export const AppealToCouncilTabTitle: React.FunctionComponent<TabTitleProps> = props => {
  return (
    <TabTitle count={props.count}>
      <TabAppealToCouncilText />
    </TabTitle>
  );
};

export const ChallengeCouncilAppealTabTitle: React.FunctionComponent<TabTitleProps> = props => {
  return (
    <TabTitle count={props.count}>
      <TabChallengeCouncilAppealText />
    </TabTitle>
  );
};

export const ReadyToUpdateTabTitle: React.FunctionComponent<TabTitleProps> = props => {
  return (
    <TabTitle count={props.count}>
      <TabReadyToUpdateText />
    </TabTitle>
  );
};
