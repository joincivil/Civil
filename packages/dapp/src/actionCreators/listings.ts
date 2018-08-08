import { CivilTCR, ListingWrapper, TimestampedEvent } from "@joincivil/core";
import { List } from "immutable";
import { Dispatch } from "react-redux";
import { AnyAction } from "redux";
import { Subscription } from "rxjs";
import { getTCR } from "../helpers/civilInstance";
import { getNewsroom } from "../helpers/listingEvents";
import { addChallenge } from "./challenges";
import BigNumber from "bignumber.js";

export enum listingActions {
  ADD_OR_UPDATE_LISTING = "ADD_OR_UPDATE_LISTING",
  ADD_OR_UPDATE_LISTING_EXTENDED_METADATA = "ADD_OR_UPDATE_LISTING_EXTENDED_METADATA",
  ADD_HISTORY_EVENT = "ADD_HISTORY_EVENT",
  ADD_HISTORY_SUBSCRIPTION = "ADD_HISTORY_SUBSCRIPTION",
  ADD_REJECTED_LISTING_LATEST_CHALLENGE_SUBSCRIPTION = "ADD_REJECTED_LISTING_LATEST_CHALLENGE_SUBSCRIPTION",
  ADD_REJECTED_LISTING_LISTING_REMOVED_SUBSCRIPTION = "ADD_REJECTED_LISTING_LISTING_REMOVED_SUBSCRIPTION",
  ADD_LISTING_WHITELISTED_SUBSCRIPTION = "ADD_LISTING_WHITELISTED_SUBSCRIPTION ",
  FETCH_LISTING_DATA = "FETCH_LISTING_DATA",
  FETCH_LISTING_DATA_COMPLETE = "FETCH_LISTING_DATA_COMPLETE",
  FETCH_LISTING_DATA_IN_PROGRESS = "FETCH_LISTING_DATA_IN_PROGRESS",
}

export const addListing = (listing: ListingWrapper): any => {
  return async (dispatch: Dispatch<any>, getState: any): Promise<AnyAction> => {
    if (!listing.data.challengeID.isZero()) {
      const wrappedChallenge = {
        listingAddress: listing.address,
        challengeID: listing.data.challengeID,
        challenge: listing.data.challenge!,
      };
      dispatch(addChallenge(wrappedChallenge));
    }
    return dispatch(addListingBasic(listing));
  };
};

const addListingBasic = (listing: ListingWrapper): AnyAction => {
  return {
    type: listingActions.ADD_OR_UPDATE_LISTING,
    data: listing,
  };
};

const addOrUpdateListingLatestChallenge = (listingAddress: string, challengeID: BigNumber): AnyAction => {
  return {
    type: listingActions.ADD_OR_UPDATE_LISTING_EXTENDED_METADATA,
    data: {
      address: listingAddress,
      latestChallengeID: challengeID,
    },
  };
};

const addOrUpdateListingRemovedTimestamp = (listingAddress: string, timestamp: number): AnyAction => {
  return {
    type: listingActions.ADD_OR_UPDATE_LISTING_EXTENDED_METADATA,
    data: {
      address: listingAddress,
      listingRemovedTimestamp: timestamp,
    },
  };
};

const addOrUpdateListingWhitelistedTimestamp = (listingAddress: string, timestamp: number): AnyAction => {
  return {
    type: listingActions.ADD_OR_UPDATE_LISTING_EXTENDED_METADATA,
    data: {
      address: listingAddress,
      whitelistedTimestamp: timestamp,
    },
  };
};

export const addHistoryEvent = (address: string, event: TimestampedEvent<any>): AnyAction => {
  return {
    type: listingActions.ADD_HISTORY_EVENT,
    data: {
      address,
      event,
    },
  };
};

export const addHistorySubscription = (address: string, subscription: Subscription): AnyAction => {
  return {
    type: listingActions.ADD_HISTORY_SUBSCRIPTION,
    data: {
      address,
      subscription,
    },
  };
};

export const addRejectedListingLatestChallengeSubscription = (
  address: string,
  subscription: Subscription,
): AnyAction => {
  return {
    type: listingActions.ADD_REJECTED_LISTING_LATEST_CHALLENGE_SUBSCRIPTION,
    data: {
      address,
      subscription,
    },
  };
};

export const addRejectedListingRemovedSubscription = (address: string, subscription: Subscription): AnyAction => {
  return {
    type: listingActions.ADD_REJECTED_LISTING_LISTING_REMOVED_SUBSCRIPTION,
    data: {
      address,
      subscription,
    },
  };
};

export const addWhitelistedSubscription = (address: string, subscription: Subscription): AnyAction => {
  return {
    type: listingActions.ADD_LISTING_WHITELISTED_SUBSCRIPTION,
    data: {
      address,
      subscription,
    },
  };
};

export const fetchListing = (listingID: string): AnyAction => {
  return {
    type: listingActions.FETCH_LISTING_DATA,
    data: {
      listingID,
      isFetching: true,
    },
  };
};

