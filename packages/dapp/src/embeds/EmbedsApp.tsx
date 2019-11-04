import * as React from "react";

import { Route, Switch } from "react-router-dom";
import { embedRoutes } from "../constants";
// apps
const StoryBoostLoader = React.lazy(async () => import(/* webpackChunkName: "story-boost-loader" */ "./StoryBoostLoader"));
const BoostLoader = React.lazy(async () => import(/* webpackChunkName: "boost-loader" */ "./BoostLoader"));

export const EmbedsApp = () => {
  return (
    <Switch>
      <Route path={embedRoutes.STORY_BOOST} render={() => <StoryBoostLoader />} />
      <Route path={embedRoutes.BOOST} render={() => <BoostLoader />} />
    </Switch>
  );
};

export default EmbedsApp;
