import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";
import { createStore, applyMiddleware } from "redux";
import reducers from "./reducers";
import registerServiceWorker from "./registerServiceWorker";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

const store = createStore(reducers, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement,
);
registerServiceWorker();
