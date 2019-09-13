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
    case uiActions.DISABLE_GRAPHL_QL:
      return false;
    default:
      return state;
  }
}

export function web3AuthType(state: string = "", action: AnyAction): string {
  switch (action.type) {
    case uiActions.HIDE_WEB3_AUTH_MODAL:
      return "";
    case uiActions.SET_WEB3_AUTH_TYPE:
      return action.value;
    default:
      return state;
  }
}

export function showWeb3AuthModal(state: boolean = false, action: AnyAction): boolean {
  switch (action.type) {
    case uiActions.SHOW_WEB3_AUTH_MODAL:
      return true;
    case uiActions.HIDE_WEB3_AUTH_MODAL:
      return false;
    default:
      return state;
  }
}
