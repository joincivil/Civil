// @ts-ignore
import LedgerWalletFactory from "ledger-wallet-provider"; // TODO(jorgelo): Figure out how to avoid this ignore.
import * as Web3 from "web3";
import { getHardwareWeb3 } from "./index";

export async function getHasLedger(): Promise<boolean> {
  return true;
  const ledgerWalletFactory = await LedgerWalletFactory();

  return !!ledgerWalletFactory.isSupported;
}

export async function getLedgerWeb3(networkId: string = "4", path: string = `44'/60'/0'/0`): Promise<Web3> {
  const ledgerWalletFactory = await LedgerWalletFactory(() => networkId, path);

  // if (!ledgerWalletFactory.isSupported) {
  //   throw new Error("Ledger not supported");
  // }

  return getHardwareWeb3(ledgerWalletFactory);
}
