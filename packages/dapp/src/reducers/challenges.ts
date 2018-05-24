import { Map, Set } from "immutable";
import { AnyAction } from "redux";
import { WrappedChallengeData } from "@joincivil/core";
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
    case challengeActions.ADD_OR_UPDATE_CHALLENGE:
      if (action.data.challenge.didUserCommit) {
        return state.add(action.data.challengeID.toString());
      }
    default:
      return state;
  }
}
