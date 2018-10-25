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

export function contentFetched(
  state: Set<EthContentHeader> = Set<EthContentHeader>(),
  action: AnyAction,
): Set<EthContentHeader> {
  switch (action.type) {
    case newsroomActions.FETCH_CONTENT:
      return state.add(action.data);
    default:
      return state;
  }
}

export function content(
  state: Map<string, ContentData> = Map<string, ContentData>(),
  action: AnyAction,
): Map<string, ContentData> {
  switch (action.type) {
    case newsroomActions.ADD_CONTENT:
      return state.set(action.data.header.uri, action.data.content);
    default:
      return state;
  }
}
