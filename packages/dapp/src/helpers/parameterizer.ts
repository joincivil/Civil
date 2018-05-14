import { Dispatch } from "redux";
import { setParameter } from "../actionCreators/parameterizer";
import { getParameterValue } from "../apis/civilTCR";

export async function initializeParameterizer(dispatch: Dispatch): Promise<void> {
  const paramKeys = [
    "minDeposit",
    "pMinDeposit",
    "applyStageLen",
    "pApplyStageLen",
    "commitStageLen",
    "pCommitStageLen",
    "revealStageLen",
    "pRevealStageLen",
    "dispensationPct",
    "pDispensationPct",
    "voteQuorum",
    "pVoteQuorum",
    "pProcessBy",
    "challengeAppealLen",
    "challengeAppealCommitLen",
    "challengeAppealRevealLen",
  ];
  await paramKeys.forEach(async paramKey => {
    const paramVal = await getParameterValue(paramKey)
    dispatch(setParameter(paramKey, paramVal));
  });
}
