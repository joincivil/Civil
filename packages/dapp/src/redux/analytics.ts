import { LOCATION_CHANGE } from "connected-react-router";
import { createMiddleware } from "redux-beacon";
import GoogleAnalytics, { trackPageView, trackEvent } from "@redux-beacon/google-analytics";
import { errorActions } from "./actionCreators/errors";

const eventsMap = {
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
};

export const gaMiddleware = createMiddleware(eventsMap, GoogleAnalytics());
