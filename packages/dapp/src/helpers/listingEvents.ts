import { Dispatch } from "react-redux";
import { getTCR, getCivil } from "./civilInstance";
import { addListing } from "../actionCreators/listings";
import { addNewsroom } from "../actionCreators/newsrooms";
import { EthAddress, ListingWrapper, getNextTimerExpiry } from "@joincivil/core";
import { Observable } from "rxjs";

const listingTimeouts = new Map<string, number>();

export async function initializeSubscriptions(dispatch: Dispatch<any>): Promise<void> {
  const tcr = getTCR();
  const civil = getCivil();
  const current = await civil.currentBlock();
  await Observable.merge(
    tcr.whitelistedListings(0),
    tcr.listingsInApplicationStage(),
    tcr.allEventsExceptWhitelistFromBlock(current),
  ).subscribe(async (listing: ListingWrapper) => {
    await getNewsroom(dispatch, listing.address);
    setupListingCallback(listing, dispatch);
    dispatch(addListing(listing));
  });
}

export async function getNewsroom(dispatch: Dispatch<any>, address: EthAddress): Promise<void> {
  const civil = getCivil();
  const newsroom = await civil.newsroomAtUntrusted(address);
  const newsroomWrapper = await newsroom.getNewsroomWrapper();
  dispatch(addNewsroom(newsroomWrapper));
}

function setupListingCallback(listing: ListingWrapper, dispatch: Dispatch<any>): void {
  if (listingTimeouts[listing.address]) {
    clearTimeout(listingTimeouts[listing.address]);
    listingTimeouts.delete(listing.address);
  }
  const nowSeconds = Date.now() / 1000;
  const nextExpiry = getNextTimerExpiry(listing.data);
  if (nextExpiry > 0) {
    const delaySeconds = nowSeconds - nextExpiry;
    listingTimeouts.set(listing.address, setTimeout(dispatch, delaySeconds * 1000, addListing(listing))); // convert to milliseconds
  }
}
