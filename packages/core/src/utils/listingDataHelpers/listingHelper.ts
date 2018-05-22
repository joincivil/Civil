import { ListingData } from "../../types";
import { isChallengeInCommitStage, isChallengeInRevealStage, canResolveChallenge } from "./challengeHelper";
import { isAwaitingAppealChallenge, canAppealBeResolved } from "./appealHelper";
import { isAppealChallengeInCommitStage, isAppealChallengeInRevealStage } from "./appealChallengeHelper";

export function isWhitelisted(listingData: ListingData): boolean {
  return listingData.isWhitelisted;
}

/**
 * Checks if a listing is in unchallenged application phase
 * @param listingData the ListingData to check
 */
export function isInApplicationPhase(listingData: ListingData): boolean {
  // if expiry time has passed
  if (new Date(listingData.appExpiry.toNumber() * 1000) < new Date()) {
    return false;
  }

  if (!listingData.challengeID.isZero()) {
    return false;
  }

  return true;
}

/**
 * Checks if a listing can be challenged
 * @param listingData the ListingData to check
 */
export function canListingBeChallenged(listingData: ListingData): boolean {
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
export function canBeWhitelisted(listingData: ListingData): boolean {
  if (listingData.appExpiry.isZero()) {
    return false;
  }
  if (listingData.isWhitelisted) {
    return false;
  }
  // if expiry time has passed
  if (new Date(listingData.appExpiry.toNumber() * 1000) < new Date()) {
    return listingData.challengeID.isZero();
  }

  return false;
}

/**
 * Checks if a listing is in challenged commit vote phase
 * @param listingData the ListingData to check
 */
export function isInChallengedCommitVotePhase(listingData: ListingData): boolean {
  if (listingData.challenge) {
    return isChallengeInCommitStage(listingData.challenge);
  } else {
    return false;
  }
}

/**
 * Checks if a listing is in challenged reveal vote phase
 * @param listingData the ListingData to check
 */
export function isInChallengedRevealVotePhase(listingData: ListingData): boolean {
  if (listingData.challenge) {
    return isChallengeInRevealStage(listingData.challenge);
  } else {
    return false;
  }
}

/**
 * Checks if a listing is awaiting an appeal request
 * @param listingData the ListingData to check
 */
export function isAwaitingAppealRequest(listingData: ListingData): boolean {
  if (listingData.challenge) {
    if (isChallengeInCommitStage(listingData.challenge)) {
      return false;
    } else if (isChallengeInRevealStage(listingData.challenge)) {
      return false;
    } else {
      const requestAppealExpiryDate = new Date(listingData.challenge.requestAppealExpiry.toNumber() * 1000);
      return requestAppealExpiryDate > new Date();
    }
  } else {
    return false;
  }
}

/**
 * Checks if a Listing has a challenge that can be resolved
 * @param listingData the ListingData to check
 */
export function canChallengeBeResolved(listingData: ListingData): boolean {
  const challenge = listingData.challenge;
  return canResolveChallenge(challenge!);
}

/**
 * Checks if a listing has an appeal that is awaiting judgment
 * @param listingData the ListingData to check
 */
export function isAwaitingAppealJudgment(listingData: ListingData): boolean {
  if (listingData.challenge) {
    if (listingData.challenge.appeal) {
      if (listingData.challenge.appeal.appealGranted) {
        return false;
      } else {
        const appealExpiryDate = new Date(listingData.challenge.appeal.appealPhaseExpiry.toNumber() * 1000);
        return appealExpiryDate > new Date();
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}

/**
 * Checks if a listing has an appeal that is awaiting a challenge
 * @param listingData ListingData to check
 */
export function isListingAwaitingAppealChallenge(listingData: ListingData): boolean {
  if (listingData.challenge) {
    if (listingData.challenge.appeal) {
      return isAwaitingAppealChallenge(listingData.challenge.appeal);
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
export function isListingInAppealChallengeCommitPhase(listingData: ListingData): boolean {
  const challenge = listingData.challenge;
  if (challenge) {
    const appeal = challenge.appeal;
    if (appeal) {
      const appealChallenge = appeal.appealChallenge;
      if (appealChallenge) {
        return isAppealChallengeInCommitStage(appealChallenge);
      }
    }
  }
  return false;
}

/**
 * Checks if a listing is in appeal challenged reveal vote phase
 * @param listingData the ListingData to check
 */
export function isInAppealChallengeRevealPhase(listingData: ListingData): boolean {
  const challenge = listingData.challenge;
  if (challenge) {
    const appeal = challenge.appeal;
    if (appeal) {
      const appealChallenge = appeal.appealChallenge;
      if (appealChallenge) {
        return isAppealChallengeInRevealStage(appealChallenge);
      }
    }
  }
  return false;
}

/**
 * Checks if a Listing has an appeal that can be resolved
 * @param listingData ListingData to check
 */
export function canListingAppealBeResolved(listingData: ListingData): boolean {
  const challenge = listingData.challenge;
  if (challenge) {
    const appeal = challenge.appeal;
    if (appeal) {
      return canAppealBeResolved(appeal);
    }
  }
  return false;
}
