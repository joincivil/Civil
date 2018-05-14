import { AnyAction } from "redux";
import { ListingWrapper } from "@joincivil/core";

export enum listingActions {
  ADD_LISTING = "ADD_LISTING",
}

export const addListing = (listing: ListingWrapper): AnyAction => {
  return {
    type: listingActions.ADD_LISTING,
    data: listing,
  };
};
