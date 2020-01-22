import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";
import { CaptureConsole } from "@sentry/integrations";

import { App } from "./App";

import config from "./helpers/config";

Sentry.init({
  dsn: config.SENTRY_DSN,
  environment: config.ENVIRONMENT,
  release: config.APP_VERSION,
  integrations(integrations: any[]): any[] {
    return integrations
      .filter(integration => integration.name !== "Breadcrumbs" || config.ENVIRONMENT === "production")
      .concat(new CaptureConsole({ levels: ["error"] }));
  },
});

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
