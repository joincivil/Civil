import { Dispatch } from "react-redux";
import { getTCR, getCivil } from "./civilInstance";
import { addListing } from "../actionCreators/listings";
import { addChallenge, addUserChallengeData, addUserAppealChallengeData } from "../actionCreators/challenges";
import { addUserNewsroom } from "../actionCreators/newsrooms";
import { addNewsroom } from "@joincivil/newsroom-manager";
import { EthAddress, ListingWrapper, getNextTimerExpiry } from "@joincivil/core";
import { Observable, Subscription } from "rxjs";
import { BigNumber } from "bignumber.js";

const listingTimeouts = new Map<string, number>();
const setTimeoutTimeouts = new Map<string, number>();

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

let challengeSubscriptions: Subscription;
export async function initializeChallengeSubscriptions(dispatch: Dispatch<any>, user: EthAddress): Promise<void> {
  if (challengeSubscriptions) {
    challengeSubscriptions.unsubscribe();
  }

  const tcr = getTCR();
  challengeSubscriptions = tcr
    .getVoting()
    .votesCommitted(0, user)
    .subscribe(async (pollID: BigNumber) => {
      const challengeId = await tcr.getChallengeIDForPollID(pollID);
      const wrappedChallenge = await tcr.getChallengeData(challengeId);
      dispatch(addChallenge(wrappedChallenge));
      const challengeUserData = await tcr.getUserChallengeData(challengeId, user);
      dispatch(addUserChallengeData(challengeId.toString(), user, challengeUserData));

      // if the challenge ID corresponds to an appeal challenge, get any user data for it
      if (!pollID.equals(challengeId)) {
        const appealChallengeUserData = await tcr.getUserChallengeData(pollID, user);
        dispatch(addUserAppealChallengeData(pollID.toString(), user, appealChallengeUserData));
      }
    });
}

export async function getNewsroom(dispatch: Dispatch<any>, address: EthAddress): Promise<void> {
  const civil = getCivil();
  const user = civil.userAccount;
  const newsroom = await civil.newsroomAtUntrusted(address);
  const wrapper = await newsroom.getNewsroomWrapper();
  dispatch(addNewsroom({ wrapper, address: wrapper.address, newsroom }));
  if (user && wrapper.data.owners.includes(user)) {
    dispatch(addUserNewsroom(address));
  }
}

function setupListingCallback(listing: ListingWrapper, dispatch: Dispatch<any>): void {
  if (listingTimeouts.get(listing.address)) {
    clearTimeout(listingTimeouts.get(listing.address));
    listingTimeouts.delete(listing.address);
  }

  if (setTimeoutTimeouts.get(listing.address)) {
    clearTimeout(setTimeoutTimeouts.get(listing.address));
    setTimeoutTimeouts.delete(listing.address);
  }

  const nowSeconds = Date.now() / 1000;
  const nextExpiry = getNextTimerExpiry(listing.data);
  if (nextExpiry > 0) {
    const delaySeconds = nextExpiry - nowSeconds;
    listingTimeouts.set(listing.address, setTimeout(dispatch, delaySeconds * 1000, addListing(listing))); // convert to milliseconds
    setTimeoutTimeouts.set(listing.address, setTimeout(setupListingCallback, delaySeconds * 1000, listing, dispatch));
  }
}
