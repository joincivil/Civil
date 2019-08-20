// import { CoverageSubprovider, TruffleArtifactAdapter } from "@0x/sol-coverage";
// import * as process from "process";

// const SOLC_VERSION = "0.4.24";
// // Default ganache account from root package.json mnemonic
// const DEFAULT_ACCOUNT = "0xaa28645c500e644ab3195b58820adc437268e4c3";

// let coverageProvider: CoverageSubprovider;

// export function inCoverage(): boolean {
//   const coveragEnv = process.env.SOLIDITY_COVERAGE;
//   return !!coveragEnv && coveragEnv.toLowerCase() === "true";
// }

// export function coverageProviderSingleton(): CoverageSubprovider {
//   if (!coverageProvider) {
//     const truffleAdapter = new TruffleArtifactAdapter("./", SOLC_VERSION);
//     coverageProvider = new CoverageSubprovider(truffleAdapter, DEFAULT_ACCOUNT);
//     return coverageProvider;
//   }
//   return coverageProvider;
// }
