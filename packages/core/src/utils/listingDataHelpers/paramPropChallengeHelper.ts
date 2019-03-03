import { isInCommitStage, isInRevealStage, isVotePassed } from "./pollHelper";
import { ParamPropChallengeData, UserChallengeData } from "../../types";
import { is0x0Address } from "@joincivil/utils";

/**
 * Checks in an Param Proposal is in the Commit stage
 * @param challengeData the ParamPropChallengeData to check
 */
export function isParamPropChallengeInCommitStage(challengeData: ParamPropChallengeData): boolean {
  return isInCommitStage(challengeData.poll);
}

/**
 * Checks in an Param Proposal is in the Reveal stage
 * @param challengeData the ParamPropChallengeData to check
 */
export function isParamPropChallengeInRevealStage(challengeData: ParamPropChallengeData): boolean {
  return isInRevealStage(challengeData.poll);
}

/**
 * Checks in an Param Proposal succeeded
 * @param challengeData the ParamPropChallengeData to check
 */
export function didParamPropChallengeSucceed(challengeData: ParamPropChallengeData): boolean {
  return isVotePassed(challengeData.poll);
}

export function canParamPropChallengeBeResolved(challengeData: ParamPropChallengeData): boolean {
  return (
    !is0x0Address(challengeData.challenger) &&
    !isParamPropChallengeInCommitStage(challengeData) &&
    !isParamPropChallengeInRevealStage(challengeData) &&
    !challengeData.resolved
  );
}

export function isUserParamPropChallengeWinner(
  challengeData: ParamPropChallengeData,
  userChallengeData: UserChallengeData,
): boolean {
  if (challengeData.resolved && userChallengeData.didUserReveal) {
    if (userChallengeData.isVoterWinner) {
      return true;
    }
  }
  return false;
}

export function canUserCollectParamPropChallengeReward(
  challengeData: ParamPropChallengeData,
  userChallengeData: UserChallengeData,
): boolean {
  return isUserParamPropChallengeWinner(challengeData, userChallengeData) && !userChallengeData.didUserCollect;
}

export function canRescueParamPropChallengeTokens(
  challengeData: ParamPropChallengeData,
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
