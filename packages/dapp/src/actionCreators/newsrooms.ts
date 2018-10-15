import { AnyAction } from "redux";
import { EthAddress, EthContentHeader, ContentData } from "@joincivil/core";
import { getIPFSContent } from "../helpers/listingEvents";
import { Dispatch } from "react-redux";

export enum newsroomActions {
  ADD_USER_NEWSROOM = "ADD_USER_NEWSROOM",
  ADD_CONTENT = "ADD_CONTENT",
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

const contentFetched = new Set<EthContentHeader>();
export const getContent = async (header: EthContentHeader): Promise<any> => {
  if (!contentFetched.has(header)) {
    contentFetched.add(header);
    return (dispatch: Dispatch<any>): any => {
      return getIPFSContent(header, dispatch);
    };
  }
};
