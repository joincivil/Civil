import { Map } from "immutable";
import { AnyAction } from "redux";
import { NewsroomWrapper, EthAddress } from "@joincivil/core";
import { newsroomActions } from "./actionCreators";

export interface NewsroomState {
  address: EthAddress;
  wrapper: NewsroomWrapper;
  newsroom?: any;
  editors?: EthAddress[];
}

export interface StateWithNewsroom {
  newsrooms: Map<string, NewsroomState>
}

export function newsrooms(
  state: Map<string, NewsroomState> = Map<string, NewsroomState>({ "": { editors: [], wrapper: { data: {} } } }),
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
