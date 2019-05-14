import { isInCommitStage, isInRevealStage, isVotePassed } from "./pollHelper";
import { didAppealChallengeSucceed } from "./appealChallengeHelper";
import { is0x0Address } from "@joincivil/utils";
import { ChallengeData, UserChallengeData } from "../../types";

/**
 * Checks if a Challenge is in the Commit stage
 * @param challengeData the ChallengeData to check
 */
export function isChallengeInCommitStage(challengeData: ChallengeData): boolean {
  return isInCommitStage(challengeData.poll);
}

/**
 * Checks if a Challenge is in the Reveal stage
 * @param challengeData the ChallengeData to check
 */
export function isChallengeInRevealStage(challengeData: ChallengeData): boolean {
  return isInRevealStage(challengeData.poll);
}

/**
 * Checks if an Appeal can be requested for this challenge
 * @param challengeData the ChallengeData to check
 */
export function canRequestAppeal(challengeData: ChallengeData): boolean {
  if (isChallengeInCommitStage(challengeData)) {
    return false;
  } else if (isChallengeInRevealStage(challengeData)) {
    return false;
  } else {
    if (doesChallengeHaveAppeal(challengeData)) {
      return false;
    } else {
      return challengeData.requestAppealExpiry.toNumber() > Date.now() / 1000;
    }
  }
}

/**
 * Checks if the originally Challenge succeeded, without taking appeal / appeal challenge into consideration
 * @param challengeData the ChallengeData to check
 */
export function didChallengeOriginallySucceed(challengeData: ChallengeData): boolean {
  return !isVotePassed(challengeData.poll);
}

/**
 * Checks if a Challenge succeeded
 * @param challengeData the ChallengeData to check
 */
export function didChallengeSucceed(challengeData: ChallengeData): boolean {
  if (challengeData.appeal && challengeData.appeal.appealGranted) {
    if (challengeData.appeal.appealChallenge && didAppealChallengeSucceed(challengeData.appeal.appealChallenge)) {
      return didChallengeOriginallySucceed(challengeData);
    } else {
      return !didChallengeOriginallySucceed(challengeData);
    }
  } else {
    return didChallengeOriginallySucceed(challengeData);
  }
}

/**
 * Checks if a Challenge has no actionable active phase and can be resolved*
 * @param challengeData this ChallengeData to check
 */
export function canResolveChallenge(challengeData: ChallengeData): boolean {
  return (
    challengeData &&
    !challengeData.resolved &&
    !isChallengeInCommitStage(challengeData) &&
    !isChallengeInRevealStage(challengeData) &&
    !canRequestAppeal(challengeData) &&
    !doesChallengeHaveAppeal(challengeData)
  );
}

/**
 * Checks if a Challenge has an active appeal
 * @param challengeData this ChallengeData to check
 */
export function doesChallengeHaveAppeal(challengeData: ChallengeData): boolean {
  return challengeData.appeal! && !is0x0Address(challengeData!.appeal!.requester.toString());
}

export function canCollectRewardOrRescue(challengeData: ChallengeData): boolean {
  return challengeData && challengeData.resolved;
}

export function isOriginalChallengeVoteOverturned(challengeData: ChallengeData): boolean {
  if (challengeData.appeal) {
    if (challengeData.appeal.appealGranted) {
      if (challengeData.appeal.appealChallenge) {
        const isVotePassed2 = isVotePassed(challengeData.appeal.appealChallenge.poll);
        if (isVotePassed2) {
          return false;
        }
      }
      return true;
    }
  }
  return false;
}

export function isUserWinner(challengeData: ChallengeData, userChallengeData: UserChallengeData): boolean {
  if (challengeData.resolved && userChallengeData.didUserReveal) {
    const isOverturned = isOriginalChallengeVoteOverturned(challengeData);
    const isWinner = userChallengeData.isVoterWinner;
    return (isWinner && !isOverturned) || (!isWinner && isOverturned);
  }
  return false;
}

export function canUserCollectReward(challengeData: ChallengeData, userChallengeData: UserChallengeData): boolean {
  return isUserWinner(challengeData, userChallengeData) && !userChallengeData.didUserCollect;
}

export function canRescueTokens(challengeData: ChallengeData, userChallengeData: UserChallengeData): boolean {
  if (
    challengeData.resolved &&
    userChallengeData.didUserCommit &&
    !userChallengeData.didUserReveal &&
    !userChallengeData.didUserRescue
  ) {
    return true;
  }
  return false;
}
