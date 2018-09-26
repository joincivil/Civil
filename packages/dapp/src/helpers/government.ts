import { Param } from "@joincivil/core";
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
} from "../actionCreators/government";
import { getGovernmentParameters } from "../apis/civilTCR";
import { getCivil, getTCR } from "./civilInstance";
import { MultisigTransaction } from "@joincivil/core/build/src/contracts/multisig/multisigtransaction";

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
  govt.getParameterSet(current).subscribe(async (p: Param) => {
    dispatch(setGovernmentParameter(p.paramName, p.value));
  });
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
