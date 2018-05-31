import { Map, Set } from "immutable";
import { AnyAction } from "redux";
import { WrappedChallengeData, UserChallengeData } from "@joincivil/core";
import { challengeActions } from "../actionCreators/challenges";

export function challenges(
  state: Map<string, WrappedChallengeData> = Map<string, WrappedChallengeData>(),
  action: AnyAction,
): Map<string, WrappedChallengeData> {
  switch (action.type) {
    case challengeActions.ADD_OR_UPDATE_CHALLENGE:
      console.log(action.data);
      return state.set(action.data.challengeID.toString(), action.data);
    default:
      return state;
  }
}

export function challengesFetching(state: Map<string, any> = Map<string, any>(), action: AnyAction): Map<string, any> {
  switch (action.type) {
    case challengeActions.FETCH_CHALLENGE_DATA:
    case challengeActions.FETCH_CHALLENGE_DATA_COMPLETE:
    case challengeActions.FETCH_CHALLENGE_DATA_IN_PROGRESS:
      return state.set(action.data.challengeID, action.data);
    default:
      return state;
  }
}

export function challengesVotedOnByUser(
  state: Map<string, Set<string>> = Map<string, Set<string>>(),
  action: AnyAction,
): Map<string, Set<string>> {
  switch (action.type) {
    case challengeActions.ADD_OR_UPDATE_USER_CHALLENGE_DATA:
      if (action.data.userChallengeData.didUserCommit) {
        let userSet = state.get(action.data.user);
        if (!userSet) {
          userSet = Set<string>();
        }
        const userSet2 = userSet.add(action.data.challengeID);
        return state.set(action.data.user, userSet2);
      }
    default:
      return state;
  }
}

export function challengeUserData(
  state: Map<string, Map<string, UserChallengeData>> = Map<string, Map<string, UserChallengeData>>(),
  action: AnyAction,
): Map<string, Map<string, UserChallengeData>> {
  switch (action.type) {
    case challengeActions.ADD_OR_UPDATE_USER_CHALLENGE_DATA:
      let challengeMap = state.get(action.data.challengeID);
      if (!challengeMap) {
        challengeMap = Map<string, UserChallengeData>();
      }
      const challengeMap2 = challengeMap.set(action.data.user, action.data.userChallengeData);
      return state.set(action.data.challengeID, challengeMap2);
    default:
      return state;
  }
}
