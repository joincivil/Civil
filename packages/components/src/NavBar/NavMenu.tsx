import * as React from "react";
import * as ReactDOM from "react-dom";

import { NavMenuState } from "./NavBarTypes";
import { StyledNavMenuContainer, StyledNavMenuResponsiveContainer, StyledMobileNavMenu } from "./styledComponents";
import {
  NavLinkRegistryText,
  NavLinkParameterizerText,
  NavLinkContractAddressesText,
  NavLinkConstitutionText,
  NavLinkFoundationText,
  NavLinkFaqText,
} from "./textComponents";
import { NavLink } from "./NavLink";
import { NavDropDown } from "./NavDropDown";
import { NavMenuResponsiveToggleButton } from "./NavMenuResponsiveToggleButton";

interface NavMenuCloseDrawerProp {
  closeDrawer?(): void;
}

const NavMenuLinksComponent: React.SFC<NavMenuCloseDrawerProp> = props => {
  let mobileOnClickProp: any = {};
  if (props.closeDrawer) {
    mobileOnClickProp = { onClick: props.closeDrawer };
  }
  return (
    <>
      <NavDropDown
        label={
          <NavLink to="/registry" {...mobileOnClickProp}>
            <NavLinkRegistryText />
          </NavLink>
        }
      >
        <NavLink to="/parameterizer" {...mobileOnClickProp}>
          <NavLinkParameterizerText />
        </NavLink>
        <NavLink to="/contract-addresses" {...mobileOnClickProp}>
          <NavLinkContractAddressesText />
        </NavLink>
      </NavDropDown>
      <NavLink href="https://civil.co/constitution/">
        <NavLinkConstitutionText />
      </NavLink>
      <NavLink href="https://civilfound.org/">
        <NavLinkFoundationText />
      </NavLink>
      <NavLink href="https://help.civil.co/">
        <NavLinkFaqText />
      </NavLink>
    </>
  );
};

class NavMenuResponsiveDrawer extends React.Component<NavMenuState & NavMenuCloseDrawerProp> {
  public bucket: HTMLDivElement = document.createElement("div");

  public componentDidMount(): void {
    document.body.appendChild(this.bucket);
  }

  public componentWillUnmount(): void {
    document.body.removeChild(this.bucket);
  }

  public render(): React.ReactPortal | null {
    if (!this.props.isResponsiveDrawerOpen) {
      return null;
    }

    const mobileNavMenu = (
      <>
        <StyledMobileNavMenu>
          <NavMenuLinksComponent {...this.props} />
        </StyledMobileNavMenu>
      </>
    );

    return ReactDOM.createPortal(mobileNavMenu, this.bucket);
  }
}

export class NavMenu extends React.Component<{}, NavMenuState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isResponsiveDrawerOpen: false,
    };
  }

  public render(): JSX.Element {
    return (
      <>
        <StyledNavMenuContainer>
          <NavMenuLinksComponent />
        </StyledNavMenuContainer>
        <NavMenuResponsiveToggleButton
          isResponsiveDrawerOpen={this.state.isResponsiveDrawerOpen}
          onClick={() => this.toggleResponsiveMenuDrawer()}
        />
        <StyledNavMenuResponsiveContainer>
          <NavMenuResponsiveDrawer
            isResponsiveDrawerOpen={this.state.isResponsiveDrawerOpen}
            closeDrawer={this.closeResponsiveMenuDrawer}
          />
        </StyledNavMenuResponsiveContainer>
      </>
    );
  }

  private toggleResponsiveMenuDrawer = (): void => {
    this.setState({ isResponsiveDrawerOpen: !this.state.isResponsiveDrawerOpen });
  };

  private closeResponsiveMenuDrawer = (): void => {
    this.setState({ isResponsiveDrawerOpen: false });
  };
}
