import { AnyAction } from "redux";
import { BigNumber } from "bignumber.js";

export enum userActions {
  ADD_USER = "ADD_USER",
  UPDATE_VOTING_BALANCE = "UPDATE_VOTING_BALANCE",
  UPDATE_TOKEN_BALANCE = "UPDATE_TOKEN_BALANCE",
}

export const addUser = (account: any, balance: BigNumber, votingBalance: BigNumber): AnyAction => {
  return {
    type: userActions.ADD_USER,
    data: { account, balance, votingBalance },
  };
};

export const updateUserTokenBalance = (account: any, balance: BigNumber): AnyAction => {
  return {
    type: userActions.UPDATE_TOKEN_BALANCE,
    data: { account, balance },
  };
};

export const updateUserVotingBalance = (account: any, votingBalance: BigNumber): AnyAction => {
  return {
    type: userActions.UPDATE_VOTING_BALANCE,
    data: { account, votingBalance },
  };
};
