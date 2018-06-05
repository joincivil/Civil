import { AnyAction } from "redux";
import { Dispatch } from "react-redux";
import { ListingWrapper, TimestampedEvent } from "@joincivil/core";
import { getTCR } from "../helpers/civilInstance";
import { getNewsroom } from "../helpers/listingEvents";

export enum listingActions {
  ADD_OR_UPDATE_LISTING = "ADD_OR_UPDATE_LISTING",
  ADD_HISTORY_EVENT = "ADD_HISTORY_EVENT",
  FETCH_LISTING_DATA = "FETCH_LISTING_DATA",
  FETCH_LISTING_DATA_COMPLETE = "FETCH_LISTING_DATA_COMPLETE",
  FETCH_LISTING_DATA_IN_PROGRESS = "FETCH_LISTING_DATA_IN_PROGRESS",
}

export const addListing = (listing: ListingWrapper): AnyAction => {
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
    const { listingsFetching } = getState();
    const challengeRequest = listingsFetching.get(listingID);

    // Never fetched this before, so let's fetch it
    if (challengeRequest === undefined) {
      dispatch(fetchListing(listingID));

      const tcr = getTCR();
      const wrappedListing = await tcr.getListing(listingID).getListingWrapper();
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
