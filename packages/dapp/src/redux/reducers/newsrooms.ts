import { Set, Map } from "immutable";
import { AnyAction } from "redux";
import { newsroomActions } from "../actionCreators/newsrooms";
import { EthAddress, StorageHeader, EthContentHeader, ContentData } from "@joincivil/core";

export function currentUserNewsrooms(state: Set<string> = Set<string>(), action: AnyAction): Set<string> {
  switch (action.type) {
    case newsroomActions.ADD_USER_NEWSROOM:
      return state.add(action.data);
    default:
      return state;
  }
}

export function contentFetched(
  state: Map<string, StorageHeader> = Map<string, StorageHeader>(),
  action: AnyAction,
): Map<string, StorageHeader> {
  switch (action.type) {
    case newsroomActions.FETCH_CONTENT:
      const key = action.data.uri;
      return state.set(key, action.data);
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

export function charterRevisions(
  state: Map<EthAddress, Map<number, EthContentHeader>> = Map<EthAddress, Map<number, EthContentHeader>>(),
  action: AnyAction,
): Map<EthAddress, Map<number, EthContentHeader>> {
  switch (action.type) {
    case newsroomActions.ADD_CHARTER_REVISION:
      const { address, revisionId, header } = action.data;
      let newsroomContentRevisions = state.get(address);
      if (!newsroomContentRevisions) {
        newsroomContentRevisions = Map<number, EthContentHeader>();
      }
      if (header.uri) {
        return state.set(address, newsroomContentRevisions.set(revisionId, header));
      }
      return state;
    default:
      return state;
  }
}
