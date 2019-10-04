import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { RegistryShell } from "./RegistryShell";
import { standaloneRoutes } from "../constants";

const RegistryWrapper = React.lazy(async () => {
  console.log("loading RegistryWrapper");
  const rtn = await import("./RegistryWrapper");
  console.log("loaded RegistryWrapper");
  return rtn;
});

const RegistryAppComponent = (props: RouteComponentProps) => {
  const isStandaloneRoute = standaloneRoutes.find(route => props.location.pathname.indexOf(route.pathStem) === 0);

  return (
    <React.Suspense fallback={isStandaloneRoute ? <></> : <RegistryShell />}>
      <RegistryWrapper />
    </React.Suspense>
  );
};

export const RegistryApp = withRouter(RegistryAppComponent);

export default RegistryApp;
