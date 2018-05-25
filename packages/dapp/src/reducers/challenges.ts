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
      return state.set(action.data.challengeID.toString(), action.data);
    default:
      return state;
  }
}

export function currentUserChallengesVotedOn(state: Set<string> = Set<string>(), action: AnyAction): Set<string> {
  switch (action.type) {
    case challengeActions.ADD_OR_UPDATE_USER_CHALLENGE_DATA:
      if (action.data.userChallengeData.didUserCommit) {
        return state.add(action.data.challengeID.toString());
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
