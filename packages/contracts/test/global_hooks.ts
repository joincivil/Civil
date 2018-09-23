import { coverageProviderSingleton, inCoverage } from "./utils/coverage";

after("Write coverage", async () => {
  if (inCoverage()) {
    console.log("Writting coverage");
    await coverageProviderSingleton().writeCoverageAsync();
  }
});
