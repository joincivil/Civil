import { AnyAction } from "redux";

export enum analyticsEventActions {
  ANALYTICS_EVENT = "ANALYTICS_EVENT",
}

export interface AnalyticsEvent {
  category: string;
  action: string;
  label: string;
  value: string;
}
export const analyticsEvent = (event: AnalyticsEvent): AnyAction => {
  return {
    type: analyticsEventActions.ANALYTICS_EVENT,
    event,
  };
};
