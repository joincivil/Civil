import { Dispatch } from "react-redux";
import { multiSetParameters } from "../actionCreators/parameterizer";
import { getParameterValues } from "../apis/civilTCR";

export async function initializeParameterizer(dispatch: Dispatch<any>): Promise<void> {
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

  const parameterVals = await getParameterValues(paramKeys);
  const paramObj = parameterVals.reduce((acc, item, index) => {
    acc[paramKeys[index]] = item.toString();
    return acc;
  }, {});

  dispatch(multiSetParameters(paramObj));
}
