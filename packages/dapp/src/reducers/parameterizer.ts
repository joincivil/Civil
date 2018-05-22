import { AnyAction } from "redux";
import { parameterizerActions } from "../actionCreators/parameterizer";
import { ParamProposalState } from "@joincivil/core";
import { Map, Set } from "immutable";

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
      return state.set(action.proposal.id, action.proposal);
    default:
      return state;
  }
}

export function proposalApplications(state: Set<object> = Set<object>(), action: AnyAction): Set<object> {
  switch (action.type) {
    case parameterizerActions.ADD_OR_UPDATE_PROPOSAL:
      if (action.proposal.state === ParamProposalState.APPLYING) {
        return state.add(action.proposal);
      } else {
        return state.remove(action.proposal);
      }
    default:
      return state;
  }
}

export function challengedCommitProposals(state: Set<object> = Set<object>(), action: AnyAction): Set<object> {
  switch (action.type) {
    case parameterizerActions.ADD_OR_UPDATE_PROPOSAL:
      if (action.proposal.state === ParamProposalState.CHALLENGED_IN_COMMIT_VOTE_PHASE) {
        return state.add(action.proposal);
      } else {
        return state.remove(action.proposal);
      }
    default:
      return state;
  }
}

export function challengedRevealProposals(state: Set<object> = Set<object>(), action: AnyAction): Set<object> {
  switch (action.type) {
    case parameterizerActions.ADD_OR_UPDATE_PROPOSAL:
      if (action.proposal.state === ParamProposalState.CHALLENGED_IN_REVEAL_VOTE_PHASE) {
        return state.add(action.proposal);
      } else {
        return state.remove(action.proposal);
      }
    default:
      return state;
  }
}

export function updateableProposals(state: Set<object> = Set<object>(), action: AnyAction): Set<object> {
  switch (action.type) {
    case parameterizerActions.ADD_OR_UPDATE_PROPOSAL:
      if (action.proposal.state === ParamProposalState.READY_TO_PROCESS) {
        return state.add(action.proposal);
      } else {
        return state.remove(action.proposal);
      }
    default:
      return state;
  }
}

export function resolvableChallengedProposals(state: Set<object> = Set<object>(), action: AnyAction): Set<object> {
  switch (action.type) {
    case parameterizerActions.ADD_OR_UPDATE_PROPOSAL:
      if (action.proposal.state === ParamProposalState.READY_TO_RESOLVE_CHALLENGE) {
        return state.add(action.proposal);
      } else {
        return state.remove(action.proposal);
      }
    default:
      return state;
  }
}