export const fetchListingInProgress = (listingID: string): AnyAction => {
  return {
    type: listingActions.FETCH_LISTING_DATA_IN_PROGRESS,
    data: {
      listingID,
      isFetching: true,
    },
  };
};

export const fetchListingComplete = (listingID: string): AnyAction => {
  return {
    type: listingActions.FETCH_LISTING_DATA_COMPLETE,
    data: {
      listingID,
      isFetching: false,
    },
  };
};

export const fetchAndAddListingData = (listingID: string): any => {
  return async (dispatch: Dispatch<any>, getState: any): Promise<AnyAction> => {
    const { listingsFetching } = getState().networkDependent;
    const challengeRequest = listingsFetching.get(listingID);

    // Never fetched this before, so let's fetch it
    if (challengeRequest === undefined) {
      dispatch(fetchListing(listingID));

      const tcr = await getTCR();
      const listing = tcr.getListing(listingID);
      const wrappedListing = await listing.getListingWrapper();
      dispatch(await setupListingHistorySubscription(listingID));
      await getNewsroom(dispatch, listingID);
      dispatch(addListing(wrappedListing));

      return dispatch(fetchListingComplete(listingID));

      // We think it's still fetching, so fire an action in case we want to capture this
      // state for a progress indicator
    } else if (challengeRequest.isFetching) {
      return dispatch(fetchListingInProgress(listingID));

      // This was an additional request for a challenge that was already fetched
    } else {
      return dispatch(fetchListingComplete(listingID));
    }
  };
};

export const setupListingHistorySubscription = async (listingID: string): Promise<any> => {
  const tcr = await getTCR();
  return (dispatch: Dispatch<any>, getState: any): any => {
    const { histories, listingHistorySubscriptions } = getState().networkDependent;
    if (!listingHistorySubscriptions.get(listingID)) {
      const listingHistory = histories.get(listingID) || List();
      const listing = tcr.getListing(listingID);
      const lastBlock = listingHistory.size ? listingHistory.last().blockNumber : 0;
      const subscription = listing
        .compositeObservables(lastBlock + 1) // +1 so that you dont get the last event again
        .subscribe(async event => {
          const timestamp = await event.timestamp();
          dispatch(addHistoryEvent(listingID, { ...event, timestamp }));
        });
      dispatch(addHistorySubscription(listingID, subscription));
    }
  };
};

export const setupRejectedListingLatestChallengeSubscription = async (listingID: string): Promise<any> => {
  const tcr = await getTCR();
  return (dispatch: Dispatch<any>, getState: any): any => {
    const { rejectedListingLatestChallengeSubscriptions } = getState().networkDependent;
    if (!rejectedListingLatestChallengeSubscriptions.get(listingID)) {
      const listing = tcr.getListing(listingID);
      const subscription = listing
        .latestChallengeSucceeded()
        .subscribe(async (event: TimestampedEvent<CivilTCR.LogEvents._ChallengeSucceeded> | undefined) => {
          if (!!event) {
            const challengeID = (event as any).args.challengeID;
            dispatch(addOrUpdateListingLatestChallenge(listingID, challengeID));
          }
        });
      dispatch(addRejectedListingLatestChallengeSubscription(listingID, subscription));
    }
  };
};

export const setupRejectedListingRemovedSubscription = async (listingID: string): Promise<any> => {
  const tcr = await getTCR();
  return (dispatch: Dispatch<any>, getState: any): any => {
    const { rejectedListingRemovedSubscriptions } = getState().networkDependent;
    if (!rejectedListingRemovedSubscriptions.get(listingID)) {
      const listing = tcr.getListing(listingID);
      const subscription = listing
        .latestListingRemoved()
        .subscribe(async (event: TimestampedEvent<CivilTCR.LogEvents._ListingRemoved> | undefined) => {
          if (!!event) {
            const timestamp = await (event as any).timestamp();
            dispatch(addOrUpdateListingRemovedTimestamp(listingID, timestamp));
          }
        });
      dispatch(addRejectedListingRemovedSubscription(listingID, subscription));
    }
  };
};

export const setupListingWhitelistedSubscription = async (listingID: string): Promise<any> => {
  const tcr = await getTCR();
  return (dispatch: Dispatch<any>, getState: any): any => {
    const { whitelistedSubscriptions } = getState().networkDependent;
    if (!whitelistedSubscriptions.get(listingID)) {
      const listing = tcr.getListing(listingID);
      const subscription = listing
        .latestWhitelisted()
        .subscribe(async (event: TimestampedEvent<CivilTCR.LogEvents._ApplicationWhitelisted> | undefined) => {
          if (!!event) {
            const timestamp = await (event as any).timestamp();
            dispatch(addOrUpdateListingWhitelistedTimestamp(listingID, timestamp));
          }
        });
      dispatch(addWhitelistedSubscription(listingID, subscription));
    }
  };
};
