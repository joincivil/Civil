import { EthAddress, getNextTimerExpiry, ListingWrapper, StorageHeader } from "@joincivil/core";
import { addNewsroom } from "@joincivil/newsroom-signup";
import { getDefaultFromBlock } from "@joincivil/utils";
import { BigNumber } from "bignumber.js";
import { Dispatch } from "react-redux";
import { Subscription, Observable } from "rxjs";
import {
  addChallenge,
  addUserAppealChallengeData,
  addUserChallengeData,
  addUserChallengeStarted,
  linkAppealChallengeToChallenge,
} from "../redux/actionCreators/challenges";
import { addListing, setLoadingFinished } from "../redux/actionCreators/listings";
import { addUserNewsroom, addContent } from "../redux/actionCreators/newsrooms";
import { getCivil, getTCR } from "./civilInstance";

const listingTimeouts = new Map<string, number>();
const setTimeoutTimeouts = new Map<string, number>();
let initialListingSubscriptions: Subscription | undefined;
let currentListingSubscriptions: Subscription | undefined;

export async function initializeSubscriptions(dispatch: Dispatch<any>, network: number): Promise<void> {
  const tcr = await getTCR();
  const civil = getCivil();
  const current = await civil.currentBlock();
  const civilGenesisBlock = getDefaultFromBlock(network);

  const initialLoadObservable = tcr.allEventsFromBlock(civilGenesisBlock, current);

  initialListingSubscriptions = initialLoadObservable.subscribe(
    async (listing: ListingWrapper) => {
      await getNewsroom(dispatch, listing.address);
      setupListingCallback(listing, dispatch);
      dispatch(addListing(listing));
    },
    err => {
      console.log("error: ", err);
    },
    () => {
      dispatch(setLoadingFinished());
      currentListingSubscriptions = tcr.allEventsFromBlock(current).subscribe(async (listing: ListingWrapper) => {
        await getNewsroom(dispatch, listing.address);
        setupListingCallback(listing, dispatch);
        dispatch(addListing(listing));
      });
    },
  );
}

export function clearListingSubscriptions(): any {
  if (currentListingSubscriptions) {
    currentListingSubscriptions.unsubscribe();
    currentListingSubscriptions = undefined;
  }
  if (initialListingSubscriptions) {
    initialListingSubscriptions.unsubscribe();
    initialListingSubscriptions = undefined;
  }
  listingTimeouts.forEach((val, key) => {
    clearTimeout(listingTimeouts.get(key));
  });
  listingTimeouts.clear();
  setTimeoutTimeouts.forEach((val, key) => {
    clearTimeout(setTimeoutTimeouts.get(key));
  });
  setTimeoutTimeouts.clear();
}

let challengeSubscription: Subscription;
let newChallengeActionsSubscription: Subscription;
let challengeStartedSubscription: Subscription;
export async function initializeChallengeSubscriptions(dispatch: Dispatch<any>, user: EthAddress): Promise<void> {
  if (challengeSubscription) {
    challengeSubscription.unsubscribe();
  }
  if (newChallengeActionsSubscription) {
    newChallengeActionsSubscription.unsubscribe();
  }
  if (challengeStartedSubscription) {
    challengeStartedSubscription.unsubscribe();
  }

  const tcr = await getTCR();
  const civil = getCivil();
  const current = await civil.currentBlock();
  challengeSubscription = tcr
    .getVoting()
    .votesCommitted(undefined, user)
    .subscribe(async (pollID: BigNumber) => {
      const challengeId = await tcr.getChallengeIDForPollID(pollID);
      const wrappedChallenge = await tcr.getChallengeData(challengeId);
      dispatch(addChallenge(wrappedChallenge));
      const challengeUserData = await tcr.getUserChallengeData(challengeId, user);
      dispatch(addUserChallengeData(challengeId.toString(), user, challengeUserData));

      // if the challenge ID corresponds to an appeal challenge, get any user data for it
      if (!pollID.equals(challengeId)) {
        const appealChallengeUserData = await tcr.getUserAppealChallengeData(pollID, user);
        dispatch(addUserAppealChallengeData(pollID.toString(), user, appealChallengeUserData));
        dispatch(linkAppealChallengeToChallenge(pollID.toString(), challengeId.toString()));
      }
    });

  newChallengeActionsSubscription = Observable.merge(
    tcr.getVoting().votesRevealed(current, user),
    tcr.getVoting().votesRescued(current, user),
    tcr.rewardsCollected(current, user),
  ).subscribe(async (pollID: BigNumber) => {
    const challengeId = await tcr.getChallengeIDForPollID(pollID);
    const challengeUserData = await tcr.getUserChallengeData(challengeId, user);
    dispatch(addUserChallengeData(challengeId.toString(), user, challengeUserData));

    // if the challenge ID corresponds to an appeal challenge, get any user data for it
    if (!pollID.equals(challengeId)) {
      const appealChallengeUserData = await tcr.getUserAppealChallengeData(pollID, user);
      dispatch(addUserAppealChallengeData(pollID.toString(), user, appealChallengeUserData));
      dispatch(linkAppealChallengeToChallenge(pollID.toString(), challengeId.toString()));
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

async function delay(ms: number): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getIPFSContent(
  header: StorageHeader,
  dispatch: Dispatch<any>,
  wait: number = 1000,
): Promise<void> {
  const civil = getCivil();
  const content = await civil.getContent(header);
  if (content) {
    const parsedContent = JSON.parse(content.toString());
    dispatch(addContent(header, parsedContent));
  } else {
    console.warn("Missing IPFS content for header:", header);
    if (header.uri !== "") {
      console.warn("Retrying getIPFSContent. wait = " + wait + "ms");
      await delay(wait);
      return getIPFSContent(header, dispatch, wait * 2);
    }
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
