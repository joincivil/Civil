import { AnyAction } from "redux";
import { governmentActions } from "../actionCreators/government";
import { Map } from "immutable";

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

export function government(state: Map<string, string> = Map<string, string>(), action: AnyAction): Map<string, string> {
  switch (action.type) {
    case governmentActions.ADD_GOVERNMENT_DATA:
      return state.set(action.data.key, action.data.value);
    default:
      return state;
  }
}

export function constitution(
  state: Map<string, string> = Map<string, string>(),
  action: AnyAction,
): Map<string, string> {
  switch (action.type) {
    case governmentActions.SET_CONSTITUTION_DATA:
      return state.set(action.data.key, action.data.value);
    default:
      return state;
  }
}
