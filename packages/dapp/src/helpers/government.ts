import { Dispatch } from "react-redux";
import {
  multiSetGovtParameters,
  setGovernmentParameter,
  setConstitutionData,
  setAppellate,
  setController,
  setAppellateMembers,
} from "../actionCreators/government";
import { getGovernmentParameters } from "../apis/civilTCR";
import { getTCR, getCivil } from "./civilInstance";
import { Param } from "@joincivil/core";

export async function initializeGovernment(dispatch: Dispatch<any>): Promise<void> {
  const paramKeys = ["requestAppealLen", "judgeAppealLen", "appealFee", "appealVotePercentage"];

  const parameterVals = await getGovernmentParameters(paramKeys);
  const paramObj = parameterVals.reduce((acc, item, index) => {
    acc[paramKeys[index]] = item.toString();
    return acc;
  }, {});

  dispatch(multiSetGovtParameters(paramObj));
}

export async function initializeGovernmentParamSubscription(dispatch: Dispatch<any>): Promise<void> {
  const tcr = getTCR();
  const civil = getCivil();
  const current = await civil.currentBlock();
  const govt = await tcr.getGovernment();
  govt.getParameterSet(current).subscribe(async (p: Param) => {
    dispatch(setGovernmentParameter(p.paramName, p.value));
  });
}

export async function initializeConstitution(dispatch: Dispatch<any>): Promise<void> {
  const tcr = getTCR();
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
}
