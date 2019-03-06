import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { State } from "../redux/reducers";
import { getFormattedTokenBalance, getFormattedEthAddress } from "@joincivil/utils";
import { Set } from "immutable";
import { EthAddress } from "@joincivil/core";
import {
  getChallengesStartedByUser,
  getChallengesVotedOnByUser,
  getUserChallengesWithUnrevealedVotes,
  getUserChallengesWithUnclaimedRewards,
} from "../selectors";
import { NavBar, NavProps } from "@joincivil/components";
import { toggleUseGraphQL } from "../redux/actionCreators/ui";

export interface NavBarProps {
  balance: string;
  votingBalance: string;
  network: string;
  userAccount: EthAddress;
  currentUserChallengesStarted: Set<string>;
  currentUserChallengesVotedOn: Set<string>;
  userChallengesWithUnrevealedVotes?: Set<string>;
  userChallengesWithUnclaimedRewards?: Set<string>;
  useGraphQL: boolean;
}

const GlobalNavComponent: React.SFC<NavBarProps & DispatchProp<any>> = props => {
  const {
    balance,
    votingBalance,
    userAccount,
    userChallengesWithUnrevealedVotes,
    userChallengesWithUnclaimedRewards,
    currentUserChallengesStarted,
    currentUserChallengesVotedOn,
    useGraphQL,
  } = props;

  const navBarViewProps: NavProps = {
    balance,
    votingBalance,
    userEthAddress: userAccount && getFormattedEthAddress(userAccount),
    userRevealVotesCount: userChallengesWithUnrevealedVotes!.count(),
    userClaimRewardsCount: userChallengesWithUnclaimedRewards!.count(),
    userChallengesStartedCount: currentUserChallengesStarted.count(),
    userChallengesVotedOnCount: currentUserChallengesVotedOn.count(),
    useGraphQL,
    authenticationURL: "/auth/login",
    buyCvlUrl: "/tokens",
    joinAsMemberUrl: "https://civil.co/become-a-member",
    applyURL: "https://civil.co/how-to-launch-newsroom",
    onLoadingPrefToggled: async (): Promise<any> => {
      props.dispatch!(await toggleUseGraphQL());
    },
  };

  if ((window as any).ethereum) {
    navBarViewProps.enableEthereum = () => {
      (window as any).ethereum.enable();
    };
  }

  return (
    <>
      <NavBar {...navBarViewProps} />
    </>
  );
};

const mapStateToProps = (state: State): NavBarProps => {
  const { network, useGraphQL } = state;
  const { user } = state.networkDependent;
  const currentUserChallengesStarted = getChallengesStartedByUser(state);
  const currentUserChallengesVotedOn = getChallengesVotedOnByUser(state);
  const userChallengesWithUnrevealedVotes = getUserChallengesWithUnrevealedVotes(state);
  const userChallengesWithUnclaimedRewards = getUserChallengesWithUnclaimedRewards(state);
  let balance = "loading...";
  let votingBalance = "";
  let userAccount;

  if (user.account && user.account.account && user.account.account !== "") {
    if (user.account.balance) {
      balance = getFormattedTokenBalance(user.account.balance, true);
    }

    if (user.account.votingBalance) {
      votingBalance = getFormattedTokenBalance(user.account.votingBalance, true);
    }

    userAccount = user.account.account;
  }

  return {
    network,
    balance,
    votingBalance,
    userAccount,
    currentUserChallengesStarted,
    currentUserChallengesVotedOn,
    userChallengesWithUnrevealedVotes,
    userChallengesWithUnclaimedRewards,
    useGraphQL,
  };
};

export const GlobalNav = connect(mapStateToProps)(GlobalNavComponent);
