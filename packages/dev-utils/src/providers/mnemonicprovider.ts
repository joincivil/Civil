import {
  MnemonicWalletSubprovider,
  NonceTrackerSubprovider,
  Provider,
  RPCSubprovider,
  Web3ProviderEngine,
} from "@0xproject/subproviders";
import FiltersSubprovider = require("web3-provider-engine/subproviders/filters");

export function mnemonicProvider(mnemonic: string, endpoint: string): Provider {
  const engine = new Web3ProviderEngine();
  engine.addProvider(new MnemonicWalletSubprovider({ mnemonic }));
  engine.addProvider(new NonceTrackerSubprovider());
  engine.addProvider(new FiltersSubprovider());
  engine.addProvider(new RPCSubprovider(endpoint));
  engine.start();
  return engine;
}
