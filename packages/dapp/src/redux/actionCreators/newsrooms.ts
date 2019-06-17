import { AnyAction } from "redux";
import { EthAddress, ContentData, StorageHeader } from "@joincivil/core";
import { getIPFSContent } from "../../helpers/listingEvents";

export enum newsroomActions {
  ADD_USER_NEWSROOM = "ADD_USER_NEWSROOM",
  ADD_CONTENT = "ADD_CONTENT",
  FETCH_CONTENT = "FETCH_CONTENT",
  ADD_CHARTER_REVISION = "ADD_CHARTER_REVISION",
}

export const addUserNewsroom = (address: EthAddress): AnyAction => {
  return {
    type: newsroomActions.ADD_USER_NEWSROOM,
    data: address,
  };
};

export const addContent = (header: StorageHeader, content: ContentData): AnyAction => {
  return {
    type: newsroomActions.ADD_CONTENT,
    data: {
      header,
      content,
    },
  };
};

export const addCharterRevision = (address: EthAddress, revisionId: number, header: StorageHeader) => {
  return {
    type: newsroomActions.ADD_CHARTER_REVISION,
    data: {
      address,
      revisionId,
      header,
    },
  };
};

export const fetchContent = (header: StorageHeader): AnyAction => {
  return {
    type: newsroomActions.FETCH_CONTENT,
    data: header,
  };
};

export const getContent = (header: StorageHeader): any => {
  return async (dispatch: any, getState: any): Promise<AnyAction | void> => {
    const contentFetched = getState().networkDependent.contentFetched;
    if (!contentFetched.has(header.uri)) {
      dispatch(fetchContent(header));
      await getIPFSContent(header, dispatch);
    }
  };
};

export const getBareContent = (uri: string): any => {
  return async (dispatch: any, getState: any): Promise<AnyAction | void> => {
    const contentFetched = getState().networkDependent.contentFetched;
    if (!contentFetched.has(uri)) {
      await getIPFSContent({ uri }, dispatch);
      dispatch(fetchContent({ uri }));
    }
  };
};
