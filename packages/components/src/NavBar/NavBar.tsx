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
  font-family: ${fonts.SERIF};
  height: 30px;
  justify-content: space-between;
  margin-left: 15px;
  padding-left: 15px
  width: 250px;
`;

const NavContainer = styled.div`
  align-items: center;
  display: flex;
`;

const UserCvlBalance = styled.span`
  display: block;
  font-size: 16px;
  font-weight: 800;
  line-height: 1;
  margin-left: 10px;
`;

const UserCvlVotingBalance = styled.span`
  display: block;
  color: ${colors.accent.CIVIL_TEAL};
  font-size: 12px;
  font-weight: 500;
  margin-left: 10px;
`;

const UserAdvatar = styled.figure`
  background-color: ${colors.accent.CIVIL_TEAL};
  border: 2px solid ${colors.basic.WHITE};
  border-radius: 50%;
  height: 36px;
  margin-right: 8px;
  width: 36px;
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
            <NavLink href="https://civil.co/how-to-launch-newsroom/" target="_blank">
              How to launch a newsroom
            </NavLink>
            <NavLink href="https://civil.co/white-paper/" target="_blank">
              White Paper
            </NavLink>
          </NavDropDownComponent>
          <NavUser>
            <NavContainer>
              <CvlToken />
              <span>
                <UserCvlBalance>{this.props.balance}</UserCvlBalance>
                <UserCvlVotingBalance>{"+" + this.props.votingBalance}</UserCvlVotingBalance>
              </span>
            </NavContainer>
            <NavContainer>
              <UserAdvatar />
              <ExpandDownArrow />
            </NavContainer>
          </NavUser>
        </NavInner>
      </NavOuter>
    );
  }
}
