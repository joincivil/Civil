import { EthAddress, getNextTimerExpiry, ListingWrapper } from "@joincivil/core";
import { addNewsroom } from "@joincivil/newsroom-manager";
import { BigNumber } from "bignumber.js";
import { Dispatch } from "react-redux";
import { Observable, Subscription } from "rxjs";
import {
  addChallenge,
  addUserAppealChallengeData,
  addUserChallengeData,
  addUserChallengeStarted,
} from "../actionCreators/challenges";
import { addListing } from "../actionCreators/listings";
import { addUserNewsroom } from "../actionCreators/newsrooms";
import { getCivil, getTCR } from "./civilInstance";

const listingTimeouts = new Map<string, number>();
const setTimeoutTimeouts = new Map<string, number>();

export async function initializeSubscriptions(dispatch: Dispatch<any>): Promise<void> {
  const tcr = await getTCR();
  const civil = getCivil();
  const current = await civil.currentBlock();
  Observable.merge(
    tcr.whitelistedListings(0),
    tcr.listingsInApplicationStage(),
    tcr.allEventsExceptWhitelistFromBlock(current),
  ).subscribe(async (listing: ListingWrapper) => {
    await getNewsroom(dispatch, listing.address);
    setupListingCallback(listing, dispatch);
    dispatch(addListing(listing));
  });
}

let challengeSubscription: Subscription;
let challengeStartedSubscription: Subscription;
export async function initializeChallengeSubscriptions(dispatch: Dispatch<any>, user: EthAddress): Promise<void> {
  if (challengeSubscription) {
    challengeSubscription.unsubscribe();
  }
  if (challengeStartedSubscription) {
    challengeStartedSubscription.unsubscribe();
  }

  const tcr = await getTCR();
  challengeSubscription = tcr
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

  challengeStartedSubscription = tcr.challengesStartedByUser(user).subscribe(async (challengeId: BigNumber) => {
    const wrappedChallenge = await tcr.getChallengeData(challengeId);
    dispatch(addChallenge(wrappedChallenge));
    dispatch(addUserChallengeStarted(challengeId.toString(), user));
  });
}

export async function getNewsroom(dispatch: Dispatch<any>, address: EthAddress): Promise<void> {
  const civil = getCivil();
  const user = await civil.accountStream.first().toPromise();
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
