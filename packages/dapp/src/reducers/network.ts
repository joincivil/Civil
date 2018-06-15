import { AnyAction } from "redux";
import { networkActions } from "../actionCreators/network";

export function network(state: string = "0", action: AnyAction): string {
  switch (action.type) {
    case networkActions.SET_NETWORK:
      return action.data;
    default:
      return state;
  }
}
