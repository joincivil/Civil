import { Dispatch } from "react-redux";
import { Observable } from "rxjs";
import { ParamProposalState } from "@joincivil/core";
import { Parameters } from "@joincivil/utils";
import {
  addOrUpdateProposal,
  checkAndUpdateParameterProposalState,
  multiSetParameters,
  addChallengeToPropMapping,
} from "../redux/actionCreators/parameterizer";
import { getParameterValues } from "../apis/civilTCR";
import { getTCR } from "./civilInstance";

const paramProposalTimeouts = new Map<string, number>();
const setTimeoutTimeouts = new Map<string, number>();

export async function initializeParameterizer(dispatch: Dispatch<any>): Promise<void> {
  const paramKeys: string[] = Object.values(Parameters);
  const parameterVals = await getParameterValues(paramKeys);
  const paramObj = parameterVals.reduce((acc, item, index) => {
    acc[paramKeys[index]] = item.toString();
    return acc;
  }, {});

  dispatch(multiSetParameters(paramObj));
}

export async function initializeProposalsSubscriptions(dispatch: Dispatch<any>): Promise<void> {
  const tcr = await getTCR();
  const parameterizer = await tcr.getParameterizer();
  await Observable.merge(
    parameterizer.propIDsInApplicationPhase(),
    parameterizer.propIDsInChallengeCommitPhase(),
    parameterizer.propIDsInChallengeRevealPhase(),
    parameterizer.propIDsToProcess(),
    parameterizer.propIDsForResolvedChallenges(),
  ).subscribe(async (propID: string) => {
    const paramName = await parameterizer.getPropName(propID);
    if (!paramName || !paramName.length) {
      return;
    }
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
    const paramProposal = {
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
    };
    await setupParamProposalCallback(paramProposal, true, dispatch);
    dispatch(addOrUpdateProposal(paramProposal));
    if (!challengeID.isZero()) {
      dispatch(addChallengeToPropMapping(challengeID.toString(), propID));
    }
  });
}

async function getNextTimerExpiry(paramProposal: any, dispatch: Dispatch<any>): Promise<number> {
  let nextExpiry;

  switch (paramProposal.state) {
    case ParamProposalState.APPLYING:
      nextExpiry = paramProposal.applicationExpiry.valueOf();
      break;
    case ParamProposalState.CHALLENGED_IN_COMMIT_VOTE_PHASE:
      nextExpiry = paramProposal.challenge.challengeCommitExpiry.valueOf();
      break;
    case ParamProposalState.CHALLENGED_IN_REVEAL_VOTE_PHASE:
      nextExpiry = paramProposal.challenge.challengeRevealExpiry.valueOf();
      break;
    case ParamProposalState.READY_TO_PROCESS:
      nextExpiry = paramProposal.propProcessByExpiry.valueOf();
      break;
    case ParamProposalState.READY_TO_RESOLVE_CHALLENGE:
      nextExpiry = paramProposal.propProcessByExpiry.valueOf();
      break;
    default:
      nextExpiry = 0;
  }

  return nextExpiry;
}

async function setupParamProposalCallback(paramProposal: any, isInit: boolean, dispatch: Dispatch<any>): Promise<void> {
  if (paramProposalTimeouts.get(paramProposal.id)) {
    clearTimeout(paramProposalTimeouts.get(paramProposal.id));
    paramProposalTimeouts.delete(paramProposal.id);
  }

  if (setTimeoutTimeouts.get(paramProposal.id)) {
    clearTimeout(setTimeoutTimeouts.get(paramProposal.id));
    setTimeoutTimeouts.delete(paramProposal.id);
  }

  const now = Date.now();
  const nextExpiry = await getNextTimerExpiry(paramProposal, dispatch);
  const delay = nextExpiry - now;
  if (delay > 0) {
    paramProposalTimeouts.set(
      paramProposal.id,
      setTimeout(dispatch, delay, checkAndUpdateParameterProposalState(paramProposal.id)),
    );
    setTimeoutTimeouts.set(
      paramProposal.id,
      setTimeout(setupParamProposalCallback, delay, paramProposal, false, dispatch),
    );
  }
}
