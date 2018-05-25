import { Dispatch } from "react-redux";
import { addOrUpdateProposal, multiSetParameters } from "../actionCreators/parameterizer";
import { getParameterValues } from "../apis/civilTCR";
import { getTCR } from "./civilInstance";
import { Observable } from "rxjs";

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

export async function initializeProposalsSubscriptions(dispatch: Dispatch<any>): Promise<void> {
  const tcr = getTCR();
  const parameterizer = await tcr.getParameterizer();
  await Observable.merge(
    parameterizer.propIDsInApplicationPhase(),
    parameterizer.propIDsInChallengeCommitPhase(),
    parameterizer.propIDsInChallengeRevealPhase(),
    parameterizer.propIDsToProcess(),
    parameterizer.propIDsForResolvedChallenges(),
  ).subscribe(async (propID: string) => {
    const paramName = await parameterizer.getPropName(propID);
    const propValue = await parameterizer.getPropValue(propID);
    const propState = await parameterizer.getPropState(propID);
    const challengeID = await parameterizer.getChallengeID(propID);
    const applicationExpiry = await parameterizer.getPropApplicationExpiry(propID);
    const challengeCommitExpiry = !challengeID.isZero()
      ? await parameterizer.getPropChallengeCommitExpiry(propID)
      : undefined;
    const challengeRevealExpiry = !challengeID.isZero()
      ? await parameterizer.getPropChallengeRevealExpiry(propID)
      : undefined;
    const propProcessByExpiry = await parameterizer.getPropProcessBy(propID);
    dispatch(
      addOrUpdateProposal({
        id: propID,
        paramName,
        propValue,
        state: propState,
        applicationExpiry,
        propProcessByExpiry,
        challenge: {
          id: challengeID,
          challengeCommitExpiry,
          challengeRevealExpiry,
        },
      }),
    );
  });
}
