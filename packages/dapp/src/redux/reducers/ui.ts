import { AnyAction } from "redux";
import { uiActions } from "../actionCreators/ui";
import { Map } from "immutable";
import * as store from "store";

export function ui(state: Map<string, any> = Map<string, any>(), action: AnyAction): Map<string, any> {
  switch (action.type) {
    case uiActions.ADD_OR_UPDATE_UI_STATE:
      return state.set(action.key, action.value);
    default:
      return state;
  }
}

export function useGraphQL(
  state: boolean = store.get("useGraphQL") === undefined ? true : store.get("useGraphQL"),
  action: AnyAction,
): boolean {
  switch (action.type) {
    case uiActions.TOGGLE_USE_GRAPH_QL:
      store.set("useGraphQL", !state);
      return !state;
    case uiActions.DISABLE_GRAPHL_QL:
      store.set("useGraphQL", false);
      return false;
    default:
      return state;
  }
}
