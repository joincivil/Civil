import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";
import { Provider } from "react-redux";

import { store } from "./redux/store";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement,
);
