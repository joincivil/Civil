import { AnyAction } from "redux";
import { NewsroomWrapper, EthAddress } from "@joincivil/core";
import { getCivil } from "../helpers/civilInstance";

export enum newsroomActions {
  ADD_NEWSROOM = "ADD_NEWSROOM",
  UPDATE_NEWSROOM = "UPDATE_NEWSROOM",
  ADD_USER_NEWSROOM = "ADD_USER_NEWSROOM",
}

export const addUserNewsroom = (address: EthAddress): AnyAction => {
  return {
    type: newsroomActions.ADD_USER_NEWSROOM,
    data: address,
  };
};

export const getNewsroom = (address: EthAddress): any => async (dispatch: any): Promise<AnyAction> => {
  console.log("called");
  const civil = getCivil();
  const newsroom = await civil.newsroomAtUntrusted(address);
  const wrapper =  await newsroom.getNewsroomWrapper();
  return dispatch(addNewsroom(wrapper));
}

export const addNewsroom = (newsroom: NewsroomWrapper): AnyAction => {
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
      data,
    }
  }
};
