import { AnyAction } from "redux";
import { uiActions } from "../actionCreators/ui";
import { Map } from "immutable";

export function ui(state: Map<string, any> = Map<string, any>(), action: AnyAction): Map<string, any> {
  switch (action.type) {
    case uiActions.ADD_OR_UPDATE_UI_STATE:
      return state.set(action.key, action.value);
    default:
      return state;
  }
}
