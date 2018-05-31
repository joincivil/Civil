import { AnyAction } from "redux";
import { governmentActions } from "../actionCreators/government";
import { Map } from "immutable";

export function government(state: Map<string, string> = Map<string, string>(), action: AnyAction): Map<string, string> {
  switch (action.type) {
    case governmentActions.ADD_GOVERNMENT_DATA:
      return state.set(action.data.key, action.data.value);
    default:
      return state;
  }
}
