import { AnyAction } from "redux";
import { EthAddress, BigNumber, CharterData, ListingWrapper } from "@joincivil/typescript-types";
import { Map } from "immutable";
import { Civil } from "@joincivil/core";
import { getInfuraUrlFromIpfs, sanitizeConstitutionHtml, is0x0Address } from "@joincivil/utils";
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
}

export enum listingActions {
  GET_LISTING_FAIL = "GET_LISTING_FAIL",
  ADD_OR_UPDATE_LISTING = "ADD_OR_UPDATE_LISTING",
  SETUP_LISTING_APPLICATION_SUBSCRIPTION = "SETUP_LISTING_APPLICATION_SUBSCRIPTION",
  LISTING_APPLICATION_SUBSCRIPTION_ALREADY_EXISTS = "LISTING_APPLICATION_SUBSCRIPTION_ALREADY_EXISTS",
}

export enum analyticsActions {
  EVENT = "EVENT",
  NAVIGATE_STEP = "NAVIGATE_STEP",
  REACHED_NEW_STEP = "REACHED_NEW_STEP",
  APPLICATION_SUBMITTED = "APPLICATION_SUBMITTED",
  APPLICATION_SKIPPED = "APPLICATION_SKIPPED",
  TRACK_TX = "TRACK_TX",
  PUBLISH_CHARTER = "PUBLISH_CHARTER",
}

export enum TX_TYPE {
  CREATE_NEWSROOM = "CREATE_NEWSROOM",
  CHANGE_NAME = "CHANGE_NAME",
  TRANSFER_TOKENS = "TRANSFER_TOKENS",
  APPROVE_TOKENS = "APPROVE_TOKENS",
  APPLY_TO_TCR = "APPLY_TO_TCR",
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

const setNewsroomMultisigBalance = (address: EthAddress, multisigBalance: BigNumber): AnyAction => {
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

  const listingData = await getListingData(listing);
  if (listingData) {
    return dispatch(addListing(listingData));
  } else if (listing) {
    return dispatch(setupListingApplicationsSubscription(address, listing));
  }

  return {
    type: listingActions.GET_LISTING_FAIL,
  };
};

const getListingData = async (listing: any): Promise<ListingWrapper | undefined> => {
  const listingData = await listing.getListingWrapper();
  const owner = listingData && listingData.data && listingData.data.owner;
  if (owner && !is0x0Address(owner)) {
    return listingData;
  }
  return;
};

// @TODO(jon): This should probably go into an actual Redux store, but its a little
// weird b/c the DApp is responsible for the reducers for the store. It may make sense
// to abstract redux into a separate package first?
let listingApplicationSubscriptions: Map<EthAddress, any> = Map<EthAddress, any>();

const setupListingApplicationsSubscription = (listingAddress: EthAddress, listing: any) => async (
  dispatch: any,
  getState: any,
): Promise<AnyAction> => {
  if (!listingApplicationSubscriptions.includes(listingAddress)) {
    const applicationEventHandler = async (event: any) => {
      const listingData = await getListingData(listing);
      if (listingData) {
        dispatch(addListing(listingData));
        listingApplicationSubscriptions.get(listingAddress).unsubscribe(applicationEventHandler);
        listingApplicationSubscriptions = listingApplicationSubscriptions.delete(listingAddress);
      }
    };
    const subscription = listing.applications().subscribe(applicationEventHandler);
    listingApplicationSubscriptions = listingApplicationSubscriptions.set(listingAddress, subscription);

    return {
      type: listingActions.SETUP_LISTING_APPLICATION_SUBSCRIPTION,
      data: {
        address: listingAddress,
      },
    };
  }

  return {
    type: listingActions.LISTING_APPLICATION_SUBSCRIPTION_ALREADY_EXISTS,
    data: {
      address: listingAddress,
    },
  };
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

export const grantSubmitted = (): AnyAction => {
  return {
    type: analyticsActions.APPLICATION_SUBMITTED,
  };
};
export const grantSkipped = (): AnyAction => {
  return {
    type: analyticsActions.APPLICATION_SKIPPED,
  };
};

export const trackTx = (txType: TX_TYPE, state: "start" | "complete" | "error", txHash?: string): AnyAction => {
  return {
    type: analyticsActions.TRACK_TX,
    data: {
      txType,
      state,
      txHash,
    },
  };
};

export const publishCharter = (ipfsHash: string): AnyAction => {
  return {
    type: analyticsActions.PUBLISH_CHARTER,
    data: ipfsHash,
  };
};

export const navigateStep = (step: number, path: string = "/apply-to-registry"): AnyAction => {
  return {
    type: analyticsActions.NAVIGATE_STEP,
    step,
    path,
  };
};
export const reachedNewStep = (step: number): AnyAction => {
  return {
    type: analyticsActions.REACHED_NEW_STEP,
    step,
  };
};

export const analyticsEvent = (event: {
  category?: string;
  action: string;
  label?: string;
  value?: number;
}): AnyAction => {
  return {
    type: analyticsActions.EVENT,
    event,
  };
};
