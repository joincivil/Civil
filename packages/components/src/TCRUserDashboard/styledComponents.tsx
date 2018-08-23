import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { TabComponentProps } from "../Tabs";
import { colors } from "../styleConstants";

export const StyledUserActivity = styled.div`
  background-color: transparent;
`;

export const StyledUserActivityContent = styled.h3`
  background-color: ${colors.basic.WHITE};
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-top: none;
`;

export const StyledTab = styled.li`
  color: ${(props: TabComponentProps) => (props.isActive ? colors.basic.WHITE : colors.accent.CIVIL_GRAY_3)};
  cursor: pointer;
  font-size: 18px;
  line-height: 21px;
  margin: 0 12px 12px;
  white-space: nowrap;
`;

export const StyledSubTabCount = styled.span`
  display: inline-block;
  background: ${colors.accent.CIVIL_TEAL};
  border-radius: 50%;
  font-size: 18px;
  line-height: 21px;
  padding: 4px;
`;
