import { AnyAction } from "redux";
import { NewsroomWrapper, EthAddress } from "@joincivil/core";

export enum newsroomActions {
  ADD_NEWSROOM = "ADD_NEWSROOM",
  ADD_USER_NEWSROOM = "ADD_USER_NEWSROOM"
}

export const addUserNewsroom = (address: EthAddress): AnyAction => {
  return {
    type: newsroomActions.ADD_USER_NEWSROOM,
    data: address
  }
};

export const addNewsroom = (newsroom: NewsroomWrapper): AnyAction => {
  return {
    type: newsroomActions.ADD_NEWSROOM,
    data: newsroom,
  };
};
