import { AnyAction } from "redux";
import { WrappedChallengeData } from "@joincivil/core";

export enum challengeActions {
  ADD_OR_UPDATE_CHALLENGE = "ADD_OR_UPDATE_CHALLENGE",
}

export const addChallenge = (wrappedChallenge: WrappedChallengeData): AnyAction => {
  return {
    type: challengeActions.ADD_OR_UPDATE_CHALLENGE,
    data: wrappedChallenge,
  };
};
