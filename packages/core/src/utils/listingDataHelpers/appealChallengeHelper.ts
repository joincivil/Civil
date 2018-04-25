import { isInCommitStage, isInRevealStage, isVotePassed } from "./pollHelper";
import { AppealChallengeData } from "../../types";

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
