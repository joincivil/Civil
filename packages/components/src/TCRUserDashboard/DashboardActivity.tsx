import * as React from "react";
import { Collapsable, StyledCollapsibleContainerHeader } from "../Collapsable";
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

export const DashboardActivity: React.FunctionComponent<DashboardActivityProps> = props => {
  return (
    <StyledUserActivity>
      <Collapsable headerComponent={MyVotingTabText} headerWrapper={StyledCollapsibleContainerHeader} open={false}>
          <StyledUserActivityContent>{props.userVotes}</StyledUserActivityContent>
      </Collapsable>
      <Collapsable headerComponent={MyNewsroomsTabText} headerWrapper={StyledCollapsibleContainerHeader} open={false}>
          <StyledUserActivityContent>{props.userNewsrooms}</StyledUserActivityContent>
      </Collapsable>
      <Collapsable headerComponent={MyChallengesTabText} headerWrapper={StyledCollapsibleContainerHeader} open={false}>
          <StyledUserActivityContent>{props.userChallenges}</StyledUserActivityContent>
      </Collapsable>
    </StyledUserActivity>
  );
};
