import { Param, ParamProposalState } from "@joincivil/core";
import { Dispatch } from "react-redux";
import { GovernmentParameters } from "@joincivil/utils";
import {
  multiSetGovtParameters,
  setGovernmentParameter,
  setConstitutionData,
  setAppellate,
  setController,
  setAppellateMembers,
  addCouncilMultisigTransaction,
  addOrUpdateGovtProposal,
  checkAndUpdateGovtParameterProposalState,
} from "../redux/actionCreators/government";
import { getGovernmentParameters } from "../apis/civilTCR";
import { getCivil, getTCR } from "./civilInstance";
import { MultisigTransaction } from "@joincivil/core/build/src/contracts/multisig/multisigtransaction";
import { Observable } from "rxjs";

const paramProposalTimeouts = new Map<string, number>();
const setTimeoutTimeouts = new Map<string, number>();

export async function initializeGovernment(dispatch: Dispatch<any>): Promise<void> {
  const paramKeys: string[] = Object.values(GovernmentParameters);
  const parameterVals = await getGovernmentParameters(paramKeys);
  const paramObj = parameterVals.reduce((acc, item, index) => {
    acc[paramKeys[index]] = item.toString();
    return acc;
  }, {});

  dispatch(multiSetGovtParameters(paramObj));
}

export async function initializeGovernmentParamSubscription(dispatch: Dispatch<any>): Promise<void> {
  const tcr = await getTCR();
  const civil = getCivil();
  const current = await civil.currentBlock();
  const govt = await tcr.getGovernment();
  const appellate = await govt.getAppellate();
  console.log("appellate: ", appellate);
  govt.getParameterSet(current).subscribe(async (p: Param) => {
    dispatch(setGovernmentParameter(p.paramName, p.value));
  });
}

export async function initializeGovtProposalsSubscriptions(dispatch: Dispatch<any>): Promise<void> {
  const tcr = await getTCR();
  const government = await tcr.getGovernment();
  await Observable.merge(
    government.propIDsInCommitPhase(),
    government.propIDsInRevealPhase(),
    government.propIDsToProcess(),
  ).subscribe(async (propID: string) => {
    const paramName = await government.getPropName(propID);
    if (!paramName || !paramName.length) {
      return;
    }
    const propValue = await government.getPropValue(propID);
    const propState = await government.getPropState(propID);
    const challengeID = await government.getChallengeID(propID);
    const challengeCommitExpiry = !challengeID.isZero() ? await government.getPropCommitExpiry(propID) : undefined;
    const challengeRevealExpiry = !challengeID.isZero() ? await government.getPropRevealExpiry(propID) : undefined;
    const propProcessByExpiry = await government.getPropProcessBy(propID);

    const paramProposal = {
      id: propID,
      paramName,
      propValue,
      state: propState,
      propProcessByExpiry,
      challenge: {
        id: challengeID,
        challengeCommitExpiry,
        challengeRevealExpiry,
      },
    };
    await setupGovtParamProposalCallback(paramProposal, true, dispatch);
    dispatch(addOrUpdateGovtProposal(paramProposal));
  });
}

async function getNextTimerExpiry(paramProposal: any, dispatch: Dispatch<any>): Promise<number> {
  let nextExpiry;

  switch (paramProposal.state) {
    case ParamProposalState.CHALLENGED_IN_COMMIT_VOTE_PHASE:
      nextExpiry = paramProposal.challenge.challengeCommitExpiry.valueOf();
      break;
    case ParamProposalState.CHALLENGED_IN_REVEAL_VOTE_PHASE:
      nextExpiry = paramProposal.challenge.challengeRevealExpiry.valueOf();
      break;
    case ParamProposalState.READY_TO_RESOLVE_CHALLENGE:
      nextExpiry = paramProposal.propProcessByExpiry.valueOf();
      break;
    default:
      nextExpiry = 0;
  }

  return nextExpiry;
}

async function setupGovtParamProposalCallback(
  paramProposal: any,
  isInit: boolean,
  dispatch: Dispatch<any>,
): Promise<void> {
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
      setTimeout(dispatch, delay, checkAndUpdateGovtParameterProposalState(paramProposal.id)),
    );
    setTimeoutTimeouts.set(
      paramProposal.id,
      setTimeout(setupGovtParamProposalCallback, delay, paramProposal, false, dispatch),
    );
  }
}

export async function initializeConstitution(dispatch: Dispatch<any>): Promise<void> {
  const tcr = await getTCR();
  const govt = await tcr.getGovernment();
  const council = await tcr.getCouncil();
  const uri = await govt.getConstitutionURI();
  dispatch(setConstitutionData("uri", uri));

  const hash = await govt.getConstitutionHash();
  dispatch(setConstitutionData("hash", hash));
  const appellate = await govt.getAppellate();
  dispatch(setAppellate(appellate));
  const controller = await govt.getController();
  dispatch(setController(controller));
  const appellateMembers = await council.getAppellateMembers();
  dispatch(setAppellateMembers(appellateMembers));

  council.transactions().subscribe(async (transaction: MultisigTransaction) => {
    dispatch(addCouncilMultisigTransaction(transaction));
  });
}
