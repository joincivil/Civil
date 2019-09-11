import { AnyAction } from "redux";
import { userActions } from "../actionCreators/userAccount";

export function user(state: { account: any } = { account: {} }, action: AnyAction): { account: any } {
  const accountState = state.account;
  switch (action.type) {
    case userActions.ADD_USER:
      return { account: action.data };
    case userActions.UPDATE_VOTING_BALANCE:
      return { account: { ...accountState, votingBalance: action.data.votingBalance } };
    case userActions.UPDATE_TOKEN_BALANCE:
      return { account: { ...accountState, balance: action.data.balance } };
    default:
      return state;
  }
}
