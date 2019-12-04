import { pollHelpers } from "./pollHelpers";
import { ParamPropChallengeData, UserChallengeData } from "@joincivil/typescript-types";
import { is0x0Address } from "../index";

export const paramPropChallengeHelpers = {
  isParamPropChallengeInCommitStage,
  isParamPropChallengeInRevealStage,
  didParamPropChallengeSucceed,
  canParamPropChallengeBeResolved,
  isUserParamPropChallengeWinner,
  canUserCollectParamPropChallengeReward,
  canRescueParamPropChallengeTokens,
};

/**
 * Checks in an Param Proposal is in the Commit stage
 * @param challengeData the ParamPropChallengeData to check
 */
function isParamPropChallengeInCommitStage(challengeData: ParamPropChallengeData): boolean {
  return pollHelpers.isInCommitStage(challengeData.poll);
}

/**
 * Checks in an Param Proposal is in the Reveal stage
 * @param challengeData the ParamPropChallengeData to check
 */
function isParamPropChallengeInRevealStage(challengeData: ParamPropChallengeData): boolean {
  return pollHelpers.isInRevealStage(challengeData.poll);
}

/**
 * Checks in an Param Proposal succeeded
 * @param challengeData the ParamPropChallengeData to check
 */
function didParamPropChallengeSucceed(challengeData: ParamPropChallengeData): boolean {
  return !pollHelpers.isVotePassed(challengeData.poll);
}

function canParamPropChallengeBeResolved(challengeData: ParamPropChallengeData): boolean {
  return (
    !is0x0Address(challengeData.challenger) &&
    !isParamPropChallengeInCommitStage(challengeData) &&
    !isParamPropChallengeInRevealStage(challengeData) &&
    !challengeData.resolved
  );
}

function isUserParamPropChallengeWinner(
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

function canUserCollectParamPropChallengeReward(
  challengeData: ParamPropChallengeData,
  userChallengeData: UserChallengeData,
): boolean {
  return isUserParamPropChallengeWinner(challengeData, userChallengeData) && !userChallengeData.didUserCollect;
}

function canRescueParamPropChallengeTokens(
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
