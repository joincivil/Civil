import { Map } from "immutable";
import { AnyAction } from "redux";
import { NewsroomWrapper, EthAddress, CharterData } from "@joincivil/core";
import { newsroomActions, uiActions, userActions, governmentActions } from "./actionCreators";
import { CmsUserData } from "./types";

export interface NewsroomState {
  address: EthAddress;
  wrapper: NewsroomWrapper;
  newsroom?: any;
  editors?: EthAddress[];
  isOwner?: boolean;
  isEditor?: boolean;
  charter?: Partial<CharterData>;
}

export interface StateWithNewsroom {
  newsrooms: Map<string, NewsroomState>;
  newsroomUi: Map<string, any>;
  newsroomUsers: Map<EthAddress, CmsUserData>;
  newsroomGovernment: Map<string, string>;
}

export function newsrooms(
  state: Map<string, NewsroomState> = Map<string, NewsroomState>({
    "": { editors: [], wrapper: { data: {} } },
  }),
  action: AnyAction,
): Map<string, NewsroomState> {
  let newsroom;
  let editors;
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
      editors = newsroom.editors || [];
      return state.set(action.data.address, {
        ...state.get(action.data.address),
        editors: editors.concat([action.data.editor]),
      });
    case newsroomActions.REMOVE_EDITOR:
      newsroom = state.get(action.data.address);
      editors = newsroom.editors || [];
      const index = editors.indexOf(action.data.editor);
      editors.splice(index, 1);
      return state.set(action.data.address, {
        ...state.get(action.data.address),
        editors,
      });
    case newsroomActions.SET_IS_OWNER:
      return state.set(action.data.address, {
        ...state.get(action.data.address),
        isOwner: action.data.isOwner,
      });
    case newsroomActions.SET_IS_EDITOR:
      return state.set(action.data.address, {
        ...state.get(action.data.address),
        isEditor: action.data.isEditor,
      });
    default:
      return state;
  }
}

export function newsroomUi(state: Map<string, any> = Map(), action: AnyAction): Map<string, any> {
  switch (action.type) {
    case uiActions.ADD_GET_CMS_USER_DATA_FOR_ADDRESS:
      return state.set(uiActions.GET_CMS_USER_DATA_FOR_ADDRESS, action.data);
    case uiActions.ADD_PERSIST_CHARTER:
      return state.set(uiActions.PERSIST_CHARTER, action.data);
    default:
      return state;
  }
}

export function newsroomUsers(
  state: Map<EthAddress, CmsUserData> = Map(),
  action: AnyAction,
): Map<EthAddress, CmsUserData> {
  switch (action.type) {
    case userActions.ADD_USER:
      return state.set(action.data.address, action.data.userData);
    default:
      return state;
  }
}

export function newsroomGovernment(state: Map<string, string> = Map(), action: AnyAction): Map<string, string> {
  switch (action.type) {
    case governmentActions.ADD_CONSTITUTION_HASH:
      return state.set("constitutionHash", action.data.hash);
    case governmentActions.ADD_CONSTITUTION_URI:
      return state.set("constitutionUri", action.data.uri);
    default:
      return state;
  }
}
