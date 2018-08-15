import * as React from "react";
import styled from "styled-components";
import { colors } from "../styleConstants";
import { DownArrow } from "../icons/DownArrow";

export interface NavBarDropDownProps {
  label: string;
}

const NavBarDropDown = styled.div`
  padding: 6px 12px;
  position: relative;
  &:hover > div {
    display: block;
  }
`;

const NavBarDropDownLabel = styled.span`
  & > svg {
    margin-left: 10px;
  }
`;

const NavBarDropDownLinks = styled.div`
  background-color: ${colors.primary.BLACK};
  display: none;
  left: 0;
  min-width: 150px;
  padding: 21px 16px 16px;
  position: absolute;
  top: 25px;
  & > a {
    border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_2};
    display: block;
    margin: 0;
    padding: 15px 0;
    width: 100%;
    &:last-of-type {
      border-bottom: none;
    }
  }
`;

export class NavBarDropDownComponent extends React.Component<NavBarDropDownProps> {
  public render(): JSX.Element {
    return (
      <NavBarDropDown>
        <NavBarDropDownLabel>
          {this.props.label}
          <DownArrow />
        </NavBarDropDownLabel>
        <NavBarDropDownLinks>{this.props.children}</NavBarDropDownLinks>
      </NavBarDropDown>
    );
  }
}
