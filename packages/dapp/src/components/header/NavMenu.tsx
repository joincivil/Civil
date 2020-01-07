import * as React from "react";
import * as ReactDOM from "react-dom";
import { NavMenuState } from "./NavBarTypes";
import { StyledNavMenuContainer, StyledNavMenuResponsiveContainer, StyledMobileNavMenu } from "./styledComponents";
import {
  NavLinkRegistryText,
  NavLinkRegistryHomeText,
  NavLinkParameterizerText,
  NavLinkContractAddressesText,
  NavLinkStoryBoostsText,
  NavLinkProjectBoostsText,
  NavLinkConstitutionText,
  NavLinkFoundationText,
  NavLinkFaqText,
  NavLinkStoryfeedText,
  NavLinkPublishersText,
} from "./textComponents";
import { NavLink } from "./NavLink";
import { NavDropDown } from "./NavDropDown";
import { NavMenuResponsiveToggleButton } from "./NavMenuResponsiveToggleButton";

interface NavMenuCloseDrawerProp {
  closeDrawer?(): void;
}

const NavMenuLinksComponent: React.FunctionComponent<NavMenuCloseDrawerProp> = props => {
  let mobileOnClickProp: any = {};
  if (props.closeDrawer) {
    mobileOnClickProp = { onClick: props.closeDrawer };
  }
  return (
    <>
      <NavDropDown label={<NavLinkStoryfeedText />}>
        <NavLink to="/storyfeed" {...mobileOnClickProp}>
          <NavLinkStoryBoostsText />
        </NavLink>
        <NavLink to="/boosts" {...mobileOnClickProp}>
          <NavLinkProjectBoostsText />
        </NavLink>
      </NavDropDown>
      <NavDropDown label={<NavLinkRegistryText />}>
        <NavLink to="/registry" {...mobileOnClickProp}>
          <NavLinkRegistryHomeText />
        </NavLink>
        <NavLink to="/parameterizer" {...mobileOnClickProp}>
          <NavLinkParameterizerText />
        </NavLink>
        <NavLink href="https://civilfound.org/" target="_blank">
          <NavLinkFoundationText />
        </NavLink>
        <NavLink href="https://learn.civil.co/constitution/" target="_blank">
          <NavLinkConstitutionText />
        </NavLink>
        <NavLink to="/contract-addresses" {...mobileOnClickProp}>
          <NavLinkContractAddressesText />
        </NavLink>
      </NavDropDown>
      <NavLink href="https://learn.civil.co/boosts" target="_blank">
        <NavLinkPublishersText />
      </NavLink>
      <NavLink href="https://help.civil.co/" target="_blank">
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
