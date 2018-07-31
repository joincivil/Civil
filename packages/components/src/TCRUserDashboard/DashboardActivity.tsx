import * as React from "react";
import styled from "styled-components";
import { colors } from "../styleConstants";

const StyledUserActivity = styled.div`
  background-color: transparent;
`;

const StyledUserActivityHeader = styled.h3`
  color: ${colors.basic.WHITE};
  font-size: 18px;
  font-weight: normal;
  line-height: 21px;
`;

const StyledUserActivityContent = styled.h3`
  background-color: ${colors.basic.WHITE};
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-top: none;
`;

export const DashboardActivity: React.StatelessComponent = props => {
  return (
    <StyledUserActivity>
      <StyledUserActivityHeader>My Activity</StyledUserActivityHeader>
      <StyledUserActivityContent>{props.children}</StyledUserActivityContent>
    </StyledUserActivity>
  );
};
