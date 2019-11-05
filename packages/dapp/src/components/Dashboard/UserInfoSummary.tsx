import { connect } from "react-redux";
import {
  DashboardUserInfoSummary as DashboardUserInfoSummaryComponent,
  DashboardUserInfoSummaryProps,
} from "@joincivil/components";
import { getFormattedEthAddress, getFormattedTokenBalance, urlConstants as links } from "@joincivil/utils";
import { State } from "../../redux/reducers";

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

  let userAccount = "";
  if (user && user.account.account) {
    userAccount = getFormattedEthAddress(user.account.account);
  }

  return {
    userAccount,
    balance,
    votingBalance,
    buyCvlUrl: "/tokens",
    applyURL: links.APPLY,
  };
};

export default connect(mapStateToProps)(DashboardUserInfoSummaryComponent);
