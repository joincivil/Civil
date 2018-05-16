import { AnyAction } from "redux";
import { NewsroomWrapper } from "@joincivil/core";

export enum newsroomActions {
  ADD_NEWSROOM = "ADD_NEWSROOM",
}

export const addNewsroom = (newsroom: NewsroomWrapper): AnyAction => {
  return {
    type: newsroomActions.ADD_NEWSROOM,
    data: newsroom,
  };
};
