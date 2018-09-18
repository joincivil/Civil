import { Parameters, GovernmentParameters } from "@joincivil/utils";

export const amountParams: string[] = [Parameters.minDeposit, Parameters.pMinDeposit, GovernmentParameters.appealFee];

export const durationParams: string[] = [
  Parameters.applyStageLen,
  Parameters.pApplyStageLen,
  Parameters.commitStageLen,
  Parameters.pCommitStageLen,
  Parameters.revealStageLen,
  Parameters.pRevealStageLen,
  Parameters.pProcessBy,
  Parameters.challengeAppealLen,
  Parameters.challengeAppealCommitLen,
  Parameters.challengeAppealRevealLen,
  GovernmentParameters.requestAppealLen,
  GovernmentParameters.judgeAppealLen,
];

export const percentParams: string[] = [
  Parameters.dispensationPct,
  Parameters.pDispensationPct,
  Parameters.voteQuorum,
  Parameters.pVoteQuorum,
  GovernmentParameters.appealVotePercentage,
];
