import { appealChallengeHelpers } from "./appealChallengeHelpers";
import { is0x0Address } from "../index";
import { BigNumber, AppealData } from "@joincivil/typescript-types";

export const appealHelpers = {
  canAppealBeResolved,
  isAwaitingAppealChallenge,
  isAppealAwaitingJudgment,
};

/**
 * Checks if an appeal can be resolved
 * @param appealData AppealData to check
 */
function canAppealBeResolved(appealData: AppealData): boolean {
  if (is0x0Address(appealData.requester)) {
    return false;
  } else if (appealData.appealChallenge && !is0x0Address(appealData.appealChallenge.challenger)) {
    // appeal challenge voting must be over (meaning commit & reveal stages are done)
    const inCommit = appealChallengeHelpers.isAppealChallengeInCommitStage(appealData.appealChallenge);
    const inReveal = appealChallengeHelpers.isAppealChallengeInRevealStage(appealData.appealChallenge);
    return !inCommit && !inReveal && !appealData.appealChallenge!.resolved;
  } else if (appealData.appealGranted) {
    // appeal challenge request phase must be over
    const appealOpenToChallengeExpiryDate = new Date(
      new BigNumber(appealData.appealOpenToChallengeExpiry).toNumber() * 1000,
    );
    return appealOpenToChallengeExpiryDate < new Date();
  } else {
    const judgmentExpiry = new Date(new BigNumber(appealData.appealPhaseExpiry).toNumber() * 1000);
    return judgmentExpiry < new Date();
  }
}

/**
 * Checks if an appeal is waiting to be challenged
 * @param appealData AppealData to check
 */
function isAwaitingAppealChallenge(appealData: AppealData): boolean {
  if (!appealData.appealGranted) {
    return false;
  }
  if (!new BigNumber(appealData.appealChallengeID).isZero()) {
    return false;
  } else {
    const appealOpenToChallengeExpiryDate = new Date(
      new BigNumber(appealData.appealOpenToChallengeExpiry).toNumber() * 1000,
    );
    return appealOpenToChallengeExpiryDate > new Date();
  }
}

function isAppealAwaitingJudgment(appealData: AppealData): boolean {
  if (appealData.appealGranted) {
    return false;
  } else {
    const appealExpiryDate = new Date(new BigNumber(appealData.appealPhaseExpiry).toNumber() * 1000);
    return appealExpiryDate > new Date();
  }
}
