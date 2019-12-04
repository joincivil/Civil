import { ListingData, BigNumber } from "@joincivil/typescript-types";
import { challengeHelpers } from "./challengeHelpers";
import { appealHelpers } from "./appealHelpers";
import { appealChallengeHelpers } from "./appealChallengeHelpers";
import { is0x0Address } from "../index";

export const listingHelpers = {
  getNextTimerExpiry,
  isWhitelisted,
  isInApplicationPhase,
  canListingBeChallenged,
  canBeWhitelisted,
  isInChallengedCommitVotePhase,
  isInChallengedRevealVotePhase,
  isAwaitingAppealRequest,
  canChallengeBeResolved,
  isListingAwaitingAppealJudgment,
  isListingAwaitingAppealChallenge,
  isInAppealChallengeCommitPhase,
  isInAppealChallengeRevealPhase,
  canListingAppealBeResolved,
  canListingAppealChallengeBeResolved,
};

/**
 * Gets the next expiration timer for the given listing, return 0 if not in an expiration timer stage
 * @param listing the ListingData to check
 */
function getNextTimerExpiry(listing: ListingData): number {
  if (isInApplicationPhase(listing)) {
    return listing.appExpiry.toNumber();
  } else if (isInChallengedCommitVotePhase(listing)) {
    return listing.challenge!.poll.commitEndDate.toNumber();
  } else if (isInChallengedRevealVotePhase(listing)) {
    return listing.challenge!.poll.revealEndDate.toNumber();
  } else if (isAwaitingAppealRequest(listing)) {
    return listing.challenge!.requestAppealExpiry.toNumber();
  } else if (isListingAwaitingAppealJudgment(listing)) {
    return listing.challenge!.appeal!.appealPhaseExpiry.toNumber();
  } else if (isListingAwaitingAppealChallenge(listing)) {
    return listing.challenge!.appeal!.appealOpenToChallengeExpiry.toNumber();
  } else if (isInAppealChallengeCommitPhase(listing)) {
    return listing.challenge!.appeal!.appealChallenge!.poll.commitEndDate.toNumber();
  } else if (isInAppealChallengeRevealPhase(listing)) {
    return listing.challenge!.appeal!.appealChallenge!.poll.revealEndDate.toNumber();
  }

  return 0;
}

function isWhitelisted(listingData: ListingData): boolean {
  return listingData.isWhitelisted;
}

/**
 * Checks if a listing is in unchallenged application phase
 * @param listingData the ListingData to check
 */
function isInApplicationPhase(listingData: ListingData): boolean {
  // if expiry time has passed
  if (new Date(listingData.appExpiry.toNumber() * 1000) < new Date()) {
    return false;
  }

  if (!new BigNumber(listingData.challengeID).isZero() || listingData.isWhitelisted) {
    return false;
  }

  return true;
}

/**
 * Checks if a listing can be challenged
 * @param listingData the ListingData to check
 */
function canListingBeChallenged(listingData: ListingData): boolean {
  if (isInApplicationPhase(listingData)) {
    return true;
  }
  if (listingData.isWhitelisted && !listingData.challenge) {
    return true;
  }
  return false;
}

/**
 * Checks if a listing can be whitelisted
 * @param listingData the ListingData to check
 */
function canBeWhitelisted(listingData: ListingData): boolean {
  if (new BigNumber(listingData.appExpiry).isZero()) {
    return false;
  }
  if (listingData.isWhitelisted) {
    return false;
  }
  // if expiry time has passed
  if (new Date(new BigNumber(listingData.appExpiry).toNumber() * 1000) < new Date()) {
    return new BigNumber(listingData.challengeID).isZero();
  }

  return false;
}

/**
 * Checks if a listing is in challenged commit vote phase
 * @param listingData the ListingData to check
 */
function isInChallengedCommitVotePhase(listingData: ListingData): boolean {
  if (listingData.challenge) {
    return challengeHelpers.isChallengeInCommitStage(listingData.challenge);
  } else {
    return false;
  }
}

