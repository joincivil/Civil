import { Map, Set } from "immutable";
import { AnyAction } from "redux";
import {
  ListingWrapper,
  isInApplicationPhase,
  isWhitelisted,
  canBeWhitelisted,
  isInChallengedCommitVotePhase,
  isInChallengedRevealVotePhase,
  isAwaitingAppealRequest,
  isAwaitingAppealJudgment,
  isListingAwaitingAppealChallenge,
  isListingInAppealChallengeCommitPhase,
  isInAppealChallengeRevealPhase,
  canListingAppealBeResolved,
} from "@joincivil/core";
import { listingActions } from "../actionCreators/listings";

export function listings(
  state: Map<string, ListingWrapper> = Map<string, ListingWrapper>(),
  action: AnyAction,
): Map<string, ListingWrapper> {
  switch (action.type) {
    case listingActions.ADD_LISTING:
      return state.set(action.data.address, action.data);
    default:
      return state;
  }
}

export function applications(state: Set<string> = Set<string>(), action: AnyAction): Set<string> {
  switch (action.type) {
    case listingActions.ADD_LISTING:
      if (isInApplicationPhase(action.data.data)) {
        return state.add(action.data.address);
      } else {
        return state.remove(action.data.address);
      }
    default:
      return state;
  }
}

export function whitelistedListings(state: Set<string> = Set<string>(), action: AnyAction): Set<string> {
  switch (action.type) {
    case listingActions.ADD_LISTING:
      if (isWhitelisted(action.data.data)) {
        return state.add(action.data.address);
      } else {
        return state.remove(action.data.address);
      }
    default:
      return state;
  }
}

export function readyToWhitelistListings(state: Set<string> = Set<string>(), action: AnyAction): Set<string> {
  switch (action.type) {
    case listingActions.ADD_LISTING:
      if (canBeWhitelisted(action.data.data)) {
        return state.add(action.data.address);
      } else {
        return state.remove(action.data.address);
      }
    default:
      return state;
  }
}

export function inChallengeCommitListings(state: Set<string> = Set<string>(), action: AnyAction): Set<string> {
  switch (action.type) {
    case listingActions.ADD_LISTING:
      if (isInChallengedCommitVotePhase(action.data.data)) {
        return state.add(action.data.address);
      } else {
        return state.remove(action.data.address);
      }
    default:
      return state;
  }
}

export function inChallengeRevealListings(state: Set<string> = Set<string>(), action: AnyAction): Set<string> {
  switch (action.type) {
    case listingActions.ADD_LISTING:
      if (isInChallengedRevealVotePhase(action.data.data)) {
        return state.add(action.data.address);
      } else {
        return state.remove(action.data.address);
      }
    default:
      return state;
  }
}

export function awaitingAppealRequestListings(state: Set<string> = Set<string>(), action: AnyAction): Set<string> {
  switch (action.type) {
    case listingActions.ADD_LISTING:
      if (isAwaitingAppealRequest(action.data.data)) {
        return state.add(action.data.address);
      } else {
        return state.remove(action.data.address);
      }
    default:
      return state;
  }
}

export function awaitingAppealJudgmentListings(state: Set<string> = Set<string>(), action: AnyAction): Set<string> {
  switch (action.type) {
    case listingActions.ADD_LISTING:
      if (isAwaitingAppealJudgment(action.data.data)) {
        return state.add(action.data.address);
      } else {
        return state.remove(action.data.address);
      }
    default:
      return state;
  }
}

export function awaitingAppealChallengeListings(state: Set<string> = Set<string>(), action: AnyAction): Set<string> {
  switch (action.type) {
    case listingActions.ADD_LISTING:
      if (isListingAwaitingAppealChallenge(action.data.data)) {
        return state.add(action.data.address);
      } else {
        return state.remove(action.data.address);
      }
    default:
      return state;
  }
}

export function appealChallengeCommitPhaseListings(state: Set<string> = Set<string>(), action: AnyAction): Set<string> {
  switch (action.type) {
    case listingActions.ADD_LISTING:
      if (isListingInAppealChallengeCommitPhase(action.data.data)) {
        return state.add(action.data.address);
      } else {
        return state.remove(action.data.address);
      }
    default:
      return state;
  }
}

export function appealChallengeRevealPhaseListings(state: Set<string> = Set<string>(), action: AnyAction): Set<string> {
  switch (action.type) {
    case listingActions.ADD_LISTING:
      if (isInAppealChallengeRevealPhase(action.data.data)) {
        return state.add(action.data.address);
      } else {
        return state.remove(action.data.address);
      }
    default:
      return state;
  }
}

export function resolveAppealListings(state: Set<string> = Set<string>(), action: AnyAction): Set<string> {
  switch (action.type) {
    case listingActions.ADD_LISTING:
      if (canListingAppealBeResolved(action.data.data)) {
        return state.add(action.data.address);
      } else {
        return state.remove(action.data.address);
      }
    default:
      return state;
  }
}

export function rejectedListings(state: Set<string> = Set<string>(), action: AnyAction): Set<string> {
  switch (action.type) {
    case listingActions.ADD_LISTING:
      if (action.data.data.appExpiry.isZero()) {
        return state.add(action.data.address);
      } else {
        return state.remove(action.data.address);
      }
    default:
      return state;
  }
}
