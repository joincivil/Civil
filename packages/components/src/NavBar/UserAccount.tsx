import * as React from "react";

import { buttonSizes } from "../Button";
import { LoadUser } from "../Account";
import { CvlToken } from "../icons/CvlToken";

import { NavUserAccountProps as NavUserAccountBaseProps, NavAuthenticationProps } from "./NavBarTypes";
import {
  Arrow,
  AvatarContainer,
  UserAvatar,
  BalancesContainer,
  LogInButton,
  UserCvlBalance,
  UserCvlVotingBalance,
} from "./styledComponents";

export interface NavUserAccountProps extends NavUserAccountBaseProps, NavAuthenticationProps {
  isUserDrawerOpen: boolean;
}

const UserAccount: React.SFC<NavUserAccountProps> = props => {
  const { balance, userEthAddress, votingBalance, enableEthereum } = props;

  return (
    <LoadUser>
      {({ loading, user: civilUser }) => {
        if (loading) {
          return null;
        }

        if (civilUser && userEthAddress) {
          return (
            <>
              <CvlToken />
              <BalancesContainer>
                <UserCvlBalance>{balance}</UserCvlBalance>
                <UserCvlVotingBalance>{votingBalance}</UserCvlVotingBalance>
              </BalancesContainer>
              <AvatarContainer>
                <UserAvatar />
                <Arrow isOpen={props.isUserDrawerOpen} />
              </AvatarContainer>
            </>
          );
        } else if (enableEthereum && !userEthAddress) {
          return (
            <LogInButton onClick={props.enableEthereum} size={buttonSizes.SMALL}>
              Enable Ethereum
            </LogInButton>
          );
        }

        return (
          <LogInButton to={props.authenticationURL} size={buttonSizes.SMALL}>
            Sign Up | Log In
          </LogInButton>
        );
      }}
    </LoadUser>
  );
};

export default UserAccount;
