import { AnyAction } from "redux";

export enum uiActions {
  ADD_OR_UPDATE_UI_STATE = "ADD_OR_UPDATE_UI_STATE",
}

export const addOrUpdateUIState = (key: string, value: any): AnyAction => {
  return {
    type: uiActions.ADD_OR_UPDATE_UI_STATE,
    key,
    value,
  };
};
