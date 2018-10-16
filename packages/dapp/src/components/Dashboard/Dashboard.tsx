import * as React from "react";
import styled from "styled-components";
import { UserDashboardHeader } from "@joincivil/components";
import UserInfoSummary from "./UserInfoSummary";
import DashboardActivity from "./DashboardActivity";

const StyledDashboardActivityContainer = styled.div`
  box-sizing: border-box;
  padding: 0 0 200px 396px;
  margin: -318px auto 0;
  width: 1200px;
`;

export interface DashboardProps {
  match?: any;
  history: any;
}

export const Dashboard: React.SFC<DashboardProps> = props => {
  return (
    <>
      <UserDashboardHeader>
        <UserInfoSummary />
      </UserDashboardHeader>
      <StyledDashboardActivityContainer>
        <DashboardActivity match={props.match} history={props.history} />
      </StyledDashboardActivityContainer>
    </>
  );
};
