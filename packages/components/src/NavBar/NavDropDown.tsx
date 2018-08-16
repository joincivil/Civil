import * as React from "react";
import styled from "styled-components";
import { colors } from "../styleConstants";
import { ExpandDownArrow } from "../icons/ExpandDownArrow";

export interface NavDropDownProps {
  label: string;
}

const DropDownContain = styled.div`
  padding: 6px 12px;
  position: relative;
  &:hover > div {
    display: block;
  }
`;

const DropDownLabel = styled.span`
  & > svg {
    margin-left: 10px;
  }
`;

const DropDownLinks = styled.div`
  background-color: ${colors.primary.BLACK};
  display: none;
  left: 0;
  padding: 16px 16px 11px;
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

export class NavDropDown extends React.Component<NavDropDownProps> {
  public render(): JSX.Element {
    return (
      <DropDownContain>
        <DropDownLabel>
          {this.props.label}
          <ExpandDownArrow />
        </DropDownLabel>
        <DropDownLinks>{this.props.children}</DropDownLinks>
      </DropDownContain>
    );
  }
}
