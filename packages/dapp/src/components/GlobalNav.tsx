import * as React from "react";
import { connect } from "react-redux";
import { State } from "../reducers";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { Set } from "immutable";
import { EthAddress } from "@joincivil/core";
import { getChallengesStartedByUser, getChallengesVotedOnByUser } from "../selectors";
import { NavBar, NavErrorBar } from "@joincivil/components";

export interface NavBarProps {
  balance: string;
  votingBalance: string;
  network: string;
  userAccount: EthAddress;
  currentUserChallengesVotedOn: Set<string>;
  currentUserChallengesStarted: Set<string>;
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
        userChallengesVotedOnCount={props.currentUserChallengesVotedOn.count()}
        userChallengesStartedCount={props.currentUserChallengesStarted.count()}
      />
      {shouldRenderErrorBar && <NavErrorBar />}
    </>
  );
};

const mapStateToProps = (state: State): NavBarProps => {
  const { network } = state;
  const { user } = state.networkDependent;
  const currentUserChallengesVotedOn = getChallengesVotedOnByUser(state);
  const currentUserChallengesStarted = getChallengesStartedByUser(state);

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

  return {
    network,
    balance,
    votingBalance,
    userAccount,
    currentUserChallengesVotedOn,
    currentUserChallengesStarted,
  };
};

export const GlobalNav = connect(mapStateToProps)(GlobalNavComponent);
