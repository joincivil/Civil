import { LOCATION_CHANGE } from "connected-react-router";
import { createMiddleware } from "redux-beacon";
import GoogleAnalytics, { trackPageView } from "@redux-beacon/google-analytics";

const eventsMap = {
  [LOCATION_CHANGE]: trackPageView((action: any) => {
    return {
      page: action.payload.location.pathname,
    };
  }),
};

export const gaMiddleware = createMiddleware(eventsMap, GoogleAnalytics());
