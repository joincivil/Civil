import * as React from "react";
import styled from "styled-components";
import { colors } from "../styleConstants";

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
  align-items: center;
  display: flex;
`;

const Arrow = styled.div`
  border-bottom: 2px solid ${colors.basic.WHITE};
  border-left: 2px solid ${colors.basic.WHITE};
  height: 8px;
  margin: 1px 0 0 5px;
  transform: rotate(-45deg);
  width: 8px;
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

export const NavDropDown: React.StatelessComponent<NavDropDownProps> = props => {
  return (
    <DropDownContain>
      <DropDownLabel>
        {props.label}
        <Arrow />
      </DropDownLabel>
      <DropDownLinks>{props.children}</DropDownLinks>
    </DropDownContain>
  );
};
