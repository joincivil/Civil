import { AnyAction } from "redux";
import { EthAddress } from "@joincivil/core";

export enum newsroomActions {
  ADD_USER_NEWSROOM = "ADD_USER_NEWSROOM",
}

export const addUserNewsroom = (address: EthAddress): AnyAction => {
  return {
    type: newsroomActions.ADD_USER_NEWSROOM,
    data: address,
  };
};
