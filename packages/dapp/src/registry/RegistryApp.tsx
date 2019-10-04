import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { RegistryShell } from "./RegistryShell";
import { standaloneRoutes } from "../constants";

const RegistrySection = React.lazy(async () => {
  console.log("loading RegistrySection");
  const rtn = await import("./RegistrySection");
  console.log("loaded RegistrySection");
  return rtn;
});

const RegistryAppComponent = (props: RouteComponentProps) => {
  const isStandaloneRoute = standaloneRoutes.find(route => props.location.pathname.indexOf(route.pathStem) === 0);

  return (
    <React.Suspense fallback={isStandaloneRoute ? <></> : <RegistryShell />}>
      <RegistrySection />
    </React.Suspense>
  );
};

export const RegistryApp = withRouter(RegistryAppComponent);

export default RegistryApp;
