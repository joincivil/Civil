import * as React from "react";
import { connect } from "react-redux";
import { BigNumber } from "@joincivil/typescript-types";
import {
  DashboardUserInfoSummary as DashboardUserInfoSummaryComponent,
  DashboardUserInfoSummaryProps,
} from "@joincivil/components";
import { getFormattedEthAddress, getFormattedTokenBalance, urlConstants as links } from "@joincivil/utils";
import { State } from "../../redux/reducers";
import { getUserTotalClaimedRewards, getChallengesWonTotalCvl } from "../../selectors";

const mapStateToProps = (state: State): DashboardUserInfoSummaryProps => {
  const { useGraphQL } = state;
  const { user } = state.networkDependent;

  let rewardsEarned;
  let challengesWonTotalCvl;

  if (!useGraphQL) {
    rewardsEarned = getFormattedTokenBalance(getUserTotalClaimedRewards(state) as BigNumber);
    challengesWonTotalCvl = getFormattedTokenBalance(getChallengesWonTotalCvl(state) as BigNumber);
  }

  let balance = "";
  if (user.account && user.account.balance) {
    balance = getFormattedTokenBalance(user.account.balance);
  }

  let votingBalance = "";
  if (user.account && user.account.votingBalance) {
    votingBalance = getFormattedTokenBalance(user.account.votingBalance);
  }

  let userAccount = "";
  if (user && user.account.account) {
    userAccount = getFormattedEthAddress(user.account.account);
  }

  return {
    userAccount,
    balance,
    votingBalance,
    challengesWonTotalCvl,
    rewardsEarned,
    buyCvlUrl: "/tokens",
    applyURL: links.APPLY,
  };
};

export default connect(mapStateToProps)(DashboardUserInfoSummaryComponent);
