import { Map } from "immutable";
import { AnyAction } from "redux";
import { NewsroomWrapper, EthAddress } from "@joincivil/core";
import { newsroomActions, uiActions, userActions } from "./actionCreators";

export interface NewsroomState {
  address: EthAddress;
  wrapper: NewsroomWrapper;
  newsroom?: any;
  editors?: EthAddress[];
}

export interface StateWithNewsroom {
  newsrooms: Map<string, NewsroomState>;
  newsroomUi: Map<string, any>;
  newsroomUsers: Map<EthAddress, string>;
}

export function newsrooms(
  state: Map<string, NewsroomState> = Map<string, NewsroomState>({ "": { editors: [], wrapper: { data: {} } } }),
  action: AnyAction,
): Map<string, NewsroomState> {
  let newsroom;
  switch (action.type) {
    case newsroomActions.ADD_NEWSROOM:
      return state.set(action.data.address, action.data);
    case newsroomActions.UPDATE_NEWSROOM:
      return state.set(action.data.address, {
        address: action.data.address,
        ...state.get(action.data.address),
        ...action.data,
      });
    case newsroomActions.CHANGE_NAME:
      newsroom = state.get(action.data.address);
      newsroom.wrapper.data.name = action.data.name;
      return state.set(action.data.address, newsroom);
    case newsroomActions.ADD_EDITOR:
      newsroom = state.get(action.data.address);
      const editors = newsroom.editors || [];
      return state.set(action.data.address, {
        ...state.get(action.data.address),
        editors: editors.concat([action.data.editor]),
      });
    default:
      return state;
  }
}

export function newsroomUi(state: Map<string, any> = Map(), action: AnyAction): Map<string, any> {
  switch (action.type) {
    case uiActions.ADD_GET_NAME_FOR_ADDRESS:
      return state.set(uiActions.GET_NAME_FOR_ADDRESS, action.data);
    default:
      return state;
  }
}

export function newsroomUsers(state: Map<EthAddress, string> = Map(), action: AnyAction): Map<EthAddress, string> {
  switch (action.type) {
    case userActions.ADD_USER:
      return state.set(action.data.address, action.data.name);
    default:
      return state;
  }
}
