import { Map } from "immutable";
import { AnyAction } from "redux";
import { TxDataAll } from "@joincivil/typescript-types";
import { challengeActions } from "../actionCreators/challenges";

export function grantAppealTxs(
  state: Map<string, TxDataAll> = Map<string, TxDataAll>(),
  action: AnyAction,
): Map<string, TxDataAll> {
  switch (action.type) {
    case challengeActions.ADD_GRANT_APPEAL_TX:
      return state.set(action.data.listingAddress, action.data.txData);
    default:
      return state;
  }
}

export function grantAppealTxsFetching(
  state: Map<string, boolean> = Map<string, boolean>(),
  action: AnyAction,
): Map<string, boolean> {
  switch (action.type) {
    case challengeActions.FETCH_GRANT_APPEAL_TX:
      return state.set(action.data.listingAddress, true);
    default:
      return state;
  }
}
