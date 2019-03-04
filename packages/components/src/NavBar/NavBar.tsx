import * as React from "react";
import { colors } from "../styleConstants";
import { NavMenu } from "./NavMenu";
import NavDrawer from "./NavDrawer";
import UserAccount from "./UserAccount";
import { CivilLogo } from "../CivilLogo";

import { NavProps, NavState } from "./NavBarTypes";
import { NavContainer, NavOuter, NavLogo, NavInner, NavUser, CvlContainer } from "./styledComponents";

export class NavBar extends React.Component<NavProps, NavState> {
  constructor(props: NavProps) {
    super(props);

    this.state = { isUserDrawerOpen: false };
  }

  public render(): JSX.Element {
    const {
      authenticationURL,
      balance,
      userEthAddress,
      votingBalance,
      userRevealVotesCount,
      userClaimRewardsCount,
      userChallengesStartedCount,
      userChallengesVotedOnCount,
      buyCvlUrl,
      useGraphQL,
      onLoadingPrefToggled,
      enableEthereum,
    } = this.props;
    const { isUserDrawerOpen } = this.state;

    return (
      <NavContainer>
        <NavOuter>
          <NavLogo>
            <a href="https://civil.co">
              <CivilLogo color={colors.basic.WHITE} />
            </a>
          </NavLogo>

          <NavInner>
            <NavMenu isLoggedIn={!!userEthAddress} />

            <NavUser onClick={ev => this.toggle()}>
              <CvlContainer>
                <UserAccount
                  balance={balance}
                  votingBalance={votingBalance}
                  isUserDrawerOpen={isUserDrawerOpen}
                  userEthAddress={userEthAddress}
                  authenticationURL={authenticationURL}
                  enableEthereum={enableEthereum}
                />
              </CvlContainer>
            </NavUser>
          </NavInner>

          {isUserDrawerOpen && (
            <NavDrawer
              balance={balance}
              votingBalance={votingBalance}
              userEthAddress={userEthAddress}
              userRevealVotesCount={userRevealVotesCount}
              userClaimRewardsCount={userClaimRewardsCount}
              userChallengesStartedCount={userChallengesStartedCount}
              userChallengesVotedOnCount={userChallengesVotedOnCount}
              buyCvlUrl={buyCvlUrl}
              useGraphQL={useGraphQL}
              onLoadingPrefToggled={onLoadingPrefToggled}
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
