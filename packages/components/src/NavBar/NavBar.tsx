import * as React from "react";
import { colors } from "../styleConstants";
import { NavLink } from "./NavLink";
import { NavMenu } from "./NavMenu";
import { NavDrawer } from "./NavDrawer";
import { CivilLogo } from "../CivilLogo";
import { CvlToken } from "../icons/CvlToken";
import { buttonSizes } from "../Button";

import { NavProps, NavState } from "./types";
import {
  NavContainer,
  NavOuter,
  NavLogo,
  NavInner,
  NavUser,
  CvlContainer,
  UserCvlBalance,
  UserCvlVotingBalance,
  AvatarContainer,
  UserAvatar,
  Arrow,
  LogInButton,
  BalancesContainer,
} from "./styledComponents";

export class NavBar extends React.Component<NavProps, NavState> {
  constructor(props: NavProps) {
    super(props);

    this.state = { isUserDrawerOpen: false };
  }

  public render(): JSX.Element {
    let accountInfo;
    if (this.props.userAccount) {
      accountInfo = (
        <CvlContainer>
          <CvlToken />
          <BalancesContainer>
            <UserCvlBalance>{this.props.balance}</UserCvlBalance>
            <UserCvlVotingBalance>{this.props.votingBalance}</UserCvlVotingBalance>
          </BalancesContainer>
          <AvatarContainer>
            <UserAvatar />
            <Arrow isOpen={this.state.isUserDrawerOpen} />
          </AvatarContainer>
        </CvlContainer>
      );
    } else {
      accountInfo = (
        <CvlContainer>
          <LogInButton onClick={this.props.onLogin} size={buttonSizes.SMALL}>
            Sign Up | Log In
          </LogInButton>
        </CvlContainer>
      );
    }
    return (
      <NavContainer>
        <NavOuter>
          <NavLogo>
            <NavLink to="/">
              <CivilLogo color={colors.basic.WHITE} />
            </NavLink>
          </NavLogo>

          <NavInner>
            <NavMenu isLoggedIn={!!this.props.userAccount} />

            <NavUser onClick={ev => this.toggle()}>{accountInfo}</NavUser>
          </NavInner>

          {this.props.userAccount &&
            this.state.isUserDrawerOpen && (
              <NavDrawer
                balance={this.props.balance}
                votingBalance={this.props.votingBalance}
                userAccount={this.props.userAccount}
                userRevealVotesCount={this.props.userRevealVotesCount}
                userClaimRewardsCount={this.props.userClaimRewardsCount}
                userChallengesStartedCount={this.props.userChallengesStartedCount}
                userChallengesVotedOnCount={this.props.userChallengesVotedOnCount}
                buyCvlUrl={this.props.buyCvlUrl}
                useGraphQL={this.props.useGraphQL}
                onLoadingPrefToggled={this.props.onLoadingPrefToggled}
                handleOutsideClick={this.hideUserDrawer}
              />
            )}
        </NavOuter>
      </NavContainer>
    );
  }

  private toggle = () => {
    this.setState({ isUserDrawerOpen: !this.state.isUserDrawerOpen });
  };

  private hideUserDrawer = () => {
    this.setState({ isUserDrawerOpen: false });
  };
}
