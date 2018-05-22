import { Dispatch } from "react-redux";
import { getTCR, getCivil } from "./civilInstance";
import { addListing } from "../actionCreators/listings";
import { addNewsroom } from "../actionCreators/newsrooms";
import { EthAddress, ListingWrapper } from "@joincivil/core";
import { Observable } from "rxjs";

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
    dispatch(addListing(listing));
  });
}

export async function getNewsroom(dispatch: Dispatch<any>, address: EthAddress): Promise<void> {
  const civil = getCivil();
  const newsroom = await civil.newsroomAtUntrusted(address);
  const newsroomWrapper = await newsroom.getNewsroomWrapper();
  dispatch(addNewsroom(newsroomWrapper));
}
