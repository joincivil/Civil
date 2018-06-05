import { Map, Set } from "immutable";
import { AnyAction } from "redux";
import { NewsroomWrapper, EthAddress } from "@joincivil/core";
import { newsroomActions } from "../actionCreators/newsrooms";

export interface NewsroomState {
  address: EthAddress;
  wrapper: NewsroomWrapper;
  newsroom?: any;
  editors?: EthAddress[];
}

export function newsrooms(
  state: Map<string, NewsroomState> = Map<string, NewsroomState>({"": {wrapper: {data: {}}}}),
  action: AnyAction,
): Map<string, NewsroomState> {
  switch (action.type) {
    case newsroomActions.ADD_NEWSROOM:
      return state.set(action.data.address, action.data);
    case newsroomActions.UPDATE_NEWSROOM:
      return state.set(action.data.address, {
        address: action.data.address,
        ...state.get(action.data.address),
        ...action.data,
      });
    case newsroomActions.ADD_EDITOR:
      const newsroom = state.get(action.data.address);
      const editors = newsroom.editors || [];
      return state.set(action.data.address, {
        ...state.get(action.data.address),
        editors: editors.concat([action.data.editor]),
      });
    default:
      return state;
  }
}

export function currentUserNewsrooms(state: Set<string> = Set<string>(), action: AnyAction): Set<string> {
  switch (action.type) {
    case newsroomActions.ADD_USER_NEWSROOM:
      return state.add(action.data);
    default:
      return state;
  }
}
