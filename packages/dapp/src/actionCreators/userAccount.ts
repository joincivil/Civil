import { AnyAction } from "redux";

export enum userActions {
  ADD_USER = "ADD_USER",
}

export const addUser = (user: any): AnyAction => {
  return {
    type: userActions.ADD_USER,
    data: user,
  };
};
