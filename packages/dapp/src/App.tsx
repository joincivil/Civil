import * as React from "react";

import { createBrowserHistory } from "history";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import config from "./helpers/config";
import { createGlobalStyle } from "styled-components";

import { fonts, colors } from "@joincivil/elements";

export const history = createBrowserHistory();

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }
  body {
    font-family: ${fonts.SANS_SERIF};
  }

  a {
    color: ${colors.accent.CIVIL_BLUE};
    text-decoration: none;
  }
  *, :after, :before {
    box-sizing: inherit;
  }
`;

// apps
const RegistryApp = React.lazy(async () => {
  console.log("loading registry");
  return import("./registry/RegistryApp");
});
const StoriesApp = React.lazy(async () => {
  console.log("loading stories");
  return import("./stories/StoriesApp");
});
const KirbyApp = React.lazy(async () => {
  console.log("loading kirby");
  return import("@joincivil/kirby");
});

export const App = () => {
  return (
    <Router>
      <React.Suspense fallback={<div></div>}>
        <GlobalStyle />
        <Switch>
          <Route path="/stories" render={() => <StoriesApp />} />
          <Route path="/kirby" render={() => <KirbyApp config={config} />} />
          <Route path="*" render={() => <RegistryApp />} />
        </Switch>
      </React.Suspense>
    </Router>
  );
};
