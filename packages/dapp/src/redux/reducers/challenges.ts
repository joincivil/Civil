import { Map, Set } from "immutable";
import { AnyAction } from "redux";
import { WrappedChallengeData, UserChallengeData, TxDataAll } from "@joincivil/core";
import { challengeActions } from "../actionCreators/challenges";

export function challenges(
  state: Map<string, WrappedChallengeData> = Map<string, WrappedChallengeData>(),
  action: AnyAction,
): Map<string, WrappedChallengeData> {
  switch (action.type) {
    case challengeActions.ADD_OR_UPDATE_CHALLENGE:
      return state.set(action.data.challengeID.toString(), action.data);
    case challengeActions.CLEAR_ALL_CHALLENGES_DATA:
      return Map<string, WrappedChallengeData>();
    default:
      return state;
  }
}

export function appealChallengeIDsToChallengeIDs(
  state: Map<string, string> = Map<string, string>(),
  action: AnyAction,
): Map<string, string> {
  switch (action.type) {
    case challengeActions.LINK_APPEAL_CHALLENGE_TO_CHALLENGE:
      return state.set(action.data.appealChallengeID.toString(), action.data.challengeID.toString());
    case challengeActions.CLEAR_ALL_CHALLENGES_DATA:
      return Map<string, string>();
    default:
      return state;
  }
}

export function grantAppealTxs(
  state: Map<string, TxDataAll> = Map<string, TxDataAll>(),
  action: AnyAction,
): Map<string, TxDataAll> {
  switch (action.type) {
    case challengeActions.ADD_GRANT_APPEAL_TX:
      return state.set(action.data.listingAddress, action.data.txData);
    default:
      return state;
  }
}

export function grantAppealTxsFetching(
  state: Map<string, boolean> = Map<string, boolean>(),
  action: AnyAction,
): Map<string, boolean> {
  switch (action.type) {
    case challengeActions.FETCH_GRANT_APPEAL_TX:
      return state.set(action.data.listingAddress, true);
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
    case challengeActions.CLEAR_ALL_CHALLENGES_DATA:
      return Map<string, any>();
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
    case challengeActions.CLEAR_ALL_CHALLENGES_DATA:
      return Map<string, Set<string>>();
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
    case challengeActions.CLEAR_ALL_CHALLENGES_DATA:
      return Map<string, Set<string>>();
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
    case challengeActions.CLEAR_ALL_CHALLENGES_DATA:
      return Map<string, Map<string, UserChallengeData>>();
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
    case challengeActions.CLEAR_ALL_CHALLENGES_DATA:
      return Map<string, Map<string, UserChallengeData>>();
    default:
      return state;
  }
}
