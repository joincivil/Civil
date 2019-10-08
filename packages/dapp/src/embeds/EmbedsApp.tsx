import * as React from "react";

import { Route, Switch } from "react-router-dom";
// apps
const BoostLoader = React.lazy(async () => import("./BoostLoader"));

export const EmbedsApp = () => {
  return (
    <Switch>
      <Route path="/embed/boost/:boostId/:payment?" render={() => <BoostLoader />} />
    </Switch>
  );
};

export default EmbedsApp;
