import { trackPageView, trackEvent } from "@redux-beacon/google-analytics";
import { analyticsActions } from "./actionCreators";

export const newsroomSignupAnalyticsEvents = {
  [analyticsActions.NAVIGATE_STEP]: trackPageView((action: any) => {
    return {
      page: `${action.path}/${action.step}`,
    };
  }),
  [analyticsActions.REACHED_NEW_STEP]: trackEvent((action: any) => {
    return {
      category: "Newsroom Signup",
      action: "Reached Step",
      value: action.step,
    };
  }),

  [analyticsActions.APPLICATION_SUBMITTED]: trackEvent((action: any) => {
    return {
      category: "Newsroom Signup",
      action: "Grant Application",
      label: "submitted",
    };
  }),
  [analyticsActions.APPLICATION_SKIPPED]: trackEvent((action: any) => {
    return {
      category: "Newsroom Signup",
      action: "Grant Application",
      label: "skipped",
    };
  }),

  [analyticsActions.TRACK_TX]: trackEvent((action: any) => {
    const { txType, state, txHash } = action.data;
    return {
      category: "Newsroom Signup",
      action: `TX - ${txType} - ${state}`,
      label: txHash,
    };
  }),

  [analyticsActions.PUBLISH_CHARTER]: trackEvent((action: any) => {
    return {
      category: "Newsroom Signup",
      action: "Published Charter",
      label: action.data,
    };
  }),
};
