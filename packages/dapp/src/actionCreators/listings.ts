import { AnyAction } from "redux";
import { ListingWrapper, TimestampedEvent } from "@joincivil/core";

export enum listingActions {
  ADD_OR_UPDATE_LISTING = "ADD_OR_UPDATE_LISTING",
  ADD_HISTORY_EVENT = "ADD_HISTORY_EVENT",
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
