import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";

import { colors, fonts } from "./styleConstants";

export interface TabProps {
  className?: string;
  tabIndex?: number;
  isActive?: boolean;
  tabText?: string;
  tabCount?: string;
  tabImg?: string;
  onClick?(index: number): () => any;
}

export const TabComponent: React.StatelessComponent<TabProps> = props => {
  const activeClass = props.isActive ? " active" : "";
  const hasIcon = props.tabImg ? <Icon src={props.tabImg} /> : "";
  const hasCount = props.tabCount ? <Count>{props.tabCount}</Count> : "";

  return (
    <button
      onClick={(event: any) => {
        event.preventDefault();
        props.onClick!(props.tabIndex!);
      }}
      className={props.className + activeClass}
    >
      {hasIcon}
      {props.tabText}
      {hasCount}
    </button>
  );
};

export const BaseTab = styled(TabComponent)`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-family: ${fonts.SANS_SERIF};
  outline: none;
  text-align: center;
  text-decoration: none;
  transition: background-color 500ms, border 500ms, color 500ms;
`;

export const Tab = BaseTab.extend`
  color: ${colors.accent.CIVIL_GRAY_2};
  font-size: 14px;
  &:hover {
    color: ${colors.primary.BLACK};
  }
  &.active {
    color: ${colors.primary.BLACK};
  }
`;

export const BasicTab = BaseTab.extend`
  border-bottom: 2px solid transparent;
  color: ${colors.accent.CIVIL_GRAY_2};
  font-size: 14px;
  letter-spacing: -0.12px;
  margin-right: 15px;
  padding: 10px 0 15px;
  &:hover {
    border-bottom: 2px solid ${colors.accent.CIVIL_BLUE};
    color: ${colors.primary.BLACK};
  }
  &.active {
    border-bottom: 2px solid ${colors.accent.CIVIL_BLUE};
    color: ${colors.primary.BLACK};
  }
`;

export const PillTab = BaseTab.extend`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-radius: 23px;
  color: ${colors.primary.BLACK};
  font-size: 14px;
  letter-spacing: -0.13px;
  margin-right: 10px;
  padding: 8px 15px;
  &:hover {
    background-color: ${colors.accent.CIVIL_GRAY_4};
  }
  &.active {
    background-color: ${colors.accent.CIVIL_GRAY_4};
  }
`;

export const BoxTab = BaseTab.extend`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-right: none;
  color: ${colors.primary.BLACK};
  font-size: 14px;
  font-weight: 600;
  line-height: 17px;
  padding: 20px 44px;
  &:last-of-type {
    border-right: 1px solid ${colors.accent.CIVIL_GRAY_4};
  }
  &:hover {
    color: ${colors.accent.CIVIL_BLUE};
    background-color: #e9eeff;
  }
  &.active {
    color: ${colors.accent.CIVIL_BLUE};
    background-color: #e9eeff;
  }
`;

export const BorderBottomTab = BaseTab.extend`
  border-bottom: 8px solid transparent;
  color: ${colors.accent.CIVIL_GRAY_2};
  font-size: 19px;
  font-weight: 800;
  margin: 39px 40px 0 0;
  padding: 0 0 10px;
  &:last-of-type {
    margin: 39px 0 0 0;
  }
  &:hover {
    border-bottom: 8px solid ${colors.accent.CIVIL_GRAY_2};
  }
  &.active {
    border-bottom: 8px solid ${colors.accent.CIVIL_BLUE};
    color: ${colors.accent.CIVIL_BLUE};
  }
`;

export const Icon = styled.img`
  background-color: ${colors.accent.CIVIL_BLUE};
  border: none;
  display: inline-block;
  height: 15px;
  margin-right: 5px;
  width: 15px;
`;

export const Count = styled.span`
  font-weight: 400;
`;
