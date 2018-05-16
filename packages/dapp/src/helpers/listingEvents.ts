import { Dispatch } from "redux";
import { getTCR, getCivil } from "./civilInstance";
import { addListing } from "../actionCreators/listings";
import { addNewsroom } from "../actionCreators/newsrooms";
import { EthAddress } from "@joincivil/core";

export async function initializeSubscriptions(dispatch: Dispatch): Promise<void> {
  const tcr = getTCR();
  await tcr.allApplicationsEver().forEach(async listing => {
    dispatch(addListing(listing));
    await getNewsroom(dispatch, listing.address);
  });
}

export async function getNewsroom(dispatch: Dispatch, address: EthAddress): Promise<void> {
  const civil = getCivil();
  const newsroom = await civil.newsroomAtUntrusted(address);
  const newsroomWrapper = await newsroom.getNewsroomWrapper();
  dispatch(addNewsroom(newsroomWrapper));
}
