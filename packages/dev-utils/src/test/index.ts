import * as chaiAsPromised from "chai-as-promised";
import * as dirtyChai from "dirty-chai";
import chaiBignumber from "./bignumber-chai";

import { TransactionReceipt, Log } from "web3-core";
import { HttpProvider } from "web3-providers-http";

export function configureChai(chai: any): void {
  chai.config.includeStack = true;
  chai.use(chaiBignumber());
  chai.use(chaiAsPromised);
  chai.use(dirtyChai);
}

// TODO(ritave): Create a mock provider
export function dummyWeb3Provider(): any {
  return new HttpProvider("http://localhost:8545");
}

// TODO(ritave): Duplicated code, use web3wrapper's rpc
export async function rpc(provider: any, method: string, ...params: any[]): Promise<any> {
  // return provider.send(method, params);
  return new Promise((resolve, reject) => {
    provider.send(
      {
        id: new Date().getMilliseconds(),
        jsonrpc: "2.0",
        method,
        params,
      },
      (err: Error, result: any) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      },
    );
  });
}

export async function advanceEvmTime(time: number): Promise<void> {
  await rpc(web3.currentProvider, "evm_increaseTime", time);
  await rpc(web3.currentProvider, "evm_mine");
}

export function getParamFromTxEvent<T>(tx: TransactionReceipt, param: string, event: string): T {
  // @ts-ignore event exists in the log, this is a lie
  const eventAny = tx.logs!.find(e => e.event === event);
  if (eventAny === undefined) {
    throw new Error("No event found with name: " + event);
  }
  const foundEvent = eventAny as Log;
  // @ts-ignore
  const paramAny = foundEvent.args[param];
  if (paramAny === undefined) {
    throw new Error("No param found with name: " + param + " in event: " + event);
  }
  return paramAny as T;
}
