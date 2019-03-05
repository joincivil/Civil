import { LOCATION_CHANGE } from "connected-react-router";
import { createMiddleware } from "redux-beacon";
import GoogleAnalytics, { trackPageView } from "@redux-beacon/google-analytics";

const eventsMap = {
  ["FORCE_PAGE_VIEW"]: trackPageView((action: any) => {
    console.log("track page view 2.");
    return {
      page: action.payload.location.pathname,
    };
  }),
  [LOCATION_CHANGE]: trackPageView((action: any) => {
    console.log("track page view.");
    return {
      page: action.payload.location.pathname,
    };
  }),
};

export const gaMiddleware = createMiddleware(eventsMap, GoogleAnalytics());
