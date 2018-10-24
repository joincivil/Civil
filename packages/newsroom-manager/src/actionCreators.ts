import { AnyAction } from "redux";
import { EthAddress, Civil, CharterData } from "@joincivil/core";
import { NewsroomState, StateWithNewsroom } from "./reducers";
import { CmsUserData } from "./types";

export enum newsroomActions {
  ADD_NEWSROOM = "ADD_NEWSROOM",
  UPDATE_NEWSROOM = "UPDATE_NEWSROOM",
  CHANGE_NAME = "CHANGE_NAME",
  ADD_OWNER = "ADD_OWNER",
  ADD_EDITOR = "ADD_EDITOR",
  REMOVE_EDITOR = "REMOVE_EDITOR",
  SET_IS_OWNER = "SET_IS_OWNER",
  SET_IS_EDITOR = "SET_IS_EDITOR",
  UPDATE_CHARTER = "UPDATE_CHARTER",
}

export enum uiActions {
  ADD_GET_NAME_FOR_ADDRESS = "ADD_GET_NAME_FOR_ADDRESS",
  GET_NAME_FOR_ADDRESS = "GET_NAME_FOR_ADDRESS",
  ADD_PERSIST_CHARTER = "ADD_PERSIST_CHARTER",
  PERSIST_CHARTER = "PERSIST_CHARTER",
}

export enum userActions {
  ADD_USER = "ADD_USER",
}

export enum governmentActions {
  ADD_CONSTITUTION_URI = "ADD_CONSTITUTION_URI",
  ADD_CONSTITUTION_HASH = "ADD_CONSTITUTION_HASH",
}

export const getOwners = (address: EthAddress, civil: Civil): any => async (
  dispatch: any,
  getState: any,
): Promise<void> => {
  const state = getState();
  const newsroom = await civil.newsroomAtUntrusted(address);
  (await newsroom.owners()).forEach(async val => {
    const getNameForAddress = state.newsroomUi.get(uiActions.GET_NAME_FOR_ADDRESS);
    if (getNameForAddress && !state.newsroomUsers.get(val)) {
      const name = await getNameForAddress(val);
      dispatch(addUser(val, name));
    }
    dispatch(addOwner(address, val));
  });
};

export const getEditors = (address: EthAddress, civil: Civil): any => async (
  dispatch: any,
  getState: any,
): Promise<void> => {
  const state = getState();
  const newsroom = await civil.newsroomAtUntrusted(address);
  await newsroom.editors().forEach(async val => {
    const getNameForAddress = state.newsroomUi.get(uiActions.GET_NAME_FOR_ADDRESS);
    if (getNameForAddress && !state.newsroomUsers.get(val)) {
      const name = await getNameForAddress(val);
      dispatch(addUser(val, name));
    }
    dispatch(addEditor(address, val));
  });
};

export const getNewsroom = (address: EthAddress, civil: Civil): any => async (
  dispatch: any,
  getState: any,
): Promise<AnyAction> => {
  const newsroom = await civil.newsroomAtUntrusted(address);
  const wrapper = await newsroom.getNewsroomWrapper();
  const state = getState();
  const getNameForAddress = state.newsroomUi.get(uiActions.GET_NAME_FOR_ADDRESS);
  if (getNameForAddress) {
    wrapper.data.owners.forEach(async (userAddress: EthAddress): Promise<void> => {
      if (!state.newsroomUsers.get(userAddress)) {
        const name = await getNameForAddress(userAddress);
        dispatch(addUser(userAddress, name));
      }
    });
  }
  return dispatch(addNewsroom({ wrapper, newsroom, address }));
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

export const addOwner = (address: EthAddress, owner: EthAddress): AnyAction => {
  return {
    type: newsroomActions.ADD_OWNER,
    data: {
      address,
      owner,
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
  const state = getState();
  const persistCharter = state.newsroomUi.get(uiActions.PERSIST_CHARTER);
  if (persistCharter) {
    persistCharter(charter);
  }
  return {
    type: newsroomActions.UPDATE_CHARTER,
    data: { charter, address },
  };
};

export const fetchNewsroom = (address: EthAddress): any => async (dispatch: any, getState: any): Promise<AnyAction> => {
  const { newsrooms }: StateWithNewsroom = getState();
  const newsroom = newsrooms.get(address);
  const wrapper = await newsroom.newsroom!.getNewsroomWrapper();
  return dispatch(updateNewsroom(address, { ...newsroom, wrapper }));
};

export const addGetNameForAddress = (func: (address: EthAddress) => Promise<CmsUserData>): AnyAction => {
  return {
    type: uiActions.ADD_GET_NAME_FOR_ADDRESS,
    data: func,
  };
};

export const addPersistCharter = (func: (charter: Partial<CharterData>) => void): AnyAction => {
  return {
    type: uiActions.ADD_PERSIST_CHARTER,
    data: func,
  };
};

export const addUser = (address: EthAddress, name: string): AnyAction => {
  return {
    type: userActions.ADD_USER,
    data: {
      address,
      name,
    },
  };
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
