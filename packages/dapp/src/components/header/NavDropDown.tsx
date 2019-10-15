import * as React from "react";
import { DropDownContain, DropDownLabel, DropDownArrow, DropDownLinks } from "./styledComponents";

export interface NavDropDownProps {
  label: string | JSX.Element;
}

export const NavDropDown: React.FunctionComponent<NavDropDownProps> = props => {
  return (
    <DropDownContain>
      <DropDownLabel>
        {props.label}
        <DropDownArrow />
      </DropDownLabel>
      <DropDownLinks>{props.children}</DropDownLinks>
    </DropDownContain>
  );
};
