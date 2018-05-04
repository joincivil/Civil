import { AnyAction } from "redux";
import { userActions } from "../actionCreators/userAccount";

export function user(state: { account: any } = { account: {} }, action: AnyAction): { account: any } {
  switch (action.type) {
    case userActions.ADD_USER:
      return { account: action.data };
    default:
      return state;
  }
}
