import * as React from "react";
import styled from "styled-components/macro";
import { colors, mediaQueries } from "@joincivil/elements";
import { TabComponentProps } from "@joincivil/components";

export const UserManagementTabNav = styled.div`
  flex-shrink: 0;
  margin: 0 75px 0 0;
  width: 200px;

  & > ul {
    display: block;
  }

  ${mediaQueries.MOBILE} {
    height: auto;
    margin-bottom: 30px;
    position: relative;

    & > ul {
      display: block;
      justify-content: left;
    }
  }
`;

export const UserManagementTabs = styled.li`
  background-color: ${(props: TabComponentProps) => (props.isActive ? colors.accent.CIVIL_GRAY_6 : colors.basic.WHITE)};
  border-left: ${(props: TabComponentProps) =>
    props.isActive ? "1px solid" + colors.accent.CIVIL_PURPLE_1 : "1px solid transparent"};
  cursor: pointer;
  padding: 15px;
  text-decoration: none;
  transition: background-color 500ms, border 500ms;

  ${mediaQueries.HOVER} {
    &:hover {
      border-left: 1px solid ${colors.accent.CIVIL_PURPLE_1};
    }
  }
  &.active {
    border-left: 1px solid ${colors.accent.CIVIL_PURPLE_1};
  }
`;

export const UserManagementTabText = styled.span`
  font-size: 14px;
  font-weight: 600;
  line-height: 17px;

  span {
    color: ${colors.accent.CIVIL_GRAY_2};
    display: block;
    font-size: 12px;
    font-weight: 400;
    height: 15px;
  }
`;