/**
 * Checks if a listing is in challenged reveal vote phase
 * @param listingData the ListingData to check
 */
function isInChallengedRevealVotePhase(listingData: ListingData): boolean {
  if (listingData.challenge) {
    return challengeHelpers.isChallengeInRevealStage(listingData.challenge);
  } else {
    return false;
  }
}

/**
 * Checks if a listing is awaiting an appeal request
 * @param listingData the ListingData to check
 */
function isAwaitingAppealRequest(listingData: ListingData): boolean {
  if (listingData.challenge) {
    if (challengeHelpers.isChallengeInCommitStage(listingData.challenge)) {
      return false;
    } else if (challengeHelpers.isChallengeInRevealStage(listingData.challenge)) {
      return false;
    } else {
      const requestAppealExpiryDate = new Date(listingData.challenge.requestAppealExpiry.toNumber() * 1000);
      return (
        requestAppealExpiryDate > new Date() &&
        (!listingData.challenge!.appeal || is0x0Address(listingData.challenge!.appeal!.requester))
      );
    }
  } else {
    return false;
  }
}

/**
 * Checks if a Listing has a challenge that can be resolved
 * @param listingData the ListingData to check
 */
function canChallengeBeResolved(listingData: ListingData): boolean {
  const challenge = listingData.challenge;
  return challengeHelpers.canResolveChallenge(challenge!);
}

/**
 * Checks if a listing has an appeal that is awaiting judgment
 * @param listingData the ListingData to check
 */
function isListingAwaitingAppealJudgment(listingData: ListingData): boolean {
  if (listingData.challenge && listingData.challenge.appeal) {
    return appealHelpers.isAppealAwaitingJudgment(listingData.challenge.appeal);
  }
  return false;
}

/**
 * Checks if a listing has an appeal that is awaiting a challenge
 * @param listingData ListingData to check
 */
function isListingAwaitingAppealChallenge(listingData: ListingData): boolean {
  if (listingData.challenge) {
    if (listingData.challenge.appeal) {
      return appealHelpers.isAwaitingAppealChallenge(listingData.challenge.appeal);
    } else {
      return false;
    }
  } else {
    return false;
  }
}

/**
 * Checks if a listing is in appeal challenged commit vote phase
 * @param listingData the ListingData to check
 */
function isInAppealChallengeCommitPhase(listingData: ListingData): boolean {
  const challenge = listingData.challenge;
  if (challenge) {
    const appeal = challenge.appeal;
    if (appeal) {
      const appealChallenge = appeal.appealChallenge;
      if (appealChallenge) {
        return appealChallengeHelpers.isAppealChallengeInCommitStage(appealChallenge);
      }
    }
  }
  return false;
}

/**
 * Checks if a listing is in appeal challenged reveal vote phase
 * @param listingData the ListingData to check
 */
function isInAppealChallengeRevealPhase(listingData: ListingData): boolean {
  const challenge = listingData.challenge;
  if (challenge) {
    const appeal = challenge.appeal;
    if (appeal) {
      const appealChallenge = appeal.appealChallenge;
      if (appealChallenge) {
        return appealChallengeHelpers.isAppealChallengeInRevealStage(appealChallenge);
      }
    }
  }
  return false;
}

/**
 * Checks if a Listing has an appeal that can be resolved
 * @param listingData ListingData to check
 */
function canListingAppealBeResolved(listingData: ListingData): boolean {
  const challenge = listingData.challenge;
  if (challenge) {
    const appeal = challenge.appeal;
    if (appeal) {
      return appealHelpers.canAppealBeResolved(appeal);
    }
  }
  return false;
}

/**
 * Checks is a Listing has an appeal challenge that can be resolved
 * @param listingData ListingData to check
 */
function canListingAppealChallengeBeResolved(listingData: ListingData): boolean {
  const challenge = listingData.challenge;
  if (challenge) {
    const appeal = challenge.appeal;
    if (appeal && appeal.appealChallenge) {
      return appealChallengeHelpers.canAppealChallengeBeResolved(appeal.appealChallenge);
    }
  }
  return false;
}
