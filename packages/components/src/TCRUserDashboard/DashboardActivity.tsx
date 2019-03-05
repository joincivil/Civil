import * as React from "react";
import { Tabs, Tab } from "../Tabs";
import {
  StyledUserActivity,
  StyledDashboardTabsContainer,
  StyledDashboardTab,
  StyledUserActivityContent,
} from "./DashboardStyledComponents";
import { MyVotingTabText, MyNewsroomsTabText, MyChallengesTabText } from "./DashboardTextComponents";

export interface DashboardActivityProps {
  userVotes: JSX.Element;
  userNewsrooms: JSX.Element;
  userChallenges: JSX.Element;
  activeIndex: number;
  onTabChange(activeIndex: number): void;
}

export const DashboardActivity: React.StatelessComponent<DashboardActivityProps> = props => {
  return (
    <StyledUserActivity>
      <Tabs
        TabsNavComponent={StyledDashboardTabsContainer}
        TabComponent={StyledDashboardTab}
        activeIndex={props.activeIndex}
        onActiveTabChange={props.onTabChange}
      >
        <Tab title={<MyVotingTabText />}>
          <StyledUserActivityContent>{props.userVotes}</StyledUserActivityContent>
        </Tab>
        <Tab title={<MyNewsroomsTabText />}>
          <StyledUserActivityContent>{props.userNewsrooms}</StyledUserActivityContent>
        </Tab>
        <Tab title={<MyChallengesTabText />}>
          <StyledUserActivityContent>{props.userChallenges}</StyledUserActivityContent>
        </Tab>
      </Tabs>
    </StyledUserActivity>
  );
};
