import { AnyAction } from "redux";
import { Dispatch } from "react-redux";
import { clearListingSubscriptions, initializeSubscriptions } from "../../helpers/listingEvents";
import { clearAllListingData } from "./listings";

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

export const initialize = async (): Promise<any> => {
  return async (dispatch: Dispatch<any>, getState: any): Promise<undefined> => {
    const { useGraphQL } = getState();
    if (!useGraphQL) {
      await initializeSubscriptions(dispatch);
    }
    return undefined;
  };
};

export const toggleUseGraphQL = async (): Promise<any> => {
  return async (dispatch: Dispatch<any>, getState: any): Promise<AnyAction> => {
    const { useGraphQL } = getState();

    if (!useGraphQL) {
      // going to graphQL loading
      clearListingSubscriptions();
      dispatch(clearAllListingData());
    } else {
      // going to web3 loading
      await initializeSubscriptions(dispatch);
    }
    return dispatch(toggleUseGraphQLSimple());
  };
};

export const toggleUseGraphQLSimple = (): any => {
  return {
    type: uiActions.TOGGLE_USE_GRAPH_QL,
  };
};
