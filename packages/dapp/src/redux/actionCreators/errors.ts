import { AnyAction } from "redux";

export enum errorActions {
  WINDOW_ON_ERROR = "WINDOW_ON_ERROR",
}

export const catchWindowOnError = (
  message: string,
  source: string,
  lineNum: string,
  colNum: string,
  errorObj: any,
): AnyAction => {
  const wrappedError = {
    message,
    source,
    lineNum,
    colNum,
    errorObj,
  };

  return {
    type: errorActions.WINDOW_ON_ERROR,
    error: wrappedError,
  };
};
