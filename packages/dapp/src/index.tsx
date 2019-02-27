import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";
import { createStore, applyMiddleware } from "redux";
import reducers from "./redux/reducers";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { gaMiddleware } from "./redux/analytics";

const store = createStore(reducers, applyMiddleware(thunk, gaMiddleware));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement,
);
