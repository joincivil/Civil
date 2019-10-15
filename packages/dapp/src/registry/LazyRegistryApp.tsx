import * as React from "react";
import { RegistryShell } from "./RegistryShell";

const AppProvider = React.lazy(async () => import("../components/providers/AppProvider"));
const RegistryApp = React.lazy(async () => import("./RegistryApp"));

const LazyRegistryApp = () => {
  return (
    <React.Suspense fallback={<RegistryShell />}>
      <AppProvider>
        <RegistryApp />
      </AppProvider>
    </React.Suspense>
  );
};

export default LazyRegistryApp;
