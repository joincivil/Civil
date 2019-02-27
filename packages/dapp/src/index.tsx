import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { gaMiddleware } from "./redux/analytics";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import createRootReducer from "./redux/reducers";

export const history = createBrowserHistory();

const store = createStore(createRootReducer(history), applyMiddleware(routerMiddleware(history), thunk, gaMiddleware));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement,
);
