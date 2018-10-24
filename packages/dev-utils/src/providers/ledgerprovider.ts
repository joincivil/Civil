import {
  LedgerEthereumClient,
  NonceTrackerSubprovider,
  Provider,
  RPCSubprovider,
  Web3ProviderEngine,
} from "@0xproject/subproviders";
import Eth from "@ledgerhq/hw-app-eth";
// tslint:disable-next-line:no-implicit-dependencies
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import { FilteredLedgerProvider } from "./filteraccountsprovider";
import FiltersSubprovider = require("web3-provider-engine/subproviders/filters");

async function ledgerEthereumNodeJsClientFactoryAsync(): Promise<LedgerEthereumClient> {
  const ledgerConnection = await TransportNodeHid.create();
  const ledgerEthClient = new Eth(ledgerConnection);
  return ledgerEthClient;
}

export interface LedgerProviderConfig {
  endpoint: string;
  networkId: number;
  accountId?: number;
  baseDerivationPath?: string;
}

export function ledgerProvider(config: LedgerProviderConfig): Provider {
  const engine = new Web3ProviderEngine();
  engine.addProvider(
    new FilteredLedgerProvider({
      networkId: config.networkId,
      baseDerivationPath: config.baseDerivationPath,
      ledgerEthereumClientFactoryAsync: ledgerEthereumNodeJsClientFactoryAsync,
      accountId: config.accountId,
    }),
  );
  engine.addProvider(new NonceTrackerSubprovider());
  engine.addProvider(new FiltersSubprovider());
  engine.addProvider(new RPCSubprovider(config.endpoint));
  engine.start();
  return engine;
}
