import { Dispatch } from "redux";
import { getTCR, getCivil } from "./civilInstance";
import { addListing } from "../actionCreators/listings";
import { addNewsroom } from "../actionCreators/newsrooms";
import { EthAddress, ListingWrapper } from "@joincivil/core";
import { getApplicationMaximumLengthInBlocks } from "../apis/civilTCR";
import { Observable } from "rxjs";

export async function initializeSubscriptions(dispatch: Dispatch<any, any>): Promise<void> {
  const tcr = getTCR();
  const civil = getCivil();
  const current = await civil.currentBlock();
  const applicationBlock = current - (await getApplicationMaximumLengthInBlocks()).toNumber();
  await Observable.merge(
    tcr.whitelistedListings(0),
    tcr.listingsInApplicationStage(applicationBlock),
    tcr.allEventsExceptWhitelistFromBlock(current),
  ).subscribe(async (listing: ListingWrapper) => {
    await getNewsroom(dispatch, listing.address);
    dispatch(addListing(listing));
  });
}

export async function getNewsroom(dispatch: Dispatch, address: EthAddress): Promise<void> {
  const civil = getCivil();
  const newsroom = await civil.newsroomAtUntrusted(address);
  const newsroomWrapper = await newsroom.getNewsroomWrapper();
  dispatch(addNewsroom(newsroomWrapper));
}
