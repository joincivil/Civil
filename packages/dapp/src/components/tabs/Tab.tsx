import * as React from "react";
import styled from "styled-components";

export interface TabProps {
  className?: string;
  icon?: any;
  tabIndex?: number;
  isActive?: boolean;
  tabText?: string;
  tabCount?: string;
  tabImg?: string;
  onClick?(index: number): () => any;
}

export const TabComponent: React.StatelessComponent<TabProps> = props => {
  const activeClass = props.isActive ? " active" : "";
  const hasImg = props.tabImg ? <Icon src={props.tabImg} /> : "";
  const hasCount = props.tabCount ? <Count>{props.tabCount}</Count> : "";

  return (
    <button
      onClick={(event: any) => {
        event.preventDefault();
        props.onClick!(props.tabIndex!);
      }}
      className={props.className + activeClass}
    >
      {hasImg}
      {props.tabText}
      {hasCount}
    </button>
  );
};

const BaseTab = styled(TabComponent)`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-family: "Libre Franklin", sans-serif;
  outline: none;
  text-align: center;
  text-decoration: none;
  transition: background-color 500ms, border 500ms, color 500ms;
`;

export const Tab = BaseTab.extend`
  color: #7D7373;
  font-size: 14px;
  &:hover {
    color: #000;
  }
  &.active {
    color: #000;
  }
`;

export const BasicTab = BaseTab.extend`
  border-bottom: 2px soild #2B56FF;
  color: #7D7373;
  font-size: 14px;
  letter-spacing: -0.12px;
  margin-right: 15px;
  padding: 10px 0;
  &:hover {
    border-bottom: 2px soild #2B56FF;
    color: #000;
  }
  &.active {
    border-bottom: 2px soild #2B56FF;
    color: #000;
  }
`;

export const PillTab = BaseTab.extend`
  border: 1px solid #E9E9EA;
  border-radius: 23px;
  color: #000;
  font-size: 14px;
  letter-spacing: -0.13px;
  margin-right: 10px;
  padding: 8px 15px;
  &:hover {
    background-color: #E9E9EA;
  }
  &.active {
    background-color: #E9E9EA;
  }
`;

export const BoxTab = BaseTab.extend`
  border: 1px solid #E9E9EA;
  border-right: none;
  color: #000;
  font-size: 14px;
  font-weight: 600;
  line-height: 17px;
  padding: 20px 44px;
  &:last-of-type {
    border-right: 1px solid #E9E9EA;
  }
  &:hover {
    color: #2B56FF;
    background-color: #E9EEFF;
  }
  &.active {
    color: #2B56FF;
    background-color: #E9EEFF;
  }
`;

export const BorderBottomTab = BaseTab.extend`
  border-bottom: 8px solid transparent;
  color: #7D7373;
  font-size: 19px;
  font-weight: 800;
  margin: 39px 20px 0 0;
  padding: 0 0 10px;
  &:last-of-type {
    margin: 39px 0 0 0;
  }
  &:hover {
    border-bottom: 8px solid #7D7373;
  }
  &.active {
    border-bottom: 8px solid #2B56FF;
    color: #2B56FF;
  }
`;

export const Icon = styled.img`
  background-color: #2B56FF;
  border: none;
  display: inline-block;
  height: 15px;
  margin-right: 5px;
  width: 15px;
`;

export const Count = styled.span`
  font-weight: 400;
`;
