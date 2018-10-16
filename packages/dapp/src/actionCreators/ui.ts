import { AnyAction } from "redux";

export enum uiActions {
  ADD_OR_UPDATE_UI_STATE = "ADD_OR_UPDATE_UI_STATE",
  SET_LOADING_FINISHED = "SET_LOADING_FINISHED",
  TOGGLE_USE_GRAPH_QL = "TOGGLE_USE_GRAPH_QL",
}

export const addOrUpdateUIState = (key: string, value: any): AnyAction => {
  return {
    type: uiActions.ADD_OR_UPDATE_UI_STATE,
    key,
    value,
  };
};

export const toggleUseGraphQL = (): AnyAction => {
  return {
    type: uiActions.TOGGLE_USE_GRAPH_QL,
  };
};
