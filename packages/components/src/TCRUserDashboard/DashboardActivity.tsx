import * as React from "react";
import { Collapsable, StyledCollapsibleContainerHeader, TasksTitle, HistoryTitle, NewsroomsTitle } from "../Collapsable";
import {
  StyledUserActivity,
  StyledUserActivityContent,
} from "./DashboardStyledComponents";

export interface DashboardActivityProps {
  userVotes: JSX.Element;
  numUserVotes: number;
  userNewsrooms: JSX.Element;
  numUserNewsrooms?: number;
  userChallenges: JSX.Element;
  numUserChallenges: number;
  activeIndex: number;
  onTabChange(activeIndex: number): void;
}

export const DashboardActivity: React.FunctionComponent<DashboardActivityProps> = props => {
  const tasksOpen = props.numUserVotes > 0;
  const newsroomsOpen = props.numUserNewsrooms! > 0;
  // const challengesOpen = props.numUserChallenges > 0;
  console.log("props.numUserVotes: ", props.numUserVotes);
  console.log("tasksOpen: ", tasksOpen);
  return (
    <StyledUserActivity>
      <Collapsable headerComponent={TasksTitle} headerWrapper={StyledCollapsibleContainerHeader} open={tasksOpen} count={props.numUserVotes}>
          <StyledUserActivityContent>{props.userVotes}</StyledUserActivityContent>
      </Collapsable>
      <Collapsable headerComponent={NewsroomsTitle} headerWrapper={StyledCollapsibleContainerHeader} open={newsroomsOpen} count={props.numUserNewsrooms || 0}>
          <StyledUserActivityContent>{props.userNewsrooms}</StyledUserActivityContent>
      </Collapsable>
      <Collapsable headerComponent={HistoryTitle} headerWrapper={StyledCollapsibleContainerHeader} open={false} count={props.numUserChallenges}>
          <StyledUserActivityContent>{props.userChallenges}</StyledUserActivityContent>
      </Collapsable>
    </StyledUserActivity>
  );
};
