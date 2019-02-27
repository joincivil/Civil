import { LOCATION_CHANGE } from "react-router-redux";
import { createMiddleware } from "redux-beacon";
import GoogleAnalytics, { trackPageView } from "@redux-beacon/google-analytics";

const eventsMap = {
  [LOCATION_CHANGE]: trackPageView((action: any) => {
    console.log("trackPageView. action: ", action);
    return {
      page: action.payload.pathname,
    };
  }),
};

export const gaMiddleware = createMiddleware(eventsMap, GoogleAnalytics());
