import { AnyAction } from "redux";
import { EthAddress, Civil } from "@joincivil/core";
import { NewsroomState, StateWithNewsroom } from "./reducers";

export enum newsroomActions {
  ADD_NEWSROOM = "ADD_NEWSROOM",
  UPDATE_NEWSROOM = "UPDATE_NEWSROOM",
  ADD_EDITOR = "ADD_EDITOR",
}

export const getEditors = (address: EthAddress, civil: Civil): any => async (dispatch: any): Promise<void> => {
  const newsroom = await civil.newsroomAtUntrusted(address);
  await newsroom.editors().forEach(val => dispatch(addEditor(address, val)));
};

export const getNewsroom = (address: EthAddress, civil: Civil): any => async (dispatch: any): Promise<AnyAction> => {
  const newsroom = await civil.newsroomAtUntrusted(address);
  const wrapper = await newsroom.getNewsroomWrapper();
  return dispatch(addNewsroom({ wrapper, newsroom, address }));
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

export const fetchNewsroom = (address: EthAddress): any => async (dispatch: any, getState: any): Promise<AnyAction> => {
  const { newsrooms }: StateWithNewsroom = getState();
  const newsroom = newsrooms.get(address);
  const wrapper = await newsroom.newsroom!.getNewsroomWrapper();
  return dispatch(updateNewsroom(address, { ...newsroom, wrapper }));
};
