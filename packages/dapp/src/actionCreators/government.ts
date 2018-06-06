import { AnyAction } from "redux";

export enum governmentActions {
  ADD_GOVERNMENT_DATA = "ADD_GOVERNMENT_DATA",
}

export const addGovernmentData = (governmentDataKey: string, governmentDataValue: string): AnyAction => {
  return {
    type: governmentActions.ADD_GOVERNMENT_DATA,
    data: {
      key: governmentDataKey,
      value: governmentDataValue,
    }
  };
};
