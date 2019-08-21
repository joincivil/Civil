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
  onLoginPressed(): void;
  onSignupPressed(): void;
  onModalDefocussed(): void;
}

const UserAccount: React.FunctionComponent<NavUserAccountProps> = props => {
  const {
    balance,
    userEthAddress,
    votingBalance,
    enableEthereum,
    joinAsMemberUrl,
    applyURL,
    onLoginPressed,
    onSignupPressed,
    civilUser,
  } = props;

  if (civilUser && userEthAddress) {
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
        </div>

        {child}
      </>
    );
  } else if (civilUser && enableEthereum && !userEthAddress) {
    return (
      <LogInButton onClick={props.enableEthereum} size={buttonSizes.SMALL}>
        Connect Wallet
      </LogInButton>
    );
  }

  let memberBtnProps: any = { href: joinAsMemberUrl };
  if (joinAsMemberUrl.charAt(0) === "/") {
    memberBtnProps = { to: joinAsMemberUrl };
  }
  let applyBtnProps: any = { href: applyURL };
  if (applyURL.charAt(0) === "/") {
    applyBtnProps = { to: applyURL };
  }

  return (
    <>
      <LogInButton onClick={onLoginPressed}>Log In</LogInButton>
      <LogInButton onClick={onSignupPressed}>Sign Up</LogInButton>
    </>
  );
};

export default UserAccount;
