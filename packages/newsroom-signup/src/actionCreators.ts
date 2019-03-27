import { AnyAction } from "redux";
import { BigNumber } from "bignumber.js";
import { EthAddress, Civil, CharterData, ListingWrapper } from "@joincivil/core";
import { getInfuraUrlFromIpfs, sanitizeConstitutionHtml } from "@joincivil/utils";
import { NewsroomState, StateWithNewsroom } from "./reducers";
import { CmsUserData } from "./types";

export enum newsroomActions {
  ADD_NEWSROOM = "ADD_NEWSROOM",
  UPDATE_NEWSROOM = "UPDATE_NEWSROOM",
  CHANGE_NAME = "CHANGE_NAME",
  ADD_EDITOR = "ADD_EDITOR",
  ADD_OWNER = "ADD_OWNER",
  REMOVE_EDITOR = "REMOVE_EDITOR",
  SET_IS_OWNER = "SET_IS_OWNER",
  SET_IS_EDITOR = "SET_IS_EDITOR",
  SET_MULTISIG_ADDRESS = "SET_MULTISIG_ADDRESS",
  SET_MULTISIG_BALANCE = "SET_MULTISIG_BALANCE",
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
  ADD_CONSTITUTION_CONTENT = "ADD_CONSTITUTION_CONTENT",
}

export enum grantActions {
  SET_GRANT = "CHOOSE_GRANT",
  SET_SKIP = "CHOOSE_SKIP",
  APPLICATION_SUBMITTED = "APPLICATION_SUBMITTED",
  APPLICATION_SKIPPED = "APPLICATION_SKIPPED",
}

export enum listingActions {
  ADD_OR_UPDATE_LISTING = "ADD_OR_UPDATE_LISTING",
}

export const getEditors = (address: EthAddress, civil: Civil): any => async (
  dispatch: any,
  getState: any,
): Promise<void> => {
  const newsroom = await civil.newsroomAtUntrusted(address);
  newsroom
    .editors()
    .distinct()
    .forEach(val => {
      dispatch(initContractMember(address, val));
      dispatch(addEditor(address, val));
    });
};

export const getNewsroom = (address: EthAddress, civil: Civil, charter: Partial<CharterData>): any => async (
  dispatch: any,
  getState: any,
): Promise<AnyAction> => {
  const newsroom = await civil.newsroomAtUntrusted(address);
  const wrapper = await newsroom.getNewsroomWrapper();
  wrapper.data.owners.forEach((userAddress: EthAddress) => {
    dispatch(initContractMember(address, userAddress));
  });
  const multiSigAddr = await newsroom.getMultisigAddress();
  dispatch(setNewsroomMultisigAddress(address, multiSigAddr || ""));
  return dispatch(updateNewsroom(address, { wrapper, newsroom, charter }));
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

export const getNewsroomMultisigBalance = (
  address: EthAddress,
  multisigAddress: EthAddress,
  civil: Civil,
): any => async (dispatch: any, getState: any): Promise<AnyAction> => {
  const tcr = await civil.tcrSingletonTrusted();
  const token = await tcr.getToken();
  const balance = await token.getBalance(multisigAddress);
  dispatch(setNewsroomMultisigAddress(address, multisigAddress));
  return dispatch(setNewsroomMultisigBalance(address, balance));
};

export const setNewsroomMultisigAddress = (address: EthAddress, multisigAddress: EthAddress): AnyAction => {
  return {
    type: newsroomActions.SET_MULTISIG_ADDRESS,
    data: {
      address,
      multisigAddress,
    },
  };
};

export const setNewsroomMultisigBalance = (address: EthAddress, multisigBalance: BigNumber): AnyAction => {
  return {
    type: newsroomActions.SET_MULTISIG_BALANCE,
    data: {
      address,
      multisigBalance,
    },
  };
};

export const getListing = (address: EthAddress, civil: Civil): any => async (
  dispatch: any,
  getState: any,
): Promise<AnyAction> => {
  const tcr = await civil.tcrSingletonTrusted();
  const listing = await tcr.getListing(address);
  return dispatch(addListing(await listing.getListingWrapper()));
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

export const addOwner = (address: EthAddress, owner: EthAddress): AnyAction => {
  return {
    type: newsroomActions.ADD_OWNER,
    data: {
      address,
      owner,
    },
  };
};

export const addListing = (listing: ListingWrapper): AnyAction => {
  return {
    type: listingActions.ADD_OR_UPDATE_LISTING,
    data: listing,
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

export const updateCharter = (address: EthAddress, charter: Partial<CharterData>, dontPersist?: boolean): any => (
  dispatch: any,
  getState: any,
): AnyAction => {
  const { newsrooms, newsroomUi }: StateWithNewsroom = getState();
  const newsroom = newsrooms.get(address) || { wrapper: { data: {} } };
  const persistCharter = newsroomUi.get(uiActions.PERSIST_CHARTER);
  if (persistCharter && !dontPersist) {
    console.log("here", { charter, dontPersist });
    persistCharter(charter);
  }
  return dispatch(
    updateNewsroom(address, {
      ...newsroom,
      charter,
    }),
  );
};

export const fetchConstitution = (ipfsAddress: string): any => async (dispatch: any) => {
  const infuraUrl = getInfuraUrlFromIpfs(ipfsAddress);
  const constitution = await fetch(infuraUrl).then(async body => body.json());
  return dispatch({
    type: governmentActions.ADD_CONSTITUTION_CONTENT,
    data: {
      content: sanitizeConstitutionHtml(constitution.content),
    },
  });
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
};

export const addAndHydrateEditor = (newsroomAddress: EthAddress, editorAddress: EthAddress): any => async (
  dispatch: any,
  getState: any,
) => {
  dispatch(addEditor(newsroomAddress, editorAddress));
  return dispatch(initContractMember(newsroomAddress, editorAddress));
};

export const addAndHydrateOwner = (newsroomAddress: EthAddress, ownerAddress: EthAddress): any => async (
  dispatch: any,
  getState: any,
) => {
  dispatch(addOwner(newsroomAddress, ownerAddress));
  return dispatch(initContractMember(newsroomAddress, ownerAddress));
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

export const setGrant = (value: boolean): AnyAction => {
  return {
    type: grantActions.SET_GRANT,
    data: value,
  };
};

export const setSkip = (value: boolean): AnyAction => {
  return {
    type: grantActions.SET_SKIP,
    data: value,
  };
};
