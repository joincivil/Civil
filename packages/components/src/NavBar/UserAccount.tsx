import * as React from "react";

import { buttonSizes } from "../Button";
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

export interface NavUserAccount {
  balance?: string;
  isUserDrawerOpen: boolean;
  userEthAddress?: string;
  votingBalance?: string;
  toggleDrawer(): void;
}

export const NavUserAccount: React.FunctionComponent<NavUserAccount> = props => {
  const { balance, isUserDrawerOpen, toggleDrawer, userEthAddress, votingBalance } = props;
  const userAccountElRef = React.createRef<HTMLDivElement>();
  let child;

  if (props.children) {
    child = React.cloneElement(props.children as React.ReactElement, {
      userAccountElRef,
    });
  }

  return (
    <>
      <StyledVisibleIfLoggedInLink>
        <NavLink to="/dashboard">
          <NavLinkDashboardText />
        </NavLink>
      </StyledVisibleIfLoggedInLink>
      <div ref={userAccountElRef}>
        <NavUser onClick={toggleDrawer}>
          <CvlContainer>
            <CvlToken />
            <BalancesContainer>
              <UserCvlBalance>{balance}</UserCvlBalance>
              <UserCvlVotingBalance>{votingBalance}</UserCvlVotingBalance>
            </BalancesContainer>
            <AvatarContainer>
              <UserAvatar />
              <Arrow isOpen={isUserDrawerOpen} />
            </AvatarContainer>
          </CvlContainer>
        </NavUser>
      </div>

      {child}
    </>
  );
};

export interface NavLoginButton {
  onClick(): Promise<void> | void;
}

export const NavLoginButton: React.FunctionComponent<NavLoginButton> = props => {
  return (
    <LogInButton onClick={props.onClick} size={buttonSizes.SMALL}>
      Connect Wallet
    </LogInButton>
  );
};
