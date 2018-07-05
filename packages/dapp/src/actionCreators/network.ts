import { AnyAction } from "redux";
import { Subscription } from "rxjs";

export enum networkActions {
  SET_NETWORK = "SET_NETWORK",
}

const internalSetNetwork = (network: string): AnyAction => {
  return {
    type: networkActions.SET_NETWORK,
    data: network,
  };
};

export const setNetwork = (network: string): any => {
  return (dispatch: any, getState: any): AnyAction => {
    const { listingHistorySubscriptions } = getState().networkDependent;
    listingHistorySubscriptions.forEach((subscription: Subscription, key: string) => {
      subscription.unsubscribe();
    });

    return dispatch(internalSetNetwork(network));
  };
};
