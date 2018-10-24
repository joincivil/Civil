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

export function useGraphQL(state: boolean = true, action: AnyAction): boolean {
  switch (action.type) {
    case uiActions.TOGGLE_USE_GRAPH_QL:
      return !state;
    default:
      return state;
  }
}
