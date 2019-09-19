import {
  EthAddress,
  getNextTimerExpiry,
  ListingWrapper,
  StorageHeader,
  WrappedChallengeID,
  WrappedAppealChallengeID,
  WrappedPropID,
} from "@joincivil/core";
import { addNewsroom, setNewsroomMultisigAddress } from "@joincivil/newsroom-signup";
import { getDefaultFromBlock } from "@joincivil/utils";
import { BigNumber } from "@joincivil/typescript-types";
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
import { addUserNewsroom, addContent, addCharterRevision } from "../redux/actionCreators/newsrooms";
import { addUserProposalChallengeData } from "../redux/actionCreators/parameterizer";
import { CivilHelper } from "../apis/CivilHelper";

const listingTimeouts = new Map<string, number>();
const setTimeoutTimeouts = new Map<string, number>();
let initialListingSubscriptions: Subscription | undefined;
let currentListingSubscriptions: Subscription | undefined;

const allNewsroomContentRevisionsSubscriptions = new Map<EthAddress, Subscription>();

export async function initializeSubscriptions(
  helper: CivilHelper,
  dispatch: Dispatch<any>,
  network: number,
): Promise<void> {
  const tcr = await helper.getTCR();
  const civil = helper.civil;
  const current = await civil.currentBlock();
  const civilGenesisBlock = getDefaultFromBlock(network);

  const initialLoadObservable = tcr.allEventsFromBlock(civilGenesisBlock, current);

  initialListingSubscriptions = initialLoadObservable.subscribe(
    async (listing: ListingWrapper) => {
      await getNewsroom(helper, dispatch, listing.address);
      setupListingCallback(listing, dispatch);
      dispatch(addListing(listing));
    },
    err => {
      console.log("error: ", err);
    },
    () => {
      dispatch(setLoadingFinished());
      currentListingSubscriptions = tcr.allEventsFromBlock(current).subscribe(async (listing: ListingWrapper) => {
        await getNewsroom(helper, dispatch, listing.address);
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

let challengeSubscription: Subscription | undefined;
let newChallengeActionsSubscription: Subscription | undefined;
let challengeStartedSubscription: Subscription | undefined;
let allChallengeIDs: Set<string> = new Set();
let allAppealChallengeIDs: Set<string> = new Set();
let appealChallengesToChallengeIDs: Map<string, string> = new Map();
let allUserPollIDs: Set<string> = new Set();
let challengeIdsToListingAddresses: Map<string, string> = new Map();
let allPropChallengeIDs: Set<string> = new Set();
let propChallengeIDsToPropIDs: Map<string, string> = new Map();

async function checkChallengeForUserPoll(
  helper: CivilHelper,
  challengeId: BigNumber,
  dispatch: Dispatch<any>,
  user: EthAddress,
): Promise<void> {
  if (allUserPollIDs.has(challengeId.toString())) {
    await getChallenge(helper, challengeId, dispatch, user);
  }
}

async function checkAppealChallengeForUserPoll(
  helper: CivilHelper,
  appealChallengeID: BigNumber,
  dispatch: Dispatch<any>,
  user: EthAddress,
): Promise<void> {
  if (allUserPollIDs.has(appealChallengeID.toString())) {
    await getAppealChallenge(helper, appealChallengeID, dispatch, user);
  }
}

async function checkPropChallengeIDForUserPoll(
  helper: CivilHelper,
  propChallengeID: BigNumber,
  dispatch: Dispatch<any>,
  user: EthAddress,
): Promise<void> {
  if (allUserPollIDs.has(propChallengeID.toString())) {
    await getPropChallenge(helper, propChallengeID, dispatch, user);
  }
}

async function checkUserPollForChallengeType(
  helper: CivilHelper,
  pollID: BigNumber,
  dispatch: Dispatch<any>,
  user: EthAddress,
): Promise<void> {
  if (allChallengeIDs.has(pollID.toString())) {
    await getChallenge(helper, pollID, dispatch, user);
  } else if (allAppealChallengeIDs.has(pollID.toString())) {
    await getAppealChallenge(helper, pollID, dispatch, user);
  } else if (allPropChallengeIDs.has(pollID.toString())) {
    await getPropChallenge(helper, pollID, dispatch, user);
  }
}

async function getChallenge(
  helper: CivilHelper,
  challengeId: BigNumber,
  dispatch: Dispatch<any>,
  user: EthAddress,
): Promise<void> {
  const tcr = await helper.getTCR();
  const listingAddress = challengeIdsToListingAddresses.get(challengeId.toString())!;
  const wrappedChallenge = await tcr.getChallengeData(challengeId, listingAddress);
  dispatch(addChallenge(wrappedChallenge));
  const challengeUserData = await tcr.getUserChallengeData(challengeId, user);
  dispatch(addUserChallengeData(challengeId.toString(), user, challengeUserData));
}

async function getAppealChallenge(
  helper: CivilHelper,
  appealChallengeID: BigNumber,
  dispatch: Dispatch<any>,
  user: EthAddress,
): Promise<void> {
  const challengeId = new BigNumber(appealChallengesToChallengeIDs.get(appealChallengeID.toString())!);
  const listingAddress = challengeIdsToListingAddresses.get(challengeId.toString())!;
  const tcr = await helper.getTCR();
  const wrappedChallenge = await tcr.getChallengeData(challengeId, listingAddress);
  dispatch(addChallenge(wrappedChallenge));
  const challengeUserData = await tcr.getUserAppealChallengeData(appealChallengeID, user);
  dispatch(addUserAppealChallengeData(appealChallengeID.toString(), user, challengeUserData));
  dispatch(linkAppealChallengeToChallenge(appealChallengeID.toString(), challengeId.toString()));
}

async function getPropChallenge(
  helper: CivilHelper,
  proposalChallengeID: BigNumber,
  dispatch: Dispatch<any>,
  user: EthAddress,
): Promise<void> {
  const tcr = await helper.getTCR();
  const parameterizer = await tcr.getParameterizer();
  const propChallengeUserData = await parameterizer.getUserProposalChallengeData(proposalChallengeID, user);
  dispatch(addUserProposalChallengeData(proposalChallengeID.toString(), user, propChallengeUserData));
}

export async function initializeChallengeSubscriptions(
  helper: CivilHelper,
  dispatch: Dispatch<any>,
  user: EthAddress,
): Promise<void> {
  if (challengeSubscription) {
    challengeSubscription.unsubscribe();
  }
  if (newChallengeActionsSubscription) {
    newChallengeActionsSubscription.unsubscribe();
  }
  if (challengeStartedSubscription) {
    challengeStartedSubscription.unsubscribe();
  }

  allChallengeIDs = new Set();
  allAppealChallengeIDs = new Set();
  appealChallengesToChallengeIDs = new Map();
  allUserPollIDs = new Set();
  challengeIdsToListingAddresses = new Map();
  allPropChallengeIDs = new Set();
  propChallengeIDsToPropIDs = new Map();

  const tcr = await helper.getTCR();
  const civil = helper.civil;
  const current = await civil.currentBlock();
  const parameterizer = await tcr.getParameterizer();

  tcr.allChallengeIDsEver().subscribe(async (wrappedChallengeID: WrappedChallengeID) => {
    allChallengeIDs.add(wrappedChallengeID.challengeID.toString());
    challengeIdsToListingAddresses.set(wrappedChallengeID.challengeID.toString(), wrappedChallengeID.listingAddress);
    await checkChallengeForUserPoll(helper, wrappedChallengeID.challengeID, dispatch, user);
  });
  tcr.allAppealChallengeIDsEver().subscribe(async (wrappedAppealChallengeID: WrappedAppealChallengeID) => {
    allAppealChallengeIDs.add(wrappedAppealChallengeID.appealChallengeToChallengeID.appealChallengeID.toString());
    appealChallengesToChallengeIDs.set(
      wrappedAppealChallengeID.appealChallengeToChallengeID.appealChallengeID.toString(),
      wrappedAppealChallengeID.appealChallengeToChallengeID.challengeID.toString(),
    );
    await checkAppealChallengeForUserPoll(
      helper,
      wrappedAppealChallengeID.appealChallengeToChallengeID.appealChallengeID,
      dispatch,
      user,
    );
  });
  parameterizer.allProposalChallengeIDsEver().subscribe(async (wrappedPropID: WrappedPropID) => {
    allPropChallengeIDs.add(wrappedPropID.challengeID.toString());
    propChallengeIDsToPropIDs.set(wrappedPropID.challengeID.toString(), wrappedPropID.propID);
    await checkPropChallengeIDForUserPoll(helper, wrappedPropID.challengeID, dispatch, user);
  });

  // TODO: also add support for govt proposals

  challengeSubscription = tcr
    .getVoting()
    .votesCommitted(undefined, user)
    .subscribe(async (pollID: BigNumber) => {
      allUserPollIDs.add(pollID.toString());
      await checkUserPollForChallengeType(helper, pollID, dispatch, user);
    });

  newChallengeActionsSubscription = Observable.merge(
    tcr.getVoting().votesRevealed(current, user),
    tcr.getVoting().votesRescued(current, user),
    tcr.rewardsCollected(current, user),
  ).subscribe(async (pollID: BigNumber) => {
    const challengeId = await tcr.getChallengeIDForPollID(pollID);
    if (!challengeId.isZero()) {
      const challengeUserData = await tcr.getUserChallengeData(challengeId, user);
      dispatch(addUserChallengeData(challengeId.toString(), user, challengeUserData));

      // if the challenge ID corresponds to an appeal challenge, get any user data for it
      if (!pollID.eq(challengeId)) {
        const appealChallengeUserData = await tcr.getUserAppealChallengeData(pollID, user);
        dispatch(addUserAppealChallengeData(pollID.toString(), user, appealChallengeUserData));
        dispatch(linkAppealChallengeToChallenge(pollID.toString(), challengeId.toString()));
      }
    } else {
      const propChallengeUserData = await parameterizer.getUserProposalChallengeData(pollID, user);
      dispatch(addUserProposalChallengeData(pollID.toString(), user, propChallengeUserData));
    }
    // TODO: also add support for govt proposals
  });

  challengeStartedSubscription = tcr.challengesStartedByUser(user).subscribe(async (challengeId: BigNumber) => {
    const wrappedChallenge = await tcr.getChallengeData(challengeId);
    dispatch(addChallenge(wrappedChallenge));
    dispatch(addUserChallengeStarted(challengeId.toString(), user));
  });
}

export function clearChallengeSubscriptions(): any {
  if (currentListingSubscriptions) {
    currentListingSubscriptions.unsubscribe();
    currentListingSubscriptions = undefined;
  }
  if (initialListingSubscriptions) {
    initialListingSubscriptions.unsubscribe();
    initialListingSubscriptions = undefined;
  }
  if (challengeSubscription) {
    challengeSubscription.unsubscribe();
    challengeSubscription = undefined;
  }
  if (newChallengeActionsSubscription) {
    newChallengeActionsSubscription.unsubscribe();
    newChallengeActionsSubscription = undefined;
  }
  if (challengeStartedSubscription) {
    challengeStartedSubscription.unsubscribe();
    challengeStartedSubscription = undefined;
  }
}

export async function getNewsroom(helper: CivilHelper, dispatch: Dispatch<any>, address: EthAddress): Promise<void> {
  const civil = helper.civil;
  const user = await civil.accountStream.first().toPromise();
  const newsroom = await civil.newsroomAtUntrusted(address);
  const wrapper = await newsroom.getNewsroomWrapper();
  dispatch(addNewsroom({ wrapper, address: civil.toChecksumAddress(wrapper.address), newsroom }));
  if (user && wrapper.data.owners.includes(user)) {
    const multiSigAddr = await newsroom.getMultisigAddress();
    dispatch(setNewsroomMultisigAddress(address, multiSigAddr || ""));
    dispatch(addUserNewsroom(address));
  }

  const newsroomCharterRevisionsSubscription = newsroom.revisions(0).subscribe(charterRevision => {
    const { revisionId } = charterRevision;
    dispatch(addCharterRevision(address, revisionId!, charterRevision));
  });

  allNewsroomContentRevisionsSubscriptions.set(address, newsroomCharterRevisionsSubscription);
}

async function delay(ms: number): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getIPFSContent(
  helper: CivilHelper,
  header: StorageHeader,
  dispatch: Dispatch<any>,
  wait: number = 1000,
  tries: number = 0,
): Promise<void> {
  const civil = helper.civil;
  const content = await civil.getContent(header);
  if (content) {
    const parsedContent = JSON.parse(content.toString());
    dispatch(addContent(header, parsedContent));
  } else {
    console.warn("Missing IPFS content for header:", header);
    if (header.uri !== "" && tries < 6) {
      console.warn("Retrying getIPFSContent. wait = " + wait + "ms");
      await delay(wait);
      return getIPFSContent(helper, header, dispatch, wait * 2, tries + 1);
    } else if (header.uri !== "" && tries >= 6) {
      console.error("Unable to find IPFS content after 6 tries. header: ", header);
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
