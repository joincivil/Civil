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
  NavUser,
  StyledVisibleIfLoggedInLink,
  UserCvlBalance,
  UserCvlVotingBalance,
  NavBarButton,
  BorderlessNavBarButton,
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
  const { balance, userEthAddress, votingBalance, enableEthereum, onLoginPressed, onSignupPressed, civilUser } = props;

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
            <NavLinkDashboardText />({civilUser.userChannel!.handle})
          </NavLink>
        </StyledVisibleIfLoggedInLink>
        <div ref={userAccountElRef}>
          <NavUser onClick={(ev: any) => props.toggleDrawer()}>
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

  return (
    <>
      <BorderlessNavBarButton onClick={onLoginPressed}>Log In</BorderlessNavBarButton>
      <NavBarButton onClick={onSignupPressed}>Sign Up</NavBarButton>
    </>
  );
};

export default UserAccount;
