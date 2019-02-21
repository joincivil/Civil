import { AnyAction } from "redux";
import { parameterizerActions } from "../actionCreators/parameterizer";
import { ParamPropChallengeData, UserChallengeData } from "@joincivil/core";
import { Map } from "immutable";

export function parameters(state: object = {}, action: AnyAction): object {
  switch (action.type) {
    case parameterizerActions.SET_PARAMETER:
      return { ...state, [action.paramName]: action.paramValue };
    case parameterizerActions.MULTI_SET_PARAMETERS:
      return { ...state, ...action.params };
    default:
      return state;
  }
}

export function proposals(state: Map<string, object> = Map<string, object>(), action: AnyAction): Map<string, object> {
  switch (action.type) {
    case parameterizerActions.ADD_OR_UPDATE_PROPOSAL:
      const newState = state.set(action.proposal.id, action.proposal);
      return newState;
    default:
      return state;
  }
}

export function parameterProposalChallenges(
  state: Map<string, ParamPropChallengeData> = Map<string, ParamPropChallengeData>(),
  action: AnyAction,
): Map<string, ParamPropChallengeData> {
  switch (action.type) {
    case parameterizerActions.ADD_OR_UPDATE_CHALLENGE:
      return state.set(action.data.challengeID, action.data);
    default:
      return state;
  }
}

export function parameterProposalChallengesFetching(
  state: Map<string, any> = Map<string, any>(),
  action: AnyAction,
): Map<string, any> {
  switch (action.type) {
    case parameterizerActions.FETCH_CHALLENGE_DATA:
    case parameterizerActions.FETCH_CHALLENGE_DATA_COMPLETE:
    case parameterizerActions.FETCH_CHALLENGE_DATA_IN_PROGRESS:
      return state.set(action.data.challengeID, action.data);
    default:
      return state;
  }
}

export function proposalChallengeUserData(
  state: Map<string, Map<string, UserChallengeData>> = Map<string, Map<string, UserChallengeData>>(),
  action: AnyAction,
): Map<string, Map<string, UserChallengeData>> {
  switch (action.type) {
    case parameterizerActions.ADD_OR_UPDATE_USER_PROPOSAL_CHALLENGE_DATA:
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
