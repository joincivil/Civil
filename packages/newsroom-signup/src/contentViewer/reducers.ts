import { Map } from "immutable";
import { AnyAction } from "redux";
import { EthContentHeader } from "@joincivil/core";
import { ADD_REVISION, ADD_REVISION_JSON } from "./actions";

export interface ContentViewerReduxState {
  newsroomContent: Map<number, Map<number, RevisionAndJson>>;
}

export interface RevisionAndJson {
  revision: EthContentHeader;
  revisionJson: any;
}

export function newsroomContent(
  state: Map<number, Map<number, RevisionAndJson>> = Map(),
  action: AnyAction,
): Map<number, Map<number, RevisionAndJson>> {
  let newState = state;
  switch (action.type) {
    case ADD_REVISION:
      if (!state.get(action.data.contentId)) {
        newState = state.set(action.data.contentId, Map());
      }
      newState = newState.setIn([action.data.contentId, action.data.revisionId], { revision: action.data });
      return newState;
    case ADD_REVISION_JSON:
      const revision = newState.getIn([action.data.contentId, action.data.revisionId]);
      return newState.setIn([action.data.contentId, action.data.revisionId], {
        ...revision,
        revisionJson: action.data.json,
      });
    default:
      return newState;
  }
}
