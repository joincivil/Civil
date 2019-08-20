import { EthApi, DEFAULT_HTTP_NODE } from "@joincivil/ethapi";
import "@joincivil/utils";
import Web3 = require("web3");

function getEthApi(): EthApi {
  const provider = new Web3.providers.HttpProvider(DEFAULT_HTTP_NODE);
  const ethApi = new EthApi(provider as any, []);
  return ethApi;
}

export default getEthApi();

// import { RPCSubprovider } from "@0x/subproviders";
// import { EthApi, Provider, DEFAULT_HTTP_NODE } from "@joincivil/ethapi";
// import "@joincivil/utils";
// import { coverageProviderSingleton, inCoverage } from "./coverage";
// import ProviderEngine = require("web3-provider-engine");
// import Subprovider = require("web3-provider-engine/subproviders/subprovider");

// function prependSubprovider(engine: Provider, provider: Subprovider): void {
//   provider.setEngine(engine);
//   const castedEngine = engine as any;
//   if (castedEngine._providers) {
//     castedEngine._providers = [provider, ...castedEngine._providers];
//   } else {
//     throw new Error("Provider engine hack failed, update the hack");
//   }
// }

// function addNode(ethApi: EthApi): void {
//   // TODO(ritave): Add ganache in process provider
//   const rpcProvider = new RPCSubprovider(DEFAULT_HTTP_NODE, 10000);
//   prependSubprovider(ethApi.currentProvider, rpcProvider);
// }

// function addCoverage(ethApi: EthApi): void {
//   if (inCoverage()) {
//     console.log("Enabling coverage");
//     prependSubprovider(ethApi.currentProvider, coverageProviderSingleton());
//   }
// }

// function getEthApi(): EthApi {
//   const providerEngine = new ProviderEngine();
//   // @ts-ignore
//   const ethApi = new EthApi(providerEngine, []);
//   // Order is important
//   addNode(ethApi);
//   addCoverage(ethApi);
//   providerEngine.start();
//   return ethApi;
// }

// export default getEthApi();
