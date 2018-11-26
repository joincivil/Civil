import { AnyAction } from "redux";
import { findIndex } from "lodash";
import { EthAddress, Civil, CharterData, RosterMember } from "@joincivil/core";
import { NewsroomState, StateWithNewsroom } from "./reducers";
import { CmsUserData } from "./types";
import { makeUserObject } from "./utils";

export enum newsroomActions {
  ADD_NEWSROOM = "ADD_NEWSROOM",
  UPDATE_NEWSROOM = "UPDATE_NEWSROOM",
  CHANGE_NAME = "CHANGE_NAME",
  ADD_EDITOR = "ADD_EDITOR",
  REMOVE_EDITOR = "REMOVE_EDITOR",
  SET_IS_OWNER = "SET_IS_OWNER",
  SET_IS_EDITOR = "SET_IS_EDITOR",
}

export enum uiActions {
  ADD_GET_CMS_USER_DATA_FOR_ADDRESS = "ADD_GET_CMS_USER_DATA_FOR_ADDRESS",
  GET_CMS_USER_DATA_FOR_ADDRESS = "GET_CMS_USER_DATA_FOR_ADDRESS",
  ADD_PERSIST_CHARTER = "ADD_PERSIST_CHARTER",
  PERSIST_CHARTER = "PERSIST_CHARTER",
}

export enum userActions {
  STORE_USER_DATA = "STORE_USER_DATA",
}

export enum governmentActions {
  ADD_CONSTITUTION_URI = "ADD_CONSTITUTION_URI",
  ADD_CONSTITUTION_HASH = "ADD_CONSTITUTION_HASH",
}

export const getEditors = (address: EthAddress, civil: Civil): any => async (
  dispatch: any,
  getState: any,
): Promise<void> => {
  const newsroom = await civil.newsroomAtUntrusted(address);
  newsroom.editors().forEach(val => {
    dispatch(initContractMember(address, val));
    dispatch(addEditor(address, val));
  });
};

export const getNewsroom = (address: EthAddress, civil: Civil): any => async (
  dispatch: any,
  getState: any,
): Promise<AnyAction> => {
  const newsroom = await civil.newsroomAtUntrusted(address);
  const wrapper = await newsroom.getNewsroomWrapper();
  wrapper.data.owners.forEach((userAddress: EthAddress) => {
    dispatch(initContractMember(address, userAddress));
  });
  return dispatch(updateNewsroom(address, { wrapper, newsroom }));
};

export const getIsOwner = (address: EthAddress, civil: Civil): any => async (
  dispatch: any,
  getState: any,
): Promise<AnyAction> => {
  const newsroom = await civil.newsroomAtUntrusted(address);
  return dispatch(setIsOwner(address, await newsroom.isOwner()));
};

export const getIsEditor = (address: EthAddress, civil: Civil): any => async (
  dispatch: any,
  getState: any,
): Promise<AnyAction> => {
  const newsroom = await civil.newsroomAtUntrusted(address);
  return dispatch(setIsEditor(address, await newsroom.isEditor()));
};

export const addNewsroom = (newsroom: NewsroomState): AnyAction => {
  return {
    type: newsroomActions.ADD_NEWSROOM,
    data: newsroom,
  };
};

export const updateNewsroom = (address: EthAddress, data: any): AnyAction => {
  return {
    type: newsroomActions.UPDATE_NEWSROOM,
    data: {
      address,
      ...data,
    },
  };
};

export const addEditor = (address: EthAddress, editor: EthAddress): AnyAction => {
  return {
    type: newsroomActions.ADD_EDITOR,
    data: {
      address,
      editor,
    },
  };
};

export const removeEditor = (address: EthAddress, editor: EthAddress) => {
  return {
    type: newsroomActions.REMOVE_EDITOR,
    data: {
      address,
      editor,
    },
  };
};

export const setIsOwner = (address: EthAddress, isOwner: boolean) => {
  return {
    type: newsroomActions.SET_IS_OWNER,
    data: {
      address,
      isOwner,
    },
  };
};

