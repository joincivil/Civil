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
  numUserVotes: number;
  userNewsrooms: JSX.Element;
  numUserNewsrooms: number;
  userChallenges: JSX.Element;
  activeIndex: number;
  preventStartingTabOverride: boolean;
  onTabChange(activeIndex: number): void;
  onTabsLoadChange(activeIndex: number): void;
}

export const DashboardActivity: React.FunctionComponent<DashboardActivityProps> = props => {
  const [hasSetStartingTab, setStartingTab] = React.useState(false);
  React.useEffect(() => {
    if (!hasSetStartingTab && !props.preventStartingTabOverride) {
      setStartingTab(true);
      if (props.numUserVotes > 0) {
        props.onTabsLoadChange(0);
      } else if (props.numUserNewsrooms > 0) {
        props.onTabsLoadChange(1);
      }
    }
  });
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
