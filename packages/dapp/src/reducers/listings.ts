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
  isListingAwaitingAppealJudgment,
  isListingAwaitingAppealChallenge,
  isInAppealChallengeCommitPhase,
  isInAppealChallengeRevealPhase,
  canChallengeBeResolved,
  canListingAppealBeResolved,
  TimestampedEvent,
} from "@joincivil/core";
import { listingActions } from "../actionCreators/listings";
import { Subscription } from "rxjs";
import BigNumber from "bignumber.js";

export interface ListingWrapperWithExpiry {
  listing: ListingWrapper;
  expiry: number;
}

export interface ListingExtendedMetadata {
  latestChallengeID?: BigNumber;
  listingRemovedTimestamp?: number;
  whitelistedTimestamp?: number;
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

export function listingsExtendedMetadata(
  state: Map<string, ListingExtendedMetadata> = Map<string, ListingExtendedMetadata>(),
  action: AnyAction,
): Map<string, ListingExtendedMetadata> {
  switch (action.type) {
    case listingActions.ADD_OR_UPDATE_LISTING_EXTENDED_METADATA:
      const prevExtendedMetadata = state.get(action.data.address) || {};
      return state.set(action.data.address, { ...prevExtendedMetadata, ...action.data });
    default:
      return state;
  }
}

export function listingsFetching(state: Map<string, any> = Map<string, any>(), action: AnyAction): Map<string, any> {
  switch (action.type) {
    case listingActions.FETCH_LISTING_DATA:
    case listingActions.FETCH_LISTING_DATA_COMPLETE:
    case listingActions.FETCH_LISTING_DATA_IN_PROGRESS:
      return state.set(action.data.listingID, action.data);
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
          // .sort((a, b) => b.blockNumber! - a.blockNumber!)
          .toList(),
      );
    default:
      return state;
  }
}

export function listingHistorySubscriptions(
  state: Map<string, Subscription> = Map<string, Subscription>(),
  action: AnyAction,
): Map<string, Subscription> {
  switch (action.type) {
    case listingActions.ADD_HISTORY_SUBSCRIPTION:
      return state.set(action.data.address, action.data.subscription);
    default:
      return state;
  }
}

export function rejectedListingLatestChallengeSubscriptions(
  state: Map<string, Subscription> = Map<string, Subscription>(),
  action: AnyAction,
): Map<string, Subscription> {
  switch (action.type) {
    case listingActions.ADD_REJECTED_LISTING_LATEST_CHALLENGE_SUBSCRIPTION:
      return state.set(action.data.address, action.data.subscription);
    default:
      return state;
  }
}

export function rejectedListingRemovedSubscriptions(
  state: Map<string, Subscription> = Map<string, Subscription>(),
  action: AnyAction,
): Map<string, Subscription> {
  switch (action.type) {
    case listingActions.ADD_REJECTED_LISTING_LISTING_REMOVED_SUBSCRIPTION:
      return state.set(action.data.address, action.data.subscription);
    default:
      return state;
  }
}

export function whitelistedSubscriptions(
  state: Map<string, Subscription> = Map<string, Subscription>(),
  action: AnyAction,
): Map<string, Subscription> {
  switch (action.type) {
    case listingActions.ADD_LISTING_WHITELISTED_SUBSCRIPTION:
      return state.set(action.data.address, action.data.subscription);
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
      if (isListingAwaitingAppealJudgment(action.data.data)) {
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

export function loadingFinished(state: boolean = false, action: AnyAction): boolean {
  switch (action.type) {
    case listingActions.SET_LOADING_FINISHED:
      return true;
    default:
      return state;
  }
}
