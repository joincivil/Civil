import { LOCATION_CHANGE } from "connected-react-router";
import { createMiddleware } from "redux-beacon";
import GoogleAnalytics, { trackPageView, trackEvent } from "@redux-beacon/google-analytics";
import { analyticsEventActions } from "./actionCreators/analytics";

import { errorActions } from "./actionCreators/errors";
const { ANALYTICS_EVENT } = analyticsEventActions;
import { newsroomSignupAnalyticsEvents } from "@joincivil/newsroom-signup";

const eventsMap = {
  ...newsroomSignupAnalyticsEvents,

  [LOCATION_CHANGE]: trackPageView((action: any) => {
    return {
      page: action.payload.location.pathname,
    };
  }),
  [errorActions.WINDOW_ON_ERROR]: trackEvent((action, prevState, nextState) => {
    const { error } = action;
    return {
      category: "Error",
      action: error.message,
      label: `Source: ${error.source} L${error.lineNum}-${error.colNum}`,
    };
  }),
  [ANALYTICS_EVENT]: trackEvent(action => {
    console.log({ action });
    return action.event;
  }),
};

export const gaMiddleware = createMiddleware(eventsMap, GoogleAnalytics());
