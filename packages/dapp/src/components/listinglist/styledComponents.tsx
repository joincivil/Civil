import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts, TabComponentProps } from "@joincivil/components";

export const ListingsTabNav = styled.div`
  background-color: ${colors.accent.CIVIL_GRAY_4};
  height: 76px;
  margin: 0 auto 50px;
  width: 100%;
  & > ul {
    justify-content: center;
  }
`;

export const ListingsTab = styled.li`
  border-bottom: ${(props: TabComponentProps) =>
    props.isActive ? "8px solid " + colors.accent.CIVIL_BLUE : "8px solid transparent"};
  color: ${(props: TabComponentProps) => (props.isActive ? colors.accent.CIVIL_BLUE : colors.accent.CIVIL_GRAY_2)};
  cursor: pointer;
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
`;

export const ListingsInProgressTabNav = styled.div`
  margin: 30px auto 50px;
  width: 100%;
`;

export const ListingsInProgressTab = styled.li`
  background-color: ${(props: TabComponentProps) => (props.isActive ? "#e9eeff" : "transparent")};
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-right: none;
  color: ${(props: TabComponentProps) => (props.isActive ? colors.accent.CIVIL_BLUE : colors.primary.BLACK)};
  cursor: pointer;
  font-family: ${fonts.SANS_SERIF};
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
`;

export const MyActivityTabNav = styled.div`
  margin: 0 auto 50px;
  max-width: 1200px;
  width: 100%;
`;

export const MyActivityTab = styled.li`
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
