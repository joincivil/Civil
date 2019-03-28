import { Map, Set } from "immutable";
import { AnyAction } from "redux";
import { BigNumber } from "bignumber.js";
import { NewsroomWrapper, EthAddress, CharterData, ListingWrapper } from "@joincivil/core";
import {
  newsroomActions,
  uiActions,
  userActions,
  governmentActions,
  grantActions,
  listingActions,
} from "./actionCreators";
import { CmsUserData } from "./types";

export interface NewsroomState {
  address: EthAddress;
  wrapper: NewsroomWrapper;
  newsroom?: any;
  editors?: Set<EthAddress>;
  isOwner?: boolean;
  isEditor?: boolean;
  charter?: Partial<CharterData>;
  multisigAddress?: EthAddress;
  multisigBalance?: BigNumber;
}

export interface StateWithNewsroom {
  newsrooms: Map<string, NewsroomState>;
  newsroomUi: Map<string, any>;
  newsroomUsers: Map<EthAddress, CmsUserData>;
  newsroomGovernment: Map<string, string>;
  grantApplication: Map<string, boolean>;
  listings: Map<string, ListingWrapper>;
}

export function newsrooms(
  state: Map<string, NewsroomState> = Map<string, NewsroomState>({
    "": { editors: Set(), wrapper: { data: {} } },
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
      editors = newsroom.editors || Set<EthAddress>();
      return state.set(action.data.address, {
        ...state.get(action.data.address),
        editors: editors.add(action.data.editor),
      });
    case newsroomActions.ADD_OWNER:
      newsroom = state.get(action.data.address);
      newsroom.wrapper.data.owners = [...newsroom.wrapper.data.owners, action.data.owner];
      return state.set(action.data.address, newsroom);
    case newsroomActions.REMOVE_EDITOR:
      newsroom = state.get(action.data.address);
      editors = newsroom.editors || Set<EthAddress>();
      return state.set(action.data.address, {
        ...newsroom,
        editors: editors.delete(action.data.editor),
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
    case newsroomActions.SET_MULTISIG_ADDRESS:
      return state.set(action.data.address, {
        ...state.get(action.data.address),
        multisigAddress: action.data.multisigAddress,
      });
    case newsroomActions.SET_MULTISIG_BALANCE:
      return state.set(action.data.address, {
        ...state.get(action.data.address),
        multisigBalance: action.data.multisigBalance,
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
    case userActions.STORE_USER_DATA:
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
    case governmentActions.ADD_CONSTITUTION_CONTENT:
      return state.set("constitutionContent", action.data.content);
    default:
      return state;
  }
}

export function grantApplication(
  state: Map<string, boolean> = Map({ chooseGrant: false, chooseSkip: false }),
  action: AnyAction,
): Map<string, boolean> {
  switch (action.type) {
    case grantActions.SET_GRANT:
      return state.set("chooseGrant", action.data);
    case grantActions.SET_SKIP:
      return state.set("chooseSkip", action.data);
    default:
      return state;
  }
}

export function listings(
  state: Map<string, ListingWrapper> = Map<string, ListingWrapper>(),
  action: AnyAction,
): Map<string, ListingWrapper> {
  switch (action.type) {
    case listingActions.ADD_OR_UPDATE_LISTING:
      const { listingAddress, listing } = action.data;
      return state.set(listingAddress, listing);
    default:
      return state;
  }
}
