import { AnyAction } from "redux";
import { EthAddress, EthContentHeader, ContentData } from "@joincivil/core";
import { getIPFSContent } from "../helpers/listingEvents";

export enum newsroomActions {
  ADD_USER_NEWSROOM = "ADD_USER_NEWSROOM",
  ADD_CONTENT = "ADD_CONTENT",
  FETCH_CONTENT = "FETCH_CONTENT",
}

export const addUserNewsroom = (address: EthAddress): AnyAction => {
  return {
    type: newsroomActions.ADD_USER_NEWSROOM,
    data: address,
  };
};

export const addContent = (header: EthContentHeader, content: ContentData): AnyAction => {
  return {
    type: newsroomActions.ADD_CONTENT,
    data: {
      header,
      content,
    },
  };
};

export const fetchContent = (header: EthContentHeader): AnyAction => {
  return {
    type: newsroomActions.FETCH_CONTENT,
    data: header,
  };
};

export const getContent = (header: EthContentHeader): any => {
  return async (dispatch: any, getState: any): Promise<AnyAction | void> => {
    const contentFetched = getState().networkDependent.contentFetched;
    if (!contentFetched.has(header)) {
      await getIPFSContent(header, dispatch);
      dispatch(fetchContent(header));
    }
  };
};
