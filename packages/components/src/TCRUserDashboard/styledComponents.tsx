import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { StyledTab, TabComponentProps } from "../Tabs";
import { colors, fonts } from "../styleConstants";

export const StyledUserActivity = styled.div`
  background-color: transparent;
`;

export const StyledUserActivityContent = styled.h3`
  background-color: ${colors.basic.WHITE};
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-top: none;
  min-height: 400px;
`;

export const StyledDashboardTab = styled.li`
  color: ${(props: TabComponentProps) => (props.isActive ? colors.basic.WHITE : colors.accent.CIVIL_GRAY_3)};
  cursor: pointer;
  font-size: 18px;
  line-height: 21px;
  margin: 0 12px 12px;
  white-space: nowrap;
`;

export const StyledSubTabCount = styled.span`
  display: inline-block;
  border-radius: 31px;
  font-size: 12px;
  line-height: 15px;
  margin-left: 6px;
  padding: 3px 10px;
`;

export const StyledDashboardSubTab = StyledTab.extend`
  white-space: nowrap;

  & ${StyledSubTabCount} {
    background-color: ${(props: TabComponentProps) =>
      props.isActive ? colors.accent.CIVIL_TEAL : colors.accent.CIVIL_GRAY_3};
  }
`;

export const StyledDashboardActivityDescription = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  font-size: 21px;
  font-weight: 300;
  line-height: 28px;
  letter-spacing: -0.14px;
  padding: 36px 24px;
`;

export const StyledUserInfo = styled.div`
  width: 277px;
`;

export const StyledUserInfoSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 0;

  & a {
    color: ${colors.basic.WHITE};
    text-align: right;
  }
`;

// '80' is a hexidecimal number that equals  0.5 alpha
export const StyledUserInfoSectionLabel = styled.div`
  color: ${colors.basic.WHITE}80;
  font-size: 12px;
  font-weight: 800;
  line-height: 15px;
  text-transform: uppercase;
`;

export const StyledUserInfoSectionValue = styled.div`
  color: ${colors.basic.WHITE}80;
  font-size: 12px;
  line-height: 15px;
  text-align: right;

  & strong {
    color: ${colors.basic.WHITE};
    display: block;
    font-size: 18px;
    font-weight: 500;
    line-height: 21px;
  }
`;

// '32' == 20% in hexadecimal
export const StyledUserAddress = styled.div`
  border-bottom: 1px solid ${colors.basic.WHITE}32;
  font-size: 16px;
  font-family: ${fonts.MONOSPACE};
  line-height: 26px;
  padding: 0 0 24px;
  margin: 15px 0;
`;
