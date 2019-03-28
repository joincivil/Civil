import { AnyAction } from "redux";

export enum analyticsEventActions {
  ANALYTICS_EVENT = "ANALYTICS_EVENT",
}

export const analyticsEvent = (category: string, action: string, label: string, value: string): AnyAction => {
  return {
    type: analyticsEventActions.ANALYTICS_EVENT,
    event: {
      category,
      action,
      label,
      value,
    },
  };
};
