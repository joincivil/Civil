import * as React from "react";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import config from "./helpers/config";
import { createGlobalStyle } from "styled-components";

import { fonts, colors } from "@joincivil/elements";

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
const LazyRegistryApp = React.lazy(async () => {
  console.log("loading registry");
  return import("./registry/LazyRegistryApp");
});
const EmbedsApp = React.lazy(async () => {
  console.log("loading embed");
  return import("./embeds/EmbedsApp");
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
    <BrowserRouter>
      <React.Suspense fallback={<></>}>
        <GlobalStyle />
        <Switch>
          <Route path="/embed" render={() => <EmbedsApp />} />
          <Route path="/stories" render={() => <StoriesApp />} />
          <Route path="/kirby" render={() => <KirbyApp config={config} />} />
          <Route path="*" render={() => <LazyRegistryApp />} />
        </Switch>
      </React.Suspense>
    </BrowserRouter>
  );
};
