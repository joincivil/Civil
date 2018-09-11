import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";
import { NavLink } from "./NavLink";
import { NavDropDown } from "./NavDropDown";
import { NavDrawerComponent } from "./NavDrawer";
import { CivilLogo } from "../CivilLogo";
import { CvlToken } from "../icons/CvlToken";
import {
  NavLinkRegistryText,
  NavLinkParameterizerText,
  NavLinkCreateNewsroomText,
  NavLinkConstitutionText,
  NavLinkAboutText,
  NavLinkLaunchNewsroomText,
  NavLinkWhitePaperText,
  NavLinkDashboardText,
} from "./textComponents";

export interface NavProps {
  balance: string;
  votingBalance: string;
  userAccount?: string;
  userChallengesVotedOnCount?: string;
  userChallengesStartedCount?: string;
  buyCvlUrl?: string;
}

export interface NavState {
  isOpen: boolean;
}

export interface NavArrowProps {
  isOpen?: boolean;
}

const NavOuter = styled.div`
  align-items: center;
  background-color: ${colors.primary.BLACK};
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_1};
  display: flex;
  justify-content: space-between;
  padding: 15px 25px;
  position: relative;
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
  margin: 0 15px;
  &,
  & a {
    color: ${colors.accent.CIVIL_TEAL};
  }
`;

const NavUser = styled.div`
  align-items: center;
  border-left: 1px solid ${colors.accent.CIVIL_GRAY_1};
  cursor: pointer;
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

const Arrow: StyledComponentClass<NavArrowProps, "div"> = styled<NavArrowProps, "div">("div")`
  border-bottom: 2px solid ${colors.basic.WHITE};
  border-left: 2px solid ${colors.basic.WHITE};
  height: 8px;
  transform: ${props => (props.isOpen ? "rotate(135deg)" : "rotate(-45deg)")};
  transition: transform 0.25s;
  width: 8px;
`;

export class NavBar extends React.Component<NavProps, NavState> {
  constructor(props: NavProps) {
    super(props);

    this.state = { isOpen: false };
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
          <NavLink to="/registry">
            <NavLinkRegistryText />
          </NavLink>
          <NavLink to="/parameterizer">
            <NavLinkParameterizerText />
          </NavLink>
          <NavLink to="/createNewsroom">
            <NavLinkCreateNewsroomText />
          </NavLink>
          <NavDropDown label="How Civil works">
            <NavLink href="https://civil.co/constitution/" target="_blank">
              <NavLinkConstitutionText />
            </NavLink>
            <NavLink href="https://civil.co/about/" target="_blank">
              <NavLinkAboutText />
            </NavLink>
            <NavLink href="https://civil.co/how-to-launch-newsroom/" target="_blank">
              <NavLinkLaunchNewsroomText />
            </NavLink>
            <NavLink href="https://civil.co/white-paper/" target="_blank">
              <NavLinkWhitePaperText />
            </NavLink>
          </NavDropDown>
          <NavAccent>
            <NavLink to="/dashboard">
              <NavLinkDashboardText />
            </NavLink>
          </NavAccent>
          <NavUser onClick={ev => this.toggle()}>
            <CvlContainer>
              <CvlToken />
              <span>
                <UserCvlBalance>{this.props.balance}</UserCvlBalance>
                <UserCvlVotingBalance>{this.props.votingBalance}</UserCvlVotingBalance>
              </span>
            </CvlContainer>
            <AvatarContainer>
              <UserAvatar />
              <Arrow isOpen={this.state.isOpen} />
            </AvatarContainer>
          </NavUser>
        </NavInner>
        {this.state.isOpen ? (
          <NavDrawerComponent
            balance={this.props.balance}
            votingBalance={this.props.votingBalance}
            userAccount={this.props.userAccount}
            userChallengesVotedOnCount={this.props.userChallengesVotedOnCount}
            userChallengesStartedCount={this.props.userChallengesStartedCount}
            buyCvlUrl={this.props.buyCvlUrl}
          />
        ) : null}
      </NavOuter>
    );
  }

  private toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };
}
