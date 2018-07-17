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

export function challengesStartedByUser(
  state: Map<string, Set<string>> = Map<string, Set<string>>(),
  action: AnyAction,
): Map<string, Set<string>> {
  switch (action.type) {
    case challengeActions.ADD_USER_CHALLENGE_STARTED:
      let userSet = state.get(action.data.user);
      if (!userSet) {
        userSet = Set<string>();
      }
      return state.set(action.data.user, userSet.add(action.data.challengeID));
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
      let userSet = state.get(action.data.user);
      if (!userSet) {
        userSet = Set<string>();
      }
      return state.set(action.data.user, userSet.add(action.data.challengeID));
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
      if (!state.contains(action.data.challengeID)) {
        return state.set(
          action.data.challengeID,
          Map<string, UserChallengeData>([[action.data.user.toString(), action.data.userChallengeData]]),
        );
      }
      return state.setIn([action.data.challengeID, action.data.user], action.data.userChallengeData);
    default:
      return state;
  }
}

export function appealChallengeUserData(
  state: Map<string, Map<string, UserChallengeData>> = Map<string, Map<string, UserChallengeData>>(),
  action: AnyAction,
): Map<string, Map<string, UserChallengeData>> {
  switch (action.type) {
    case challengeActions.ADD_OR_UPDATE_USER_APPEAL_CHALLENGE_DATA:
      if (!state.contains(action.data.challengeID)) {
        return state.set(
          action.data.challengeID,
          Map<string, UserChallengeData>([[action.data.user.toString(), action.data.userChallengeData]]),
        );
      }
      return state.setIn([action.data.challengeID, action.data.user], action.data.userChallengeData);
    default:
      return state;
  }
}
