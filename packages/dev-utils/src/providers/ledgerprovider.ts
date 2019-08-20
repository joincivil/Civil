import {
  LedgerEthereumClientFactoryAsync,
  NonceTrackerSubprovider,
  RPCSubprovider,
  Web3ProviderEngine,
} from "@0x/subproviders";
import { FilteredLedgerProvider } from "./filteraccountsprovider";
import FiltersSubprovider = require("web3-provider-engine/subproviders/filters");

export interface LedgerProviderConfig {
  endpoint: string;
  networkId: number;
  ledgerEthereumClientFactoryAsync: LedgerEthereumClientFactoryAsync;
  accountId?: number;
  baseDerivationPath?: string;
}

export function ledgerProvider(config: LedgerProviderConfig): any {
  const engine = new Web3ProviderEngine();
  engine.addProvider(
    new FilteredLedgerProvider({
      networkId: config.networkId,
      baseDerivationPath: config.baseDerivationPath,
      ledgerEthereumClientFactoryAsync: config.ledgerEthereumClientFactoryAsync,
      accountId: config.accountId,
    }),
  );
  engine.addProvider(new NonceTrackerSubprovider());
  engine.addProvider(new FiltersSubprovider());
  engine.addProvider(new RPCSubprovider(config.endpoint));
  engine.start();
  return engine;
}
