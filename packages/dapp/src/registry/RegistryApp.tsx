import * as React from "react";
import { RegistryShell } from "./RegistryShell";

const RegistrySection = React.lazy(async () => {
  console.log("loading RegistrySection");
  const rtn = await import("./RegistrySection");
  console.log("loaded RegistrySection");
  return rtn;
});

export const RegistryApp = () => (
  <React.Suspense fallback={<RegistryShell />}>
    <RegistrySection />
  </React.Suspense>
);

export default RegistryApp;
