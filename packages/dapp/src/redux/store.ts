import thunk from "redux-thunk";
import { createStore, compose, applyMiddleware } from "redux";
import { routerMiddleware } from "connected-react-router";

import { gaMiddleware } from "./analytics";
import { createBrowserHistory } from "history";
import createRootReducer from "./reducers";

export const history = createBrowserHistory();

export const store = createStore(
  createRootReducer(history),
  {},
  compose(applyMiddleware(routerMiddleware(history), thunk, gaMiddleware)),
);
