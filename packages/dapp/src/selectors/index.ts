import { createSelector } from "reselect";
import { State } from "../reducers";
import { Map } from "immutable";
import {
  canListingBeChallenged,
  EthAddress,
  isInApplicationPhase,
  isChallengeInCommitStage,
  isChallengeInRevealStage,
  ListingWrapper,
  WrappedChallengeData,
} from "@joincivil/core";

// @TODO(jon): Export this in reducers?
import { ListingWrapperWithExpiry } from "../reducers/listings";

export interface ListingContainerProps {
  listingAddress?: EthAddress;
}

export interface ChallengeContainerProps {
  challengeID?: string;
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
  if (!props.challengeID) {
    return;
  }
  const challenges = state.networkDependent.challenges;
  const challenge: WrappedChallengeData = challenges.get(props.challengeID);
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

export const makeGetListingPhaseState = () => {
  return createSelector([getListingWrapper], listing => {
    if (!listing) {
      return;
    }

    const listingData = listing.listing.data;
    const isInApplication = isInApplicationPhase(listingData);
    const canBeChallenged = canListingBeChallenged(listingData);
    const inChallengePhase = listingData.challenge && isChallengeInCommitStage(listingData.challenge);
    const inRevealPhase = listingData.challenge && isChallengeInRevealStage(listingData.challenge);

    return {
      isInApplication,
      canBeChallenged,
      inChallengePhase,
      inRevealPhase,
    };
  });
};
