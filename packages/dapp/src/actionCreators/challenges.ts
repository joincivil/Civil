import { AnyAction } from "redux";
import { WrappedChallengeData, UserChallengeData, EthAddress } from "@joincivil/core";

export enum challengeActions {
  ADD_OR_UPDATE_CHALLENGE = "ADD_OR_UPDATE_CHALLENGE",
  ADD_OR_UPDATE_USER_CHALLENGE_DATA = "ADD_OR_UPDATE_USER_CHALLENGE_DATA",
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
