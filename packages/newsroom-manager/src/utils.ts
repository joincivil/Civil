import { EthAddress } from "@joincivil/core";
import { StateWithNewsroom } from "./reducers";
import { uiActions } from "./actionCreators";
import { CmsUserData, UserData } from "./types";

export const getUserObject = (state: StateWithNewsroom, address: EthAddress): UserData => {
  const userData = state.newsroomUi.get(uiActions.GET_CMS_USER_DATA_FOR_ADDRESS) && state.newsroomUsers.get(address);
  return makeUserObject(address, userData);
}

export const makeUserObject = (address: EthAddress, userData?: CmsUserData): UserData => {
  return {
    rosterData: {
      ethAddress: address,
      name: userData && userData.displayName,
      avatarUrl: userData && userData.avatarUrl,
      bio: userData && userData.bio,
    },
    isCmsUser: !!userData,
    username: userData && userData.username,
  };
};
