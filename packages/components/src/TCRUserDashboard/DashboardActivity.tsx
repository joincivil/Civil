import * as React from "react";
import styled from "styled-components";
import { colors } from "../styleConstants";
import { Tabs, Tab, TabComponentProps } from "../Tabs";

const StyledUserActivity = styled.div`
  background-color: transparent;
`;

const StyledUserActivityContent = styled.h3`
  background-color: ${colors.basic.WHITE};
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-top: none;
`;

const StyledTab = styled.li`
  color: ${(props: TabComponentProps) => (props.isActive ? colors.basic.WHITE : colors.accent.CIVIL_GRAY_3)};
  cursor: pointer;
  font-size: 18px;
  line-height: 21px;
  margin: 0 12px 12px;
  white-space: nowrap;
`;

export interface DashboardActivityProps {
  userVotes: JSX.Element;
  userNewsrooms: JSX.Element;
  userChallenges: JSX.Element;
}

export const DashboardActivity: React.StatelessComponent<DashboardActivityProps> = props => {
  return (
    <StyledUserActivity>
      <Tabs TabComponent={StyledTab}>
        <Tab title="My Voting">
          <StyledUserActivityContent>{props.userVotes}</StyledUserActivityContent>
        </Tab>
        <Tab title="My Newsrooms">
          <StyledUserActivityContent>{props.userNewsrooms}</StyledUserActivityContent>
        </Tab>
        <Tab title="My Challenges">
          <StyledUserActivityContent>{props.userChallenges}</StyledUserActivityContent>
        </Tab>
      </Tabs>
    </StyledUserActivity>
  );
};
