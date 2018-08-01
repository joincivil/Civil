import LedgerWalletFactory from "ledger-wallet-provider";
import Web3 from "web3";
import ProviderEngine from "web3-provider-engine";
import RpcSubprovider from "web3-provider-engine/subproviders/rpc";
import { getHardwareWeb } from "./index";

export async function getLedgerWeb3(): Web3.provider {
  const networkId = 4; // for rinkeby testnet
  const ledgerWalletFactory = await LedgerWalletFactory(() => networkId, `44'/60'/0'/0`);

  if (!ledgerWalletFactory.isSupported) {
    throw new Error("Ledger not supported");
  }

  return getHardwareWeb3(ledgerWalletFactory);
}
