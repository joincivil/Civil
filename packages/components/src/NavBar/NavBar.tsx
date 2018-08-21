import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";
import { NavLink } from "./NavLink";
import { NavDropDown } from "./NavDropDown";
import { CivilLogo } from "../CivilLogo";
import { CvlToken } from "../icons/CvlToken";
import { ExpandDownArrow } from "../icons/ExpandDownArrow";

const NavOuter = styled.div`
  align-items: center;
  background-color: ${colors.primary.BLACK};
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_1};
  display: flex;
  justify-content: space-between;
  padding: 15px 25px;
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

const NavAccent = styled.span`
  &,
  & a {
    color: ${colors.accent.CIVIL_TEAL};
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

const CvlContainer = styled.div`
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

const AvatarContainer = styled.div`
  align-items: center;
  display: flex;
  width: 60px;
`;

const UserAvatar = styled.figure`
  background-color: ${colors.accent.CIVIL_TEAL};
  border: 2px solid ${colors.basic.WHITE};
  border-radius: 50%;
  height: 36px;
  margin: 0 8px 0 0;
  width: 36px;
`;

export interface NavProps {
  balance: string;
  votingBalance: string;
}

export const NavBar: React.StatelessComponent<NavProps> = props => {
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
        <NavDropDown label="How Civil works">
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
        </NavDropDown>
        <NavAccent>
          <NavLink to="/dashboard">My Activity</NavLink>
        </NavAccent>
        <NavUser>
          <CvlContainer>
            <CvlToken />
            <span>
              <UserCvlBalance>{props.balance}</UserCvlBalance>
              <UserCvlVotingBalance>{"+" + props.votingBalance}</UserCvlVotingBalance>
            </span>
          </CvlContainer>
          <AvatarContainer>
            <UserAvatar />
            <ExpandDownArrow />
          </AvatarContainer>
        </NavUser>
      </NavInner>
    </NavOuter>
  );
};
