import * as React from "react";
import * as ReactDOM from "react-dom";

import { NavMenuState } from "./types";
import {
  StyledNavMenuContainer,
  StyledNavMenuResponsiveContainer,
  StyledMobileNavMenu,
  StyledVisibleIfLoggedInLink,
} from "./styledComponents";
import {
  NavLinkRegistryText,
  NavLinkParameterizerText,
  NavLinkContractAddressesText,
  NavLinkCreateNewsroomText,
  NavLinkConstitutionText,
  NavLinkFaqText,
  NavLinkContactText,
  NavLinkDashboardText,
} from "./textComponents";
import { NavLink } from "./NavLink";
import { NavDropDown } from "./NavDropDown";
import { NavMenuResponsiveToggleButton } from "./NavMenuResponsiveToggleButton";

export interface NavMenuLinksComponentProps {
  isLoggedIn: boolean;
}

const NavMenuLinksComponent: React.SFC<NavMenuLinksComponentProps> = props => {
  return (
    <>
      <NavDropDown
        label={
          <NavLink to="/registry">
            <NavLinkRegistryText />
          </NavLink>
        }
      >
        <NavLink to="/parameterizer">
          <NavLinkParameterizerText />
        </NavLink>
        <NavLink to="/contract-addresses">
          <NavLinkContractAddressesText />
        </NavLink>
      </NavDropDown>
      <NavLink href="https://civil.co/constitution/" target="_blank">
        <NavLinkConstitutionText />
      </NavLink>
      <NavLink to="/create-newsroom">
        <NavLinkCreateNewsroomText />
      </NavLink>
      <NavDropDown label="Get Help">
        <NavLink href="https://civil.co/faq/" target="_blank">
          <NavLinkFaqText />
        </NavLink>
        <NavLink href="https://civil.co/contact/" target="_blank">
          <NavLinkContactText />
        </NavLink>
      </NavDropDown>
      {props.isLoggedIn && (
        <StyledVisibleIfLoggedInLink>
          <NavLink to="/dashboard">
            <NavLinkDashboardText />
          </NavLink>
        </StyledVisibleIfLoggedInLink>
      )}
    </>
  );
};

class NavMenuResponsiveDrawer extends React.Component<NavMenuState & NavMenuLinksComponentProps> {
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

export class NavMenu extends React.Component<NavMenuLinksComponentProps, NavMenuState> {
  constructor(props: NavMenuLinksComponentProps) {
    super(props);
    this.state = {
      isResponsiveDrawerOpen: false,
    };
  }

  public render(): JSX.Element {
    return (
      <>
        <StyledNavMenuContainer>
          <NavMenuLinksComponent isLoggedIn={this.props.isLoggedIn} />
        </StyledNavMenuContainer>
        <NavMenuResponsiveToggleButton
          isResponsiveDrawerOpen={this.state.isResponsiveDrawerOpen}
          onClick={() => this.toggleResponsiveMenuDrawer()}
        />
        <StyledNavMenuResponsiveContainer>
          <NavMenuResponsiveDrawer
            isResponsiveDrawerOpen={this.state.isResponsiveDrawerOpen}
            isLoggedIn={this.props.isLoggedIn}
          />
        </StyledNavMenuResponsiveContainer>
      </>
    );
  }

  private toggleResponsiveMenuDrawer = (): void => {
    this.setState({ isResponsiveDrawerOpen: !this.state.isResponsiveDrawerOpen });
  };
}
