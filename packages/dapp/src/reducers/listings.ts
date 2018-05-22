import { Map, Set, List } from "immutable";
import { AnyAction } from "redux";
import {
  ListingWrapper,
  isInApplicationPhase,
  isWhitelisted,
  canBeWhitelisted,
  getNextTimerExpiry,
  isInChallengedCommitVotePhase,
  isInChallengedRevealVotePhase,
  isAwaitingAppealRequest,
  isAwaitingAppealJudgment,
  isListingAwaitingAppealChallenge,
  isInAppealChallengeCommitPhase,
  isInAppealChallengeRevealPhase,
  canChallengeBeResolved,
  canListingAppealBeResolved,
  TimestampedEvent,
} from "@joincivil/core";
import { listingActions } from "../actionCreators/listings";

export interface ListingWrapperWithExpiry {
  listing: ListingWrapper;
  expiry: number;
}

export function listings(
  state: Map<string, ListingWrapperWithExpiry> = Map<string, ListingWrapperWithExpiry>(),
  action: AnyAction,
): Map<string, ListingWrapperWithExpiry> {
  switch (action.type) {
    case listingActions.ADD_OR_UPDATE_LISTING:
      const getNextExpiry = getNextTimerExpiry(action.data.data);
      return state.set(action.data.address, { listing: action.data, expiry: getNextExpiry });
    default:
      return state;
  }
}

export function histories(
  state: Map<string, List<TimestampedEvent<any>>> = Map<string, List<TimestampedEvent<any>>>(),
  action: AnyAction,
): Map<string, List<TimestampedEvent<any>>> {
  switch (action.type) {
    case listingActions.ADD_HISTORY_EVENT:
      const list = state.get(action.data.address) || List();
      return state.set(
        action.data.address,
        list
          .push(action.data.event)
          .sort((a, b) => a.blockNumber! - b.blockNumber!)
          .toList(),
      );
    default:
      return state;
  }
}

export function applications(state: Set<string> = Set<string>(), action: AnyAction): Set<string> {
  switch (action.type) {
    case listingActions.ADD_OR_UPDATE_LISTING:
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
    case listingActions.ADD_OR_UPDATE_LISTING:
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
    case listingActions.ADD_OR_UPDATE_LISTING:
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
    case listingActions.ADD_OR_UPDATE_LISTING:
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
    case listingActions.ADD_OR_UPDATE_LISTING:
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
    case listingActions.ADD_OR_UPDATE_LISTING:
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
    case listingActions.ADD_OR_UPDATE_LISTING:
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
    case listingActions.ADD_OR_UPDATE_LISTING:
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
    case listingActions.ADD_OR_UPDATE_LISTING:
      if (isInAppealChallengeCommitPhase(action.data.data)) {
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
    case listingActions.ADD_OR_UPDATE_LISTING:
      if (isInAppealChallengeRevealPhase(action.data.data)) {
        return state.add(action.data.address);
      } else {
        return state.remove(action.data.address);
      }
    default:
      return state;
  }
}

export function resolveChallengeListings(state: Set<string> = Set<string>(), action: AnyAction): Set<string> {
  switch (action.type) {
    case listingActions.ADD_OR_UPDATE_LISTING:
      if (canChallengeBeResolved(action.data.data)) {
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
    case listingActions.ADD_OR_UPDATE_LISTING:
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
    case listingActions.ADD_OR_UPDATE_LISTING:
      if (action.data.data.appExpiry.isZero()) {
        return state.add(action.data.address);
      } else {
        return state.remove(action.data.address);
      }
    default:
      return state;
  }
}
