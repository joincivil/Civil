import { LOCATION_CHANGE } from "connected-react-router";
import { createMiddleware } from "redux-beacon";
import GoogleAnalytics, { trackPageView, trackEvent } from "@redux-beacon/google-analytics";
import { errorActions } from "./actionCreators/errors";
import { newsroomSignupAnalyticsEvents } from "@joincivil/newsroom-signup";
import { analyticsEventActions } from "./actionCreators/analytics";
const { ANALYTICS_EVENT } = analyticsEventActions;

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
  [ANALYTICS_EVENT]: trackEvent(({ event }) => event),
};

export const gaMiddleware = createMiddleware(eventsMap, GoogleAnalytics());
