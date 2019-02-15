import { AnyAction } from "redux";
import { networkActions } from "../actionCreators/network";
import config from "../../helpers/config";

export function network(state: string = config.DEFAULT_ETHEREUM_NETWORK || "3", action: AnyAction): string {
  switch (action.type) {
    case networkActions.SET_NETWORK:
      return action.data;
    default:
      return state;
  }
}

export function networkName(state: string = "", action: AnyAction): string {
  switch (action.type) {
    case networkActions.SET_NETWORK_NAME:
      return action.data;
    default:
      return state;
  }
}
