import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";
import { CivilLogo } from "../CivilLogo";
import { NavLink } from "./NavLink";
import { CvlToken } from "../icons/CvlToken";
import { NavDropDownComponent } from "./NavDropDown";
import { ExpandDownArrow } from "../icons/ExpandDownArrow";

const NavOuter = styled.div`
  align-items: center;
  background-color: ${colors.primary.BLACK};
  display: flex;
  justify-content: space-between;
  padding: 15px 30px;
  * {
    box-sizing: border-box;
  }
`;

const NavLogo = styled.div`
  height: 21px;
  width: 72px;
`;

const NavInner = styled.div`
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

const NavUser = styled.div`
  align-items: center;
  border-left: 1px solid ${colors.accent.CIVIL_GRAY_1};
  display: flex;
  height: 30px;
  justify-content: space-between;
  margin-left: 15px;
  padding-left: 15px
  width: 250px;
`;

const UserAdvatar = styled.img`
  border: 2px solid ${colors.basic.WHITE};
  border-radius: 50%;
`;

export interface NavProps {
  balance: string;
  votingBalance: string;
}

export class NavBar extends React.Component<NavProps> {
  constructor(props: NavProps) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <NavOuter>
        <NavLogo>
          <NavLink to="/">
            <CivilLogo color={colors.basic.WHITE} />
          </NavLink>
        </NavLogo>
        <NavInner>
          <NavLink to="/registry">Registry</NavLink>
          <NavLink to="/parameterizer">Parameterizer</NavLink>
          <NavLink to="/createNewsroom">Create Newsroom</NavLink>
          <NavDropDownComponent label="How Civil works">
            <NavLink href="https://civil.co/constitution/" target="_blank">
              Constitution
            </NavLink>
            <NavLink href="https://civil.co/about/" target="_blank">
              About
            </NavLink>
          </NavDropDownComponent>
          <NavUser>
            <div>
              <CvlToken />
              <span>{this.props.balance}</span>
              <span>{" + " + this.props.votingBalance}</span>
            </div>

            <UserAdvatar src="http://placehold.it/36" />
            <ExpandDownArrow />
          </NavUser>
        </NavInner>
      </NavOuter>
    );
  }
}
