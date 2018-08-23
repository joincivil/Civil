import { getFormattedTokenBalance } from "@joincivil/utils";
import * as React from "react";
import { connect } from "react-redux";
import { State } from "../reducers";
import { NavBar, NavErrorBar } from "@joincivil/components";

export interface NavBarProps {
  balance: string;
  votingBalance: string;
  network: string;
  userAccount: string;
}

const GlobalNavComponent: React.SFC<NavBarProps> = props => {
  const shouldRenderErrorBar = props.network !== "4";
  return (
    <>
      <NavBar
        balance={props.balance}
        votingBalance={props.votingBalance}
        userAccount={props.userAccount}
        buyCvlUrl="https://civil.co/cvl/"
      />
      {shouldRenderErrorBar && <NavErrorBar />}
    </>
  );
};
const mapStateToProps = (state: State): NavBarProps => {
  const { network } = state;
  const { user } = state.networkDependent;

  let balance = "loading...";
  if (user.account && user.account.balance) {
    balance = getFormattedTokenBalance(user.account.balance);
  }

  let votingBalance = "";
  if (user.account && user.account.votingBalance) {
    votingBalance = getFormattedTokenBalance(user.account.votingBalance);
  }

  let userAccount = "";
  if (user.account && user.account.account) {
    userAccount = user.account.account;
  }

  return { network, balance, votingBalance, userAccount };
};

export const GlobalNav = connect(mapStateToProps)(GlobalNavComponent);
