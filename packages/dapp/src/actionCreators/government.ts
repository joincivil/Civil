import { AnyAction } from "redux";

export enum governmentActions {
  SET_GOVT_PARAMETER = "SET_GOVT_PARAMETER",
  MULTI_SET_GOVT_PARAMETERS = "MULTI_SET_GOVT_PARAMETERS",
  ADD_GOVERNMENT_DATA = "ADD_GOVERNMENT_DATA",
  SET_CONSTITUTION_DATA = "SET_CONSTITUTION_DATA",
  SET_APPELLATE = "SET_APPELLATE",
  SET_CONTROLLER = "SET_CONTROLLER",
  SET_APPELLATE_MEMBERS = "SET_APPELLATE_MEMBERS",
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

export const addGovernmentData = (governmentDataKey: string, governmentDataValue: string): AnyAction => {
  return {
    type: governmentActions.ADD_GOVERNMENT_DATA,
    data: {
      key: governmentDataKey,
      value: governmentDataValue,
    },
  };
};

export const setConstitutionData = (constitutionDataKey: string, constitutionDataValue: string): AnyAction => {
  return {
    type: governmentActions.SET_CONSTITUTION_DATA,
    data: {
      key: constitutionDataKey,
      value: constitutionDataValue,
    },
  };
};

export const setAppellate = (appellate: string): AnyAction => {
  return {
    type: governmentActions.SET_APPELLATE,
    data: appellate,
  };
};

export const setController = (controller: string): AnyAction => {
  return {
    type: governmentActions.SET_CONTROLLER,
    data: controller,
  };
};
export const setAppellateMembers = (members: string[]): AnyAction => {
  return {
    type: governmentActions.SET_APPELLATE_MEMBERS,
    data: members,
  };
};
