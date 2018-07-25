import { coverageProviderSingleton, inCoverage } from "./utils/coverage";

after(async () => {
  if (inCoverage()) {
    await coverageProviderSingleton().writeCoverageAsync();
  }
});
