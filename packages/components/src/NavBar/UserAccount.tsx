import * as React from "react";

import { buttonSizes } from "../Button";

import { NavLink } from "./NavLink";
import { NavUserAccountProps as NavUserAccountBaseProps, NavAuthenticationProps } from "./NavBarTypes";
import {
  Arrow,
  AvatarContainer,
  CvlContainer,
  UserAvatar,
  LogInButton,
  NavUser,
  StyledVisibleIfLoggedInLink,
  NavBarButton,
  BorderlessNavBarButton,
  HandleContainer,
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
  const { userEthAddress, enableEthereum, onLoginPressed, onSignupPressed, civilUser } = props;

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
          <NavUser onClick={(ev: any) => props.toggleDrawer()}>
            <CvlContainer>
              <AvatarContainer>
                <UserAvatar />
              </AvatarContainer>
              <HandleContainer>{civilUser.userChannel!.handle}</HandleContainer>
              <Arrow isOpen={props.isUserDrawerOpen} />
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
