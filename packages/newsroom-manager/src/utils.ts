import { EthAddress } from "@joincivil/core";
import { StateWithNewsroom } from "./reducers";
import { uiActions } from "./actionCreators";
import { UserData } from "./types";

export const makeUserObject = (state: StateWithNewsroom, address: EthAddress): UserData => {
  const userData = state.newsroomUi.get(uiActions.GET_CMS_USER_DATA_FOR_ADDRESS) && state.newsroomUsers.get(address);

  return {
    rosterData: {
      ethAddress: address,
      name: userData && userData.displayName,
      avatarUrl: userData && userData.avatarUrl,
    },
    isCmsUser: !!userData,
    username: userData && userData.username,
  };
};
