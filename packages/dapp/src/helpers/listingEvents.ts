import { Dispatch } from "redux";
import { getTCR } from "./civilInstance";
import { addListing } from "../actionCreators/listings";

export async function initializeSubscriptions(dispatch: Dispatch): Promise<void> {
  const tcr = getTCR();
  await tcr.allApplicationsEver().forEach(async listing => {
    dispatch(addListing(listing));
  });
}
