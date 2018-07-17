import { createSelector } from "reselect";
import { State } from "../reducers";
import { Map } from "immutable";
import {
  canListingBeChallenged,
  EthAddress,
  canAppealBeResolved as getCanAppealBeResolved,
  canBeWhitelisted as getCanBeWhitelisted,
  canResolveChallenge as getCanResolveChallenge,
  isInApplicationPhase,
  isChallengeInCommitStage,
  isChallengeInRevealStage,
  isListingAwaitingAppealJudgment as getIsListingAwaitingAppealJudgement,
  isAwaitingAppealChallenge as getIsAwaitingAppealChallenge,
  isAppealAwaitingJudgment,
  ListingWrapper,
  WrappedChallengeData,
} from "@joincivil/core";
import BigNumber from "bignumber.js";

// @TODO(jon): Export this in reducers?
import { ListingWrapperWithExpiry } from "../reducers/listings";

export interface ListingContainerProps {
  listingAddress?: EthAddress;
}

export interface ChallengeContainerProps {
  challengeID?: string | BigNumber;
}

export const getListings = (state: State) => state.networkDependent.listings;

export const getListingWrapper = (state: State, props: ListingContainerProps) => {
  if (!props.listingAddress) {
    return;
  }
  const listings: Map<string, ListingWrapperWithExpiry> = state.networkDependent.listings;
  const listingAddress = props.listingAddress;
  const listing: ListingWrapperWithExpiry | undefined = listings.get(listingAddress)
    ? listings.get(listingAddress)
    : undefined;
  return listing;
};

export const makeGetListing = () => {
  return createSelector([getListingWrapper], listingWrapper => {
    const listing: ListingWrapper | undefined = listingWrapper ? listingWrapper.listing : undefined;
    return listing;
  });
};

export const getChallenge = (state: State, props: ChallengeContainerProps) => {
  let { challengeID } = props;
  if (!challengeID) {
    return;
  }
  if (typeof challengeID !== "string") {
    challengeID = challengeID.toString();
  }
  const challenges = state.networkDependent.challenges;
  const challenge: WrappedChallengeData = challenges.get(challengeID);
  return challenge;
};

export const makeGetListingAddressByChallengeID = () => {
  return createSelector([getChallenge, getListings], (challenge, listings) => {
    let listingAddress;

    if (challenge) {
      listingAddress = challenge.listingAddress;
    }

    return listingAddress;
  });
};

export const makeGetListingExpiry = () => {
  return createSelector([getListingWrapper], listingWrapper => {
    return listingWrapper ? listingWrapper.expiry : undefined;
  });
};

export const makeGetChallengeState = () => {
  return createSelector([getChallenge], challengeData => {
    const challenge = challengeData && challengeData.challenge;
    const inChallengePhase = challenge && isChallengeInCommitStage(challenge);
    const inRevealPhase = challenge && isChallengeInRevealStage(challenge);
    const canResolveChallenge = challenge && getCanResolveChallenge(challenge);
    const isAwaitingAppealJudgment = challenge && challenge.appeal && isAppealAwaitingJudgment(challenge.appeal);
    const canAppealBeResolved = challenge && challenge.appeal && getCanAppealBeResolved(challenge.appeal);
    const isAwaitingAppealChallenge = challenge && challenge.appeal && getIsAwaitingAppealChallenge(challenge.appeal);

    return {
      inChallengePhase,
      inRevealPhase,
      canResolveChallenge,
      isAwaitingAppealJudgment,
      isAwaitingAppealChallenge,
      canAppealBeResolved,
    };
  });
};

export const makeGetListingPhaseState = () => {
  return createSelector([getListingWrapper], listing => {
    if (!listing) {
      return;
    }

    const listingData = listing.listing.data;
    const isInApplication = isInApplicationPhase(listingData);
    const canBeChallenged = canListingBeChallenged(listingData);
    const canBeWhitelisted = getCanBeWhitelisted(listingData);
    const inChallengePhase = listingData.challenge && isChallengeInCommitStage(listingData.challenge);
    const inRevealPhase = listingData.challenge && isChallengeInRevealStage(listingData.challenge);
    const isWhitelisted = listingData.isWhitelisted;
    const canResolveChallenge = listingData.challenge && getCanResolveChallenge(listingData.challenge);
    const isAwaitingAppealJudgment = getIsListingAwaitingAppealJudgement(listingData);

    return {
      isInApplication,
      canBeChallenged,
      canBeWhitelisted,
      canResolveChallenge,
      inChallengePhase,
      inRevealPhase,
      isWhitelisted,
      isAwaitingAppealJudgment,
    };
  });
};
