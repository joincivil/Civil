import * as React from "react";
import { CollapsibleContainer } from "../CollapsibleContainer";
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
        <CollapsibleContainer Title={<MyVotingTabText />}>
          <StyledUserActivityContent>{props.userVotes}</StyledUserActivityContent>
      </CollapsibleContainer>
      <CollapsibleContainer Title={<MyNewsroomsTabText />}>
          <StyledUserActivityContent>{props.userNewsrooms}</StyledUserActivityContent>
      </CollapsibleContainer>
      <CollapsibleContainer Title={<MyChallengesTabText />}>
          <StyledUserActivityContent>{props.userChallenges}</StyledUserActivityContent>
      </CollapsibleContainer>
    </StyledUserActivity>
  );
};
