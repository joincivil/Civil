import { AnyAction } from "redux";
import { Dispatch } from "react-redux";
import { getTCR } from "../helpers/civilInstance";
import { BigNumber } from "bignumber.js";
import { WrappedChallengeData, UserChallengeData, EthAddress } from "@joincivil/core";

export enum challengeActions {
  ADD_OR_UPDATE_CHALLENGE = "ADD_OR_UPDATE_CHALLENGE",
  ADD_OR_UPDATE_USER_CHALLENGE_DATA = "ADD_OR_UPDATE_USER_CHALLENGE_DATA",
  FETCH_CHALLENGE_DATA = "FETCH_CHALLENGE_DATA",
  FETCH_AND_ADD_CHALLENGE_DATA = "FETCH_AND_ADD_CHALLENGE_DATA",
}

export const addChallenge = (wrappedChallenge: WrappedChallengeData): AnyAction => {
  return {
    type: challengeActions.ADD_OR_UPDATE_CHALLENGE,
    data: wrappedChallenge,
  };
};

export const addUserChallengeData = (challengeID: string, user: EthAddress, userChallengeData: UserChallengeData) => {
  return {
    type: challengeActions.ADD_OR_UPDATE_USER_CHALLENGE_DATA,
    data: { challengeID, user, userChallengeData },
  };
};

export const fetchChallenge = (data: any): AnyAction => {
  return {
    type: challengeActions.FETCH_CHALLENGE_DATA,
    data,
  };
};

export const fetchAndAddChallengeData = (challengeID: string, user: EthAddress): any => {
  return async (dispatch: Dispatch<any>, getState: any): Promise<AnyAction> => {
    const { challengesFetching } = getState();
    const challengeRequest = challengesFetching.get(challengeID);
    if (challengeRequest === undefined) {
      return dispatch(fetchChallenge({ challengeID, isFetching: false }));
    }

    dispatch(fetchChallenge({ isFetching: true }));

    const tcr = getTCR();
    const challengeIDBN = new BigNumber(challengeID);
    const wrappedChallenge = await tcr.getChallengeData(challengeIDBN);
    const challengeUserData = await tcr.getUserChallengeData(challengeIDBN, user);
    dispatch(addChallenge(wrappedChallenge));
    dispatch(addUserChallengeData(challengeIDBN.toString(), user, challengeUserData));

    return dispatch(fetchChallenge({ isFetching: false }));
  };
};
