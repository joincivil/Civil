import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { Heading, colors, fonts, TabComponentProps } from "@joincivil/components";

export const GridRow = styled.div`
  display: flex;
  margin: 0 auto;
  padding: 0 0 200px;
  width: 1200px;
`;
export const LeftShark = styled.div`
  width: 695px;
`;
export const RightShark = styled.div`
  margin: -100px 0 0 15px;
  width: 485px;
`;

export const ListingTabHeading = Heading.withComponent("h3").extend`
  font-size: 32px;
  line-height: 34px;
  margin: 34px 0 10px;
`;

export const ListingTabContent = styled.div`
  font-size: 18px;
  line-height: 33px;
  padding: 40px 0 0;
  width: 635px;

  & p {
    font-size: inherit;
    line-height: inherit;
  }
`;

export const ListingTab = styled.li`
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
