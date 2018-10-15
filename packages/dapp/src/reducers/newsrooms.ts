import { Set, Map } from "immutable";
import { AnyAction } from "redux";
import { newsroomActions } from "../actionCreators/newsrooms";
import { EthContentHeader, ContentData } from "@joincivil/core";

export function currentUserNewsrooms(state: Set<string> = Set<string>(), action: AnyAction): Set<string> {
  switch (action.type) {
    case newsroomActions.ADD_USER_NEWSROOM:
      return state.add(action.data);
    default:
      return state;
  }
}

export function content(
  state: Map<EthContentHeader, ContentData> = Map<EthContentHeader, ContentData>(),
  action: AnyAction,
): Map<EthContentHeader, ContentData> {
  switch (action.type) {
    case newsroomActions.ADD_CONTENT:
      console.log("content acquired");
      return state.set(action.data.header, action.data.content);
    default:
      return state;
  }
}
