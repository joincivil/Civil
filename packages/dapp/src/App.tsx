import * as React from "react";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import config from "./helpers/config";
import { createGlobalStyle } from "styled-components/macro";

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
  return import(/* webpackChunkName: "registry-app" */ "./registry/LazyRegistryApp");
});
const EmbedsApp = React.lazy(async () => {
  console.log("loading embed");
  return import(/* webpackChunkName: "embeds-app" */ "./embeds/EmbedsApp");
});
const StoriesApp = React.lazy(async () => {
  console.log("loading stories");
  return import(/* webpackChunkName: "stories-app" */ "./stories/StoriesApp");
});
const KirbyApp = React.lazy(async () => {
  console.log("loading kirby");
  return import(/* webpackChunkName: "kirby-app" */ "@joincivil/kirby");
});
const KirbyLogin = React.lazy(async () => {
  console.log("loading kirby");
  return import(/* webpackChunkName: "kirby-login" */ "./popups/KirbyLogin");
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
          <Route path="/popups/login" render={() => <KirbyLogin config={config} />} />
          <Route path="*" render={() => <LazyRegistryApp />} />
        </Switch>
      </React.Suspense>
    </BrowserRouter>
  );
};
