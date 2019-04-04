import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";

import { App } from "./App";
import { Provider } from "react-redux";

import { store } from "./redux/store";

import config from "./helpers/config";

Sentry.init({
  dsn: config.SENTRY_DSN,
  environment: config.ENVIRONMENT,
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement,
);
