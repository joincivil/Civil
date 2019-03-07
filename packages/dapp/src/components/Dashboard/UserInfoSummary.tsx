import * as React from "react";
import { connect } from "react-redux";
import BigNumber from "bignumber.js";
import {
  DashboardUserInfoSummary as DashboardUserInfoSummaryComponent,
  DashboardUserInfoSummaryProps,
} from "@joincivil/components";
import { getFormattedEthAddress, getFormattedTokenBalance } from "@joincivil/utils";
import { links } from "../../constants";
import { State } from "../../redux/reducers";
import { getUserTotalClaimedRewards, getChallengesWonTotalCvl } from "../../selectors";

const mapStateToProps = (state: State): DashboardUserInfoSummaryProps => {
  const { user } = state.networkDependent;
  const userTotalClaimedRewards = getUserTotalClaimedRewards(state) as BigNumber;
  const challengesWonTotalCvl = getChallengesWonTotalCvl(state) as BigNumber;

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
    challengesWonTotalCvl: getFormattedTokenBalance(challengesWonTotalCvl),
    rewardsEarned: getFormattedTokenBalance(userTotalClaimedRewards),
    buyCvlUrl: "/tokens",
    applyURL: links.APPLY,
  };
};

export default connect(mapStateToProps)(DashboardUserInfoSummaryComponent);
