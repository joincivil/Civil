import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { TabComponentProps } from "./Tab";
import { colors, fonts } from "../styleConstants";

export const StyledTabCount = styled.span`
  display: inline-block;
  border-radius: 31px;
  font-size: 12px;
  line-height: 15px;
  margin-left: 6px;
  padding: 3px 10px;
`;

export const StyledTabNav = styled.div`
  background-color: ${colors.accent.CIVIL_GRAY_4};
  height: 76px;
  margin: 0 auto 50px;
  width: 100%;
  & > ul {
    justify-content: center;
  }
`;

export const StyledTabLarge = styled.li`
  align-items: center;
  border-bottom: ${(props: TabComponentProps) =>
    props.isActive ? "8px solid " + colors.accent.CIVIL_BLUE : "8px solid transparent"};
  color: ${(props: TabComponentProps) => (props.isActive ? colors.accent.CIVIL_BLUE : colors.accent.CIVIL_GRAY_2)};
  cursor: pointer;
  display: flex;
  font-family: ${fonts.SANS_SERIF};
  font-size: 19px;
  font-weight: 800;
  margin: 39px 40px 0 0;
  padding: 0 0 10px;
  &:last-of-type {
    margin: 39px 0 0 0;
  }
  &:hover {
    border-bottom: ${(props: TabComponentProps) =>
      props.isActive ? "8px solid " + colors.accent.CIVIL_BLUE : "8px solid " + colors.accent.CIVIL_GRAY_2};
  }
  & a {
    color: inherit;
  }
  & svg {
    margin-right: 5px;
    & circle {
      stroke: ${(props: TabComponentProps) => (props.isActive ? colors.accent.CIVIL_BLUE : colors.accent.CIVIL_GRAY_2)};
    }
    & path {
      fill: ${(props: TabComponentProps) => (props.isActive ? colors.accent.CIVIL_BLUE : colors.accent.CIVIL_GRAY_2)};
    }
  }
`;

export const StyledSquarePillTabNav = styled.div`
  display: flex;
  justify-content: center;
  margin: 30px auto 50px;
  width: 100%;
`;

export const StyledSquarePillTab = styled.li`
  background-color: ${(props: TabComponentProps) =>
    props.isActive ? colors.accent.CIVIL_BLUE_FADED_2 : "transparent"};
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-right: none;
  color: ${(props: TabComponentProps) => (props.isActive ? colors.accent.CIVIL_BLUE : colors.primary.BLACK)};
  cursor: pointer;
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  font-weight: 600;
  line-height: 17px;
  padding: 20px 44px;
  white-space: nowrap;
  &:last-of-type {
    border-right: 1px solid ${colors.accent.CIVIL_GRAY_4};
  }
  &:hover {
    color: ${colors.accent.CIVIL_BLUE};
    background-color: ${colors.accent.CIVIL_BLUE_FADED_2};
  }
  & ${StyledTabCount} {
    background-color: ${(props: TabComponentProps) =>
      props.isActive ? colors.accent.CIVIL_TEAL : colors.accent.CIVIL_GRAY_3};
  }
`;

export const StyledRoundPillTabNav = styled.div`
  margin: 0 auto 50px;
  max-width: 1200px;
  width: 100%;
`;

export const StyledRoundPillTab = styled.li`
  background-color: ${(props: TabComponentProps) => (props.isActive ? colors.accent.CIVIL_GRAY_4 : "transparent")};
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-radius: 23px;
  color: ${colors.primary.BLACK};
  cursor: pointer;
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  letter-spacing: -0.12px;
  list-style: none;
  margin-right: 10px;
  padding: 8px 15px;
  &:hover {
    background-color: ${colors.accent.CIVIL_GRAY_4};
  }
`;

export const StyledTab = styled.li`
  border-bottom: ${(props: TabComponentProps) =>
    props.isActive ? "2px solid " + colors.accent.CIVIL_BLUE : "2px solid transparent"};
  color: ${(props: TabComponentProps) => (props.isActive ? colors.primary.BLACK : colors.accent.CIVIL_GRAY_2)};
  cursor: pointer;
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  letter-spacing: -0.12px;
  margin-right: 30px;
  padding: 25px 0 15px;
  text-align: center;
  text-decoration: none;
  transition: background-color 500ms, border 500ms, color 500ms;
  &:hover {
    border-bottom: 2px solid ${colors.accent.CIVIL_BLUE};
    color: ${colors.primary.BLACK};
  }
  &.active {
    border-bottom: ;
    color: ${colors.primary.BLACK};
  }
`;
