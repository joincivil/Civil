import thunk from "redux-thunk";
import { createStore, compose, applyMiddleware } from "redux";
import { routerMiddleware } from "connected-react-router";

import { createBrowserHistory } from "history";
import createRootReducer from "./reducers";
import dynamicMiddlewares from "redux-dynamic-middlewares";
import cookie from "react-cookies";
import { gaMiddleware } from "./analytics";

export const history = createBrowserHistory();

export const store = () => {
  const didAnswerTracking = cookie.load("didAnswerTracking");
  if (didAnswerTracking) {
    const allowTracking = cookie.load("allowTracking");
    if (allowTracking) {
      console.log("THIS ONE");
      return createStore(
        createRootReducer(history),
        {},
        compose(applyMiddleware(routerMiddleware(history), thunk, gaMiddleware)),
      );
    }
  }
  console.log("THAT ONE");
  return createStore(
    createRootReducer(history),
    {},
    compose(applyMiddleware(routerMiddleware(history), thunk, dynamicMiddlewares)),
  );
};
