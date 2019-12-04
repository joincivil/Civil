import { pollHelpers } from "./pollHelpers";
import { AppealChallengeData, UserChallengeData } from "@joincivil/typescript-types";
import { is0x0Address } from "../index";

export const appealChallengeHelpers = {
  isAppealChallengeInCommitStage,
  isAppealChallengeInRevealStage,
  didAppealChallengeSucceed,
  canAppealChallengeBeResolved,
  isUserAppealChallengeWinner,
  canUserCollectAppealChallengeReward,
  canRescueAppealChallengeTokens,
};

/**
 * Checks in an Appeal Challenge is in the Commit stage
 * @param challengeData the AppealChallengeData to check
 */
function isAppealChallengeInCommitStage(challengeData: AppealChallengeData): boolean {
  return pollHelpers.isInCommitStage(challengeData.poll);
}

/**
 * Checks in an Appeal Challenge is in the Reveal stage
 * @param challengeData the AppealChallengeData to check
 */
function isAppealChallengeInRevealStage(challengeData: AppealChallengeData): boolean {
  return pollHelpers.isInRevealStage(challengeData.poll);
}

/**
 * Checks in an Appeal Challenge succeeded
 * @param challengeData the AppealChallengeData to check
 */
function didAppealChallengeSucceed(challengeData: AppealChallengeData): boolean {
  return pollHelpers.isVotePassed(challengeData.poll);
}

function canAppealChallengeBeResolved(challengeData: AppealChallengeData): boolean {
  return (
    !is0x0Address(challengeData.challenger) &&
    !isAppealChallengeInCommitStage(challengeData) &&
    !isAppealChallengeInRevealStage(challengeData) &&
    !challengeData.resolved
  );
}

function isUserAppealChallengeWinner(
  challengeData: AppealChallengeData,
  userChallengeData: UserChallengeData,
): boolean {
  if (challengeData.resolved && userChallengeData.didUserReveal) {
    if (userChallengeData.isVoterWinner) {
      return true;
    }
  }
  return false;
}

function canUserCollectAppealChallengeReward(
  challengeData: AppealChallengeData,
  userChallengeData: UserChallengeData,
): boolean {
  return isUserAppealChallengeWinner(challengeData, userChallengeData) && !userChallengeData.didUserCollect;
}

function canRescueAppealChallengeTokens(
  challengeData: AppealChallengeData,
  userChallengeData: UserChallengeData,
): boolean {
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
