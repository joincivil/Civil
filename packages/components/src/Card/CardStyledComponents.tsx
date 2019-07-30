import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";

export const StyledCardBase = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.accent.CIVIL_GRAY_0};
  font-family: ${fonts.SANS_SERIF};
  font-size: 16px;
  letter-spacing: 0;
  line-height: 26px;
  padding: 18px;
  transition: border-color 0.2s ease;
`;

export const StyledCardClickable = styled(StyledCardBase)`
  cursor: pointer;

  &:hover {
    background-color: ${colors.basic.WHITE};
    border-color: ${colors.accent.CIVIL_BLUE};
    color: ${colors.accent.CIVIL_GRAY_0};
  }
`;
