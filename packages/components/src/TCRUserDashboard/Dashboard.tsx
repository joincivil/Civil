import * as React from "react";
import styled from "styled-components";
import { colors, fonts } from "../styleConstants";

const StyledDashboardHeaderOuter = styled.div`
  background-color: ${colors.accent.CIVIL_BLUE_VERY_FADED_2};
  display: flex;
  padding: 62px 0 38px;
  justify-content: center;
`;

const StyledDashboardHeader = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
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
