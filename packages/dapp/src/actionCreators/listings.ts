import { ListingWrapper, TimestampedEvent } from "@joincivil/core";
import { List } from "immutable";
import { Dispatch } from "react-redux";
import { AnyAction } from "redux";
import { Subscription } from "rxjs";
import { getTCR } from "../helpers/civilInstance";
import { getNewsroom } from "../helpers/listingEvents";
import { addChallenge } from "./challenges";

export enum listingActions {
  ADD_OR_UPDATE_LISTING = "ADD_OR_UPDATE_LISTING",
  ADD_HISTORY_EVENT = "ADD_HISTORY_EVENT",
  ADD_HISTORY_SUBSCRIPTION = "ADD_HISTORY_SUBSCRIPTION",
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
      dispatch(setupListingHistorySubscription(listingID));
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

export const setupListingHistorySubscription = (listingID: string): any => {
  return async (dispatch: Dispatch<any>, getState: any): Promise<any> => {
    const { histories, listingHistorySubscriptions } = getState().networkDependent;
    if (!listingHistorySubscriptions.get(listingID)) {
      const listingHistory = histories.get(listingID) || List();
      const tcr = await getTCR();
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
