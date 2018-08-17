import { getFormattedTokenBalance } from "@joincivil/utils";
import * as React from "react";
import { connect } from "react-redux";
import { State } from "../reducers";
import { NavBar, NavErrorBar } from "@joincivil/components";

export interface NavBarProps {
  balance: string;
  votingBalance: string;
  network: string;
}

const GlobalNavComponent: React.SFC<NavBarProps> = props => {
  const shouldRenderErrorBar = props.network !== "4";
  return (
    <>
      <NavBar balance={props.balance} votingBalance={props.votingBalance} />
      {shouldRenderErrorBar && <NavErrorBar />}
    </>
  );
};
const mapStateToProps = (state: State): NavBarProps => {
  const { networkDependent, network } = state;

  let balance = "loading...";
  if (networkDependent.user.account && networkDependent.user.account.balance) {
    balance = getFormattedTokenBalance(networkDependent.user.account.balance);
  }

  let votingBalance = "";
  if (networkDependent.user.account && networkDependent.user.account.votingBalance) {
    votingBalance = getFormattedTokenBalance(networkDependent.user.account.votingBalance);
  }

  return { balance, votingBalance, network };
};

export const GlobalNav = connect(mapStateToProps)(GlobalNavComponent);
