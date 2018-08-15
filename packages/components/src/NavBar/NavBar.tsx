import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";
import { CivilLogo } from "../CivilLogo";
import { NavBarLink } from "./NavBarLink";
import { NavBarDropDownComponent } from "./NavBarDropDown";
import { NavBarDrawerComponent } from "./NavBarDrawer";

const NavBarOuter = styled.div`
  align-items: center;
  background-color: ${colors.primary.BLACK};
  display: flex;
  justify-content: space-between;
  padding: 15px 30px;
`;

const NavBarLogo = styled.div`
  height: 21px;
  width: 72px;
`;

const NavBarInner = styled.div`
  align-items: center;
  color: ${colors.basic.WHITE};
  display: flex;
  font-family: ${fonts.SANS_SERIF};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  & a {
    color: ${colors.basic.WHITE};
    text-decoration: none;
    transition: color 0.2s;
    &:hover {
      color: ${colors.accent.CIVIL_GRAY_2};
    }
  }
  & > a {
    margin: 0 15px;
  }
`;

export class NavBar extends React.Component {
  public render(): JSX.Element {
    return (
      <NavBarOuter>
        <NavBarLogo>
          <NavBarLink to="/home">
            <CivilLogo color={colors.basic.WHITE} />
          </NavBarLink>
        </NavBarLogo>
        <NavBarInner>
          <NavBarLink to="/registry">Registry</NavBarLink>
          <NavBarLink to="/parameterizer">Parameterizer</NavBarLink>
          <NavBarLink to="/createNewsroom">Create Newsroom</NavBarLink>
          <NavBarDropDownComponent label="How Civil works">
            <NavBarLink href="https://civil.co/constitution/" target="_blank">
              Constitution
            </NavBarLink>
            <NavBarLink href="https://civil.co/about/" target="_blank">
              About
            </NavBarLink>
          </NavBarDropDownComponent>
          <NavBarDrawerComponent />
        </NavBarInner>
      </NavBarOuter>
    );
  }
}
