import { isInCommitStage, isInRevealStage, isVotePassed } from "./pollHelper";
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
 * Checks if a Challenge succeeded
 * @param challengeData the ChallengeData to check
 */
export function didChallengeSucceed(challengeData: ChallengeData): boolean {
  if (challengeData.appeal && challengeData.appeal.appealGranted) {
    if (challengeData.appeal.appealChallenge && isVotePassed(challengeData.appeal.appealChallenge.poll)) {
      return isVotePassed(challengeData.poll);
    } else {
      return !isVotePassed(challengeData.poll);
    }
  } else {
    return isVotePassed(challengeData.poll);
  }
}

/**
 * Checks if the originally Challenge succeeded, without taking appeal / appeal challenge into consideration
 * @param challengeData the ChallengeData to check
 */
export function didChallengeOriginallySucceed(challengeData: ChallengeData): boolean {
  return isVotePassed(challengeData.poll);
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
      console.log("appeal granted");
      if (challengeData.appeal.appealChallenge) {
        console.log("appeal challenged. appealChallenge: ", challengeData.appeal.appealChallenge);
        const isVotePassed2 = isVotePassed(challengeData.appeal.appealChallenge.poll);
        console.log("isVotePassed: ", isVotePassed2);
        if (isVotePassed2) {
          return false;
        }
      }
      console.log("isoverturned return true 1");
      return true;
    }
  }
  console.log("isoverturned return false 1");
  return false;
}

export function isUserWinner(challengeData: ChallengeData, userChallengeData: UserChallengeData): boolean {
  if (challengeData.resolved && userChallengeData.didUserReveal) {
    console.log("is resolved and revealed.");
    const isOverturned = isOriginalChallengeVoteOverturned(challengeData);
    console.log("isOverturned: ", isOverturned);
    const isWinner = userChallengeData.isVoterWinner;
    return (isWinner && !isOverturned) || (!isWinner && isOverturned);
  }
  return false;
}

export function canUserCollectReward(challengeData: ChallengeData, userChallengeData: UserChallengeData): boolean {
  console.log("canUserCollectReward challengeData: ", challengeData);
  console.log("canUserCollectReward userChallengeData: ", userChallengeData);
  const isWinner = isUserWinner(challengeData, userChallengeData);
  const didCollect = userChallengeData.didUserCollect;

  console.log("canUserCollectReward isWinner: ", isWinner);
  console.log("canUserCollectReward didCollect: ", didCollect);
  return isWinner && !didCollect;
  // return isUserWinner(challengeData, userChallengeData) && !userChallengeData.didUserCollect;
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
