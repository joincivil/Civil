import { EthAddress, UserChallengeData, WrappedChallengeData } from "@joincivil/core";
import { Dispatch } from "react-redux";
import { AnyAction } from "redux";
import { ensureWeb3BigNumber } from "../apis/civilTCR";
import { getTCR } from "../helpers/civilInstance";

export enum challengeActions {
  ADD_OR_UPDATE_CHALLENGE = "ADD_OR_UPDATE_CHALLENGE",
  ADD_OR_UPDATE_USER_CHALLENGE_DATA = "ADD_OR_UPDATE_USER_CHALLENGE_DATA",
  ADD_OR_UPDATE_USER_APPEAL_CHALLENGE_DATA = "ADD_OR_UPDATE_USER_APPEAL_CHALLENGE_DATA",
  ADD_USER_CHALLENGE_STARTED = "ADD_USER_CHALLENGE_STARTED",
  FETCH_CHALLENGE_DATA = "FETCH_CHALLENGE_DATA",
  FETCH_CHALLENGE_DATA_COMPLETE = "FETCH_CHALLENGE_DATA_COMPLETE",
  FETCH_CHALLENGE_DATA_IN_PROGRESS = "FETCH_CHALLENGE_DATA_IN_PROGRESS",
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

export const addUserChallengeStarted = (challengeID: string, user: EthAddress) => {
  return {
    type: challengeActions.ADD_USER_CHALLENGE_STARTED,
    data: { challengeID, user },
  };
};

export const addUserAppealChallengeData = (
  challengeID: string,
  user: EthAddress,
  userChallengeData: UserChallengeData,
) => {
  return {
    type: challengeActions.ADD_OR_UPDATE_USER_APPEAL_CHALLENGE_DATA,
    data: { challengeID, user, userChallengeData },
  };
};

export const fetchChallenge = (challengeID: string): AnyAction => {
  return {
    type: challengeActions.FETCH_CHALLENGE_DATA,
    data: {
      challengeID,
      isFetching: true,
    },
  };
};

export const fetchChallengeInProgress = (challengeID: string): AnyAction => {
  return {
    type: challengeActions.FETCH_CHALLENGE_DATA_IN_PROGRESS,
    data: {
      challengeID,
      isFetching: true,
    },
  };
};

export const fetchChallengeComplete = (challengeID: string): AnyAction => {
  return {
    type: challengeActions.FETCH_CHALLENGE_DATA_COMPLETE,
    data: {
      challengeID,
      isFetching: false,
    },
  };
};

export const fetchAndAddChallengeData = (challengeID: string): any => {
  return async (dispatch: Dispatch<any>, getState: any): Promise<AnyAction> => {
    const { challengesFetching } = getState().networkDependent;
    const challengeRequest = challengesFetching.get(challengeID);

    // Never fetched this before, so let's fetch it
    if (challengeRequest === undefined) {
      dispatch(fetchChallenge(challengeID));

      const tcr = await getTCR();
      const challengeIDBN = ensureWeb3BigNumber(parseInt(challengeID, 10));
      console.log("got tcr, fetching", challengeID);
      const wrappedChallenge = await tcr.getChallengeData(challengeIDBN);
      console.log(challengeID, wrappedChallenge);
      dispatch(addChallenge(wrappedChallenge));

      return dispatch(fetchChallengeComplete(challengeID));

      // We think it's still fetching, so fire an action in case we want to capture this
      // state for a progress indicator
    } else if (challengeRequest.isFetching) {
      return dispatch(fetchChallengeInProgress(challengeID));

      // This was an additional request for a challenge that was already fetched
    } else {
      return dispatch(fetchChallengeComplete(challengeID));
    }
  };
};
