import * as React from "react";
import styled from "styled-components";
import { colors, fonts } from "../styleConstants";

const StyledDashboardHeaderOuter = styled.div`
  background-color: ${colors.primary.CIVIL_BLUE_1};
  display: flex;
  padding: 62px 0 38px;
  justify-content: center;
`;

const StyledDashboardHeader = styled.div`
  color: ${colors.basic.WHITE};
  font-famliy: ${fonts.SERIF};
  width: 1200px;
`;

export const UserDashboardHeader: React.StatelessComponent = props => {
  return (
    <StyledDashboardHeaderOuter>
      <StyledDashboardHeader>{props.children}</StyledDashboardHeader>
    </StyledDashboardHeaderOuter>
  );
};
