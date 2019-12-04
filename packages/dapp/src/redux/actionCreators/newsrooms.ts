import { AnyAction } from "redux";
import { EthAddress, ContentData, StorageHeader } from "@joincivil/typescript-types";
import { getIPFSContent } from "../../helpers/listingEvents";
import { CivilHelper } from "../../apis/CivilHelper";

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

export const getContent = (helper: CivilHelper, header: StorageHeader): any => {
  return async (dispatch: any, getState: any): Promise<AnyAction | void> => {
    const contentFetched = getState().networkDependent.contentFetched;
    if (!contentFetched.has(header.uri)) {
      dispatch(fetchContent(header));
      await getIPFSContent(helper, header, dispatch);
    }
  };
};

export const getBareContent = (helper: CivilHelper, uri: string): any => {
  return async (dispatch: any, getState: any): Promise<AnyAction | void> => {
    const contentFetched = getState().networkDependent.contentFetched;
    if (!contentFetched.has(uri)) {
      await getIPFSContent(helper, { uri }, dispatch);
      dispatch(fetchContent({ uri }));
    }
  };
};
