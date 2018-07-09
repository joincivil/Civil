import { Dispatch } from "react-redux";
import { getTCR } from "./civilInstance";
import { Subscription } from "rxjs";
import { updateUserTokenBalance, updateUserVotingBalance } from "../actionCreators/userAccount";
import { EthAddress } from "@joincivil/core";

let tokenBalanceSubscriptions: Subscription;
let votingBalanceSubscriptions: Subscription;
export async function initializeTokenSubscriptions(dispatch: Dispatch<any>, user: EthAddress): Promise<void> {
  if (tokenBalanceSubscriptions) {
    tokenBalanceSubscriptions.unsubscribe();
  }
  if (votingBalanceSubscriptions) {
    votingBalanceSubscriptions.unsubscribe();
  }

  const tcr = getTCR();
  const token = await tcr.getToken();
  tokenBalanceSubscriptions = token.balanceUpdate("latest", user).subscribe(balance => {
    dispatch(updateUserTokenBalance(user, balance));
  });

  votingBalanceSubscriptions = tcr
    .getVoting()
    .balanceUpdate("latest", user)
    .subscribe(balance => {
      dispatch(updateUserVotingBalance(user, balance));
    });
}
