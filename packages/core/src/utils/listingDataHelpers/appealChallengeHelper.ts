import { isInCommitStage, isInRevealStage, isVotePassed } from "./pollHelper";
import { AppealChallengeData, UserChallengeData } from "../../types";
import { is0x0Address } from "@joincivil/utils";

/**
 * Checks in an Appeal Challenge is in the Commit stage
 * @param challengeData the AppealChallengeData to check
 */
export function isAppealChallengeInCommitStage(challengeData: AppealChallengeData): boolean {
  return isInCommitStage(challengeData.poll);
}

/**
 * Checks in an Appeal Challenge is in the Reveal stage
 * @param challengeData the AppealChallengeData to check
 */
export function isAppealChallengeInRevealStage(challengeData: AppealChallengeData): boolean {
  return isInRevealStage(challengeData.poll);
}

/**
 * Checks in an Appeal Challenge succeeded
 * @param challengeData the AppealChallengeData to check
 */
export function didAppealChallengeSucceed(challengeData: AppealChallengeData): boolean {
  return isVotePassed(challengeData.poll);
}

export function canAppealChallengeBeResolved(challengeData: AppealChallengeData): boolean {
  return (
    !is0x0Address(challengeData.challenger) &&
    !isAppealChallengeInCommitStage(challengeData) &&
    !isAppealChallengeInRevealStage(challengeData) &&
    !challengeData.resolved
  );
}

export function isUserAppealChallengeWinner(
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

export function canUserCollectAppealChallengeReward(
  challengeData: AppealChallengeData,
  userChallengeData: UserChallengeData,
): boolean {
  return isUserAppealChallengeWinner(challengeData, userChallengeData) && !userChallengeData.didUserCollect;
}

export function canRescueAppealChallengeTokens(
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
