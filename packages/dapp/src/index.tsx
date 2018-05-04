import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";
import { createStore } from "redux";
import reducers from "./reducers";
import registerServiceWorker from "./registerServiceWorker";
import { Provider } from "react-redux";

const store = createStore(reducers);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement,
);
registerServiceWorker();
