import { EthAddress } from "@joincivil/typescript-types";
import { CivilErrors, isDefined } from "@joincivil/utils";
import BigNumber = require("bn.js");
import * as Debug from "debug";
import { Observable } from "rxjs/Observable";
import Web3 = require("web3");
import { EthApi, Provider } from "./ethapi";

const debug = Debug("civil:ethapi:helpers");

export function detectProvider(): Provider | undefined {
  // Try to use the window's injected provider
  if (hasInjectedProvider()) {
    debug("Using injected web3 provider");
    const injectedWeb3: Web3 = (window as any).web3;
    // @ts-ignore
    return injectedWeb3.currentProvider;
  }
  return undefined;
}

export function hasInjectedProvider(): boolean {
  return typeof window !== "undefined" && (window as any).web3 !== undefined;
}

export function requireAccount(ethApi: EthApi): Observable<EthAddress> {
  return ethApi.accountStream.first().map(account => {
    if (isDefined(account)) {
      return account;
    }
    throw new Error(CivilErrors.NoUnlockedAccount);
  });
}

export async function currentAccount(ethApi: EthApi): Promise<EthAddress | undefined> {
  return ethApi.accountStream.first().toPromise();
}

export async function currentNetwork(ethApi: EthApi): Promise<number> {
  return ethApi.networkStream.first().toPromise();
}

export function toWei(value: string | BigNumber | number, unit: EthereumUnits | string): BigNumber {
  let unitValue: string;
  if (unit in EthereumUnits) {
    unitValue = EthereumUnits[unit as any];
  } else {
    unitValue = unit;
  }
  const unitPower = new BigNumber(unitValue);
  return new BigNumber(value).mul(unitPower);
}

export function fromWei(value: string | BigNumber | number, unit: EthereumUnits | string): BigNumber {
  const unitPower = new BigNumber(EthereumUnits[unit as any]);
  return new BigNumber(value).div(unitPower);
}

export enum EthereumUnits {
  wei = "1",
  kwei = "1000",
  mwei = "1000000",
  gwei = "1000000000",
  microether = "1000000000000",
  milliether = "1000000000000000",
  ether = "1000000000000000000",
  kether = "1000000000000000000000",
  mether = "1000000000000000000000000",
  gether = "1000000000000000000000000000",
  tether = "1000000000000000000000000000000",

  babbage = "1000",
  lovelace = "1000000",
  shannon = "1000000000",
  szabo = "1000000000000",
  finney = "1000000000000000",
}
