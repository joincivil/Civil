import { RPCSubprovider } from "@0xproject/subproviders";
import { DEFAULT_HTTP_NODE, EthApi } from "@joincivil/ethapi";
import "@joincivil/utils";
import { coverageProviderSingleton, inCoverage } from "./coverage";
import ProviderEngine = require("web3-provider-engine");
import Subprovider = require("web3-provider-engine/subproviders/subprovider");

function prependSubprovider(engine: ProviderEngine, provider: Subprovider): void {
  provider.setEngine(engine);
  const castedEngine = engine as any;
  if (castedEngine._providers) {
    castedEngine._providers = [provider, ...castedEngine._providers];
  } else {
    throw new Error("Provider engine hack failed, update the hack");
  }
}

function addNode(ethApi: EthApi): void {
  // TODO(ritave): Add ganache in process provider
  const rpcProvider = new RPCSubprovider(DEFAULT_HTTP_NODE, 10000);
  prependSubprovider(ethApi.currentProvider as ProviderEngine, rpcProvider);
}

function addCoverage(ethApi: EthApi): void {
  if (inCoverage()) {
    console.log("Enabling coverage");
    prependSubprovider(ethApi.currentProvider as ProviderEngine, coverageProviderSingleton());
  }
}

function getEthApi(): EthApi {
  const providerEngine = new ProviderEngine();
  const ethApi = new EthApi(providerEngine, []);
  // Order is important
  addNode(ethApi);
  addCoverage(ethApi);
  providerEngine.start();
  return ethApi;
}

export default getEthApi();
