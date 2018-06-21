import { AnyAction } from "redux";
import { BigNumber } from "bignumber.js";

export enum userActions {
  ADD_USER = "ADD_USER",
}

export const addUser = (account: any, balance: BigNumber, votingBalance: BigNumber): AnyAction => {
  return {
    type: userActions.ADD_USER,
    data: { account, balance, votingBalance },
  };
};
