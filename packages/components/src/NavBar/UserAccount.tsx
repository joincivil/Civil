import * as React from "react";

import { buttonSizes } from "../Button";
import { LoadUser } from "../Account";
import { CvlToken } from "../icons/CvlToken";

import { NavLink } from "./NavLink";
import { NavUserAccountProps as NavUserAccountBaseProps, NavAuthenticationProps } from "./NavBarTypes";
import {
  Arrow,
  AvatarContainer,
  CvlContainer,
  UserAvatar,
  BalancesContainer,
  LogInButton,
  NavBarButton,
  NavUser,
  StyledVisibleIfLoggedInLink,
  UserCvlBalance,
  UserCvlVotingBalance,
} from "./styledComponents";
import { NavLinkDashboardText } from "./textComponents";

export interface NavUserAccountProps extends NavUserAccountBaseProps, NavAuthenticationProps {
  isUserDrawerOpen: boolean;
  toggleDrawer(): void;
}

const UserAccount: React.SFC<NavUserAccountProps> = props => {
  const { balance, userEthAddress, votingBalance, enableEthereum, buyCvlUrl, applyURL } = props;

  return (
    <LoadUser>
      {({ loading, user: civilUser }) => {
        if (loading) {
          return null;
        }

        if (civilUser && userEthAddress) {
          return (
            <>
              <StyledVisibleIfLoggedInLink>
                <NavLink to="/dashboard">
                  <NavLinkDashboardText />
                </NavLink>
              </StyledVisibleIfLoggedInLink>
              <NavUser onClick={ev => props.toggleDrawer()}>
                <CvlContainer>
                  <CvlToken />
                  <BalancesContainer>
                    <UserCvlBalance>{balance}</UserCvlBalance>
                    <UserCvlVotingBalance>{votingBalance}</UserCvlVotingBalance>
                  </BalancesContainer>
                  <AvatarContainer>
                    <UserAvatar />
                    <Arrow isOpen={props.isUserDrawerOpen} />
                  </AvatarContainer>
                </CvlContainer>
              </NavUser>
            </>
          );
        } else if (civilUser && enableEthereum && !userEthAddress) {
          return (
            <LogInButton onClick={props.enableEthereum} size={buttonSizes.SMALL}>
              Enable Ethereum
            </LogInButton>
          );
        }

        let buyBtnProps: any = { href: buyCvlUrl };
        if (buyCvlUrl.charAt(0) === "/") {
          buyBtnProps = { to: buyCvlUrl };
        }
        let applyBtnProps: any = { href: applyURL };
        if (applyURL.charAt(0) === "/") {
          applyBtnProps = { to: applyURL };
        }

        return (
          <>
            <NavLink to={props.authenticationURL}>Log In</NavLink>

            <NavBarButton size={buttonSizes.SMALL} {...buyBtnProps}>
              Join as a member
            </NavBarButton>

            <NavBarButton size={buttonSizes.SMALL} {...applyBtnProps}>
              Join as a newsroom
            </NavBarButton>
          </>
        );
      }}
    </LoadUser>
  );
};

export default UserAccount;
