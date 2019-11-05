import * as React from "react";
import styled from "styled-components";
import { colors, fonts, mediaQueries } from "../styleConstants";

const StyledDashboardHeaderOuter = styled.div`
  display: flex;
  padding: 62px 0 38px;
  justify-content: center;
  width: 400px;
  ${mediaQueries.MOBILE}  {
    width: 100%;
  }
`;

const StyledDashboardHeader = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-famliy: ${fonts.SERIF};
`;

export const UserDashboardHeader: React.FunctionComponent = props => {
  return (
    <StyledDashboardHeaderOuter>
      <StyledDashboardHeader>{props.children}</StyledDashboardHeader>
    </StyledDashboardHeaderOuter>
  );
};
