import LedgerWalletFactory from "ledger-wallet-provider";
import * as Web3 from "web3";
import { getHardwareWeb3 } from "./index";

export async function getLedgerWeb3(networkId: number = 4, path: string = `44'/60'/0'/0`): Promise<Web3> {
  const ledgerWalletFactory = await LedgerWalletFactory(() => networkId, path);

  if (!ledgerWalletFactory.isSupported) {
    throw new Error("Ledger not supported");
  }

  return getHardwareWeb3(ledgerWalletFactory);
}
