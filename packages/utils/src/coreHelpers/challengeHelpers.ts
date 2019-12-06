import { pollHelpers } from "./pollHelpers";
import { appealChallengeHelpers } from "./appealChallengeHelpers";
import { is0x0Address } from "../index";
import { BigNumber, ChallengeData, UserChallengeData } from "@joincivil/typescript-types";

export const challengeHelpers = {
  isChallengeInCommitStage,
  isChallengeInRevealStage,
  canRequestAppeal,
  didChallengeOriginallySucceed,
  didChallengeSucceed,
  canResolveChallenge,
  doesChallengeHaveAppeal,
  canCollectRewardOrRescue,
  isOriginalChallengeVoteOverturned,
  isUserWinner,
  canUserCollectReward,
  canRescueTokens,
};

/**
 * Checks if a Challenge is in the Commit stage
 * @param challengeData the ChallengeData to check
 */
function isChallengeInCommitStage(challengeData: ChallengeData): boolean {
  return pollHelpers.isInCommitStage(challengeData.poll);
}

/**
 * Checks if a Challenge is in the Reveal stage
 * @param challengeData the ChallengeData to check
 */
function isChallengeInRevealStage(challengeData: ChallengeData): boolean {
  return pollHelpers.isInRevealStage(challengeData.poll);
}

/**
 * Checks if an Appeal can be requested for this challenge
 * @param challengeData the ChallengeData to check
 */
function canRequestAppeal(challengeData: ChallengeData): boolean {
  if (isChallengeInCommitStage(challengeData)) {
    return false;
  } else if (isChallengeInRevealStage(challengeData)) {
    return false;
  } else {
    if (doesChallengeHaveAppeal(challengeData)) {
      return false;
    } else {
      return new BigNumber(challengeData.requestAppealExpiry).toNumber() > Date.now() / 1000;
    }
  }
}

/**
 * Checks if the originally Challenge succeeded, without taking appeal / appeal challenge into consideration
 * @param challengeData the ChallengeData to check
 */
function didChallengeOriginallySucceed(challengeData: ChallengeData): boolean {
  return !pollHelpers.isVotePassed(challengeData.poll);
}

/**
 * Checks if a Challenge succeeded
 * @param challengeData the ChallengeData to check
 */
function didChallengeSucceed(challengeData: ChallengeData): boolean {
  if (challengeData.appeal && challengeData.appeal.appealGranted) {
    if (
      challengeData.appeal.appealChallenge &&
      appealChallengeHelpers.didAppealChallengeSucceed(challengeData.appeal.appealChallenge)
    ) {
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
function canResolveChallenge(challengeData: ChallengeData): boolean {
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
function doesChallengeHaveAppeal(challengeData: ChallengeData): boolean {
  return challengeData.appeal! && !is0x0Address(challengeData!.appeal!.requester.toString());
}

function canCollectRewardOrRescue(challengeData: ChallengeData): boolean {
  return challengeData && challengeData.resolved;
}

function isOriginalChallengeVoteOverturned(challengeData: ChallengeData): boolean {
  if (challengeData.appeal) {
    if (challengeData.appeal.appealGranted) {
      if (challengeData.appeal.appealChallenge) {
        return !pollHelpers.isVotePassed(challengeData.appeal.appealChallenge.poll);
      }
      return true;
    }
  }
  return false;
}

function isUserWinner(challengeData: ChallengeData, userChallengeData: UserChallengeData): boolean {
  if (challengeData.resolved && userChallengeData.didUserReveal) {
    const isOverturned = isOriginalChallengeVoteOverturned(challengeData);
    const isWinner = userChallengeData.isVoterWinner;
    return (isWinner && !isOverturned) || (!isWinner && isOverturned);
  }
  return false;
}

function canUserCollectReward(challengeData: ChallengeData, userChallengeData: UserChallengeData): boolean {
  return isUserWinner(challengeData, userChallengeData) && !userChallengeData.didUserCollect;
}

function canRescueTokens(challengeData: ChallengeData, userChallengeData: UserChallengeData): boolean {
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
