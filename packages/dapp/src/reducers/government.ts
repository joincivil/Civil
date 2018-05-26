import { AnyAction } from "redux";
import { governmentActions } from "../actionCreators/government";

export function govtParameters(state: object = {}, action: AnyAction): object {
  switch (action.type) {
    case governmentActions.SET_GOVT_PARAMETER:
      return { ...state, [action.paramName]: action.paramValue };
    case governmentActions.MULTI_SET_GOVT_PARAMETERS:
      return { ...state, ...action.params };
    default:
      return state;
  }
}
