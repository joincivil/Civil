import { AnyAction } from "redux";

export enum parameterizerActions {
  SET_PARAMETER = "SET_PARAMETER",
}

export const setParameter = (paramName: string, paramValue: any): AnyAction => {
  return {
    type: parameterizerActions.SET_PARAMETER,
    paramName,
    paramValue,
  };
};
