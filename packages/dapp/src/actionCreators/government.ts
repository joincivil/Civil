import { AnyAction } from "redux";

export enum governmentActions {
  SET_GOVT_PARAMETER = "SET_GOVT_PARAMETER",
  MULTI_SET_GOVT_PARAMETERS = "MULTI_SET_GOVT_PARAMETERS",
}

export const setGovernmentParameter = (paramName: string, paramValue: any): AnyAction => {
  return {
    type: governmentActions.SET_GOVT_PARAMETER,
    paramName,
    paramValue,
  };
};

export const multiSetGovtParameters = (paramsObj: object): AnyAction => {
  return {
    type: governmentActions.MULTI_SET_GOVT_PARAMETERS,
    params: paramsObj,
  };
};
