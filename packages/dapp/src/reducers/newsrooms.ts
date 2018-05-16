import { Map } from "immutable";
import { AnyAction } from "redux";
import {
  NewsroomWrapper,
} from "@joincivil/core";
import { newsroomActions } from "../actionCreators/newsrooms";

export function newsrooms(
  state: Map<string, NewsroomWrapper> = Map<string, NewsroomWrapper>(),
  action: AnyAction,
): Map<string, NewsroomWrapper> {
  switch (action.type) {
    case newsroomActions.ADD_NEWSROOM:
      return state.set(action.data.address, action.data);
    default:
      return state;
  }
}
