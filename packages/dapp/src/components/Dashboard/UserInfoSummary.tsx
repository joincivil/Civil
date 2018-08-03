import * as React from "react";
import { connect } from "react-redux";
import {
  DashboardUserInfoSummary as DashboardUserInfoSummaryComponent,
  DashboardUserInfoSummaryProps,
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { State } from "../../reducers";

const mapStateToProps = (state: State): DashboardUserInfoSummaryProps => {
  const { user } = state.networkDependent;

  let balance = "";
  if (user.account && user.account.balance) {
    balance = getFormattedTokenBalance(user.account.balance);
  }

  let votingBalance = "";
  if (user.account && user.account.votingBalance) {
    votingBalance = getFormattedTokenBalance(user.account.votingBalance);
  }

  return {
    userAccount: user.account.account,
    balance,
    votingBalance,
    rewardsEarned: "0.00 CVL",
    buyCVLURL: "https://civil.co/cvl/",
  };
};

export default connect(mapStateToProps)(DashboardUserInfoSummaryComponent);
