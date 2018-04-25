import { AppealData } from "../../types";
import { isAppealChallengeInCommitStage, isAppealChallengeInRevealStage } from "./appealChallengeHelper";
import { is0x0Address } from "../../contracts/utils/contracts";

/**
 * Checks if an appeal can be resolved
 * @param appealData AppealData to check
 */
export function canAppealBeResolved(appealData: AppealData): boolean {
  if (is0x0Address(appealData.requester)) {
    return false;
  } else if (appealData.appealChallenge) {
    // appeal challenge voting must be over (meaning commit & reveal stages are done)
    const inCommit = isAppealChallengeInCommitStage(appealData.appealChallenge);
    const inReveal = isAppealChallengeInRevealStage(appealData.appealChallenge);
    return !inCommit && !inReveal;
  } else {
    // appeal challenge request phase must be over
    const appealOpenToChallengeExpiryDate = new Date(appealData.appealOpenToChallengeExpiry.toNumber() * 1000);
    return appealOpenToChallengeExpiryDate < new Date();
  }
}

/**
 * Checks if an appeal is waiting to be challenged
 * @param appealData AppealData to check
 */
export function isAwaitingAppealChallenge(appealData: AppealData): boolean {
  if (!appealData.appealGranted) {
    return false;
  }
  if (!appealData.appealChallengeID.isZero()) {
    return false;
  } else {
    const appealOpenToChallengeExpiryDate = new Date(appealData.appealOpenToChallengeExpiry.toNumber() * 1000);
    return appealOpenToChallengeExpiryDate > new Date();
  }
}
