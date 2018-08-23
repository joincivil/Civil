import * as React from "react";
import { Tabs, Tab } from "../Tabs";
import { StyledUserActivity, StyledTab, StyledUserActivityContent } from "./styledComponents";
import { MyVotingTabText, MyNewsroomsTabText, MyChallengesTabText } from "./textComponents";

export interface DashboardActivityProps {
  userVotes: JSX.Element;
  userNewsrooms: JSX.Element;
  userChallenges: JSX.Element;
}

export const DashboardActivity: React.StatelessComponent<DashboardActivityProps> = props => {
  return (
    <StyledUserActivity>
      <Tabs TabComponent={StyledTab}>
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