export const setIsEditor = (address: EthAddress, isEditor: boolean) => {
  return {
    type: newsroomActions.SET_IS_EDITOR,
    data: {
      address,
      isEditor,
    },
  };
};

export const changeName = (address: EthAddress, name: string): AnyAction => {
  return {
    type: newsroomActions.CHANGE_NAME,
    data: { name, address },
  };
};

export const updateCharter = (address: EthAddress, charter: Partial<CharterData>): any => (
  dispatch: any,
  getState: any,
): AnyAction => {
  const { newsrooms, newsroomUi }: StateWithNewsroom = getState();
  const newsroom = newsrooms.get(address) || { wrapper: { data: {} } };
  const persistCharter = newsroomUi.get(uiActions.PERSIST_CHARTER);
  if (persistCharter) {
    persistCharter(charter);
  }
  return dispatch(
    updateNewsroom(address, {
      ...newsroom,
      charter,
    }),
  );
};

export const fetchNewsroom = (address: EthAddress): any => async (dispatch: any, getState: any) => {
  const { newsrooms }: StateWithNewsroom = getState();
  const newsroom = newsrooms.get(address);
  const wrapper = await newsroom.newsroom!.getNewsroomWrapper();
  await dispatch(updateNewsroom(address, { ...newsroom, wrapper }));
  // might have additional owners now, so:
  wrapper.data.owners.forEach((userAddress: EthAddress) => {
    dispatch(initContractMember(address, userAddress));
  });
};

export const addGetCmsUserDataForAddress = (func: (address: EthAddress) => Promise<CmsUserData>): AnyAction => {
  return {
    type: uiActions.ADD_GET_CMS_USER_DATA_FOR_ADDRESS,
    data: func,
  };
};

export const addPersistCharter = (func: (charter: Partial<CharterData>) => void): AnyAction => {
  return {
    type: uiActions.ADD_PERSIST_CHARTER,
    data: func,
  };
};

export const ensureUserOnRoster = (newsroomAddress: EthAddress, address: EthAddress, userData?: CmsUserData): any => (
  dispatch: any,
  getState: any,
) => {
  const { newsrooms, newsroomUsers }: StateWithNewsroom = getState();
  const charter = (newsrooms.get(newsroomAddress) || {}).charter || {};
  let roster = charter.roster || [];
  if (findIndex(roster, member => member.ethAddress === address) === -1) {
    const user = makeUserObject(address, userData || newsroomUsers.get(address));
    roster = roster.concat(user.rosterData as RosterMember);
    dispatch(
      updateCharter(newsroomAddress, {
        ...charter,
        roster,
      }),
    );
  }
};

export const storeUserData = (newsroomAddress: EthAddress, address: EthAddress, userData: CmsUserData): AnyAction => {
  return {
    type: userActions.STORE_USER_DATA,
    data: {
      address,
      userData,
    },
  };
};

/* Ensures we have fetched and stored data for this user (if possible) and added to roster. */
export const initContractMember = (newsroomAddress: EthAddress, userAddress: EthAddress): any => async (
  dispatch: any,
  getState: any,
) => {
  const state = getState();
  let userData = state.newsroomUsers.get(userAddress);

  const getCmsUserDataForAddress = state.newsroomUi.get(uiActions.GET_CMS_USER_DATA_FOR_ADDRESS);
  if (!userData && getCmsUserDataForAddress) {
    userData = await getCmsUserDataForAddress(userAddress);
    dispatch(storeUserData(newsroomAddress, userAddress, userData));
  }

  dispatch(ensureUserOnRoster(newsroomAddress, userAddress, userData));
};

export const addConstitutionUri = (uri: string): AnyAction => {
  return {
    type: governmentActions.ADD_CONSTITUTION_URI,
    data: {
      uri,
    },
  };
};

export const addConstitutionHash = (hash: string): AnyAction => {
  return {
    type: governmentActions.ADD_CONSTITUTION_HASH,
    data: {
      hash,
    },
  };
};
