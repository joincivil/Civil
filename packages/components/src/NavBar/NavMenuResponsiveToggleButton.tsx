import * as React from "react";

import { CloseXIcon, HamburgerIcon } from "../icons";

import { NavMenuState } from "./NavBarTypes";
import { StyledNavMenuResponsiveButton } from "./styledComponents";

export interface NavMenuResponsiveToggleButtonProps extends NavMenuState {
  onClick(): void;
}

export class NavMenuResponsiveToggleButton extends React.Component<NavMenuResponsiveToggleButtonProps> {
  public render(): JSX.Element {
    const Icon = this.props.isResponsiveDrawerOpen ? CloseXIcon : HamburgerIcon;

    return (
      <StyledNavMenuResponsiveButton>
        <div onClick={this.props.onClick}>
          <Icon />
        </div>
      </StyledNavMenuResponsiveButton>
    );
  }
}
