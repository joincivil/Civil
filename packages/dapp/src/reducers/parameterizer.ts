import { AnyAction } from "redux";
import { parameterizerActions } from "../actionCreators/parameterizer";

export function parameters(state: object = {}, action: AnyAction): object {
  switch (action.type) {
    case parameterizerActions.SET_PARAMETER:
      return { ...state, [action.paramName]: action.paramValue };
    case parameterizerActions.MULTI_SET_PARAMETERS:
      return { ...state, ...action.params };
    default:
      return state;
  }
}
