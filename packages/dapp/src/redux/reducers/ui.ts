import { AnyAction } from "redux";
import { uiActions } from "../actionCreators/ui";
import { Map, List } from "immutable";

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
    case uiActions.DISABLE_GRAPHL_QL:
      return false;
    default:
      return state;
  }
}

export function log(state: List<string> = List<string>(), action: AnyAction): List<string> {
  switch (action.type) {
    case uiActions.APPEND_LOG:
      return state.push(action.data);
    default:
      return state;
  }
}
