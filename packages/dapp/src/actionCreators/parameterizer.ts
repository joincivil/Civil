import { AnyAction } from "redux";

export enum parameterizerActions {
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
