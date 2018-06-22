import { AnyAction } from "redux";

export enum networkActions {
  SET_NETWORK = "SET_NETWORK",
}

export const setNetwork = (network: string): AnyAction => {
  return {
    type: networkActions.SET_NETWORK,
    data: network,
  };
};
