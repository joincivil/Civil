import { AuthenticatedUserContainer } from "@joincivil/civil-session";
import { EthAddress } from "@joincivil/core";
import { buttonSizes, NavBarButton, NavLink, NavLogInButton, NavUserAccount } from "@joincivil/components";
import * as React from "react";

interface UserAccountProps {
  applyURL: string;
  authenticationURL: string;
  balance?: string;
  isUserDrawerOpen: boolean;
  joinAsMemberUrl: string;
  userEthAddress?: EthAddress;
  votingBalance?: string;
  toggleDrawer(): void;
  enableEthereum?(): void;
}

const UserAccount: React.FunctionComponent<UserAccountProps> = props => {
  const {
    applyURL,
    authenticationURL,
    balance,
    children,
    enableEthereum,
    isUserDrawerOpen,
    joinAsMemberUrl,
    toggleDrawer,
    userEthAddress,
    votingBalance,
  } = props;

  return (
    <AuthenticatedUserContainer>
      {({ loading, user: civilUser }) => {
        if (loading) {
          return null;
        }

        if (civilUser && userEthAddress) {
          const userAccountElRef = React.createRef<HTMLDivElement>();
          let child;

          if (props.children) {
            child = React.cloneElement(children as React.ReactElement, {
              userAccountElRef,
            });
          }

          return (
            <NavUserAccount
              balance={balance}
              votingBalance={votingBalance}
              isUserDrawerOpen={isUserDrawerOpen}
              toggleDrawer={toggleDrawer}
            >
              {isUserDrawerOpen && child}
            </NavUserAccount>
          );
        } else if (civilUser && enableEthereum && !userEthAddress) {
          return (
            <NavLogInButton onClick={enableEthereum} size={buttonSizes.SMALL}>
              Connect Wallet
            </NavLogInButton>
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
            <NavLink to={authenticationURL}>Log In</NavLink>

            <NavBarButton size={buttonSizes.SMALL} {...memberBtnProps}>
              Join as a member
            </NavBarButton>

            <NavBarButton size={buttonSizes.SMALL} {...applyBtnProps}>
              Join as a newsroom
            </NavBarButton>
          </>
        );
      }}
    </AuthenticatedUserContainer>
  );
};

export default UserAccount;
