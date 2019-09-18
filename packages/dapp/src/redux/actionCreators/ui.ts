import { AnyAction } from "redux";
import { Dispatch } from "react-redux";

import { clearAllListingData } from "./listings";
import { clearAllChallengesData } from "./challenges";
import { isGraphQLSupportedOnNetwork } from "../../helpers/civilInstance";

export enum uiActions {
  ADD_OR_UPDATE_UI_STATE = "ADD_OR_UPDATE_UI_STATE",
  SET_LOADING_FINISHED = "SET_LOADING_FINISHED",
  TOGGLE_USE_GRAPH_QL = "TOGGLE_USE_GRAPH_QL",
  DISABLE_GRAPHL_QL = "DISABLE_GRAPH_QL",
  TRIED_TO_ENABLE_GRAPH_QL_ON_UNSUPPORTED_NETWORK = "TRIED_TO_ENABLE_GRAPH_QL_ON_UNSUPPORTED_NETWORK",
  SHOW_WEB3_AUTH_MODAL = "SHOW_WEB3_AUTH_MODAL",
  SET_WEB3_AUTH_TYPE = "SET_WEB3_AUTH_TYPE",
  HIDE_WEB3_AUTH_MODAL = "HIDE_WEB3_AUTH_MODAL",
}

export const addOrUpdateUIState = (key: string, value: any): AnyAction => {
  return {
    type: uiActions.ADD_OR_UPDATE_UI_STATE,
    key,
    value,
  };
};

// authType can be "login" or "signup"
const setWeb3AuthType = (value: string): AnyAction => {
  return {
    type: uiActions.SET_WEB3_AUTH_TYPE,
    value,
  };
};

const showWeb3AuthModal = (): AnyAction => {
  return {
    type: uiActions.SHOW_WEB3_AUTH_MODAL,
  };
};

export const hideWeb3AuthModal = (): AnyAction => {
  return {
    type: uiActions.HIDE_WEB3_AUTH_MODAL,
  };
};

export const showWeb3LoginModal = async (): Promise<any> => {
  return async (dispatch: Dispatch<any>, getState: any): Promise<AnyAction> => {
    dispatch(setWeb3AuthType("login"));
    return dispatch(showWeb3AuthModal());
  };
};

export const showWeb3SignupModal = async (): Promise<any> => {
  return async (dispatch: Dispatch<any>, getState: any): Promise<AnyAction> => {
    dispatch(setWeb3AuthType("signup"));
    return dispatch(showWeb3AuthModal());
  };
};
