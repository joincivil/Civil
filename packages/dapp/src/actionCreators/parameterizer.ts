import { AnyAction } from "redux";

export enum parameterizerActions {
  ADD_OR_UPDATE_PROPOSAL = "ADD_OR_UPDATE_PROPOSAL",
  SET_PARAMETER = "SET_PARAMETER",
  MULTI_SET_PARAMETERS = "MULTI_SET_PARAMETERS",
}

export const setParameter = (paramName: string, paramValue: any): AnyAction => {
  return {
    type: parameterizerActions.SET_PARAMETER,
    paramName,
    paramValue,
  };
};

export const multiSetParameters = (paramsObj: object): AnyAction => {
  return {
    type: parameterizerActions.MULTI_SET_PARAMETERS,
    params: paramsObj,
  };
};

export const addProposal = (proposal: object): AnyAction => {
  return {
    type: parameterizerActions.ADD_OR_UPDATE_PROPOSAL,
    proposal,
  };
};
