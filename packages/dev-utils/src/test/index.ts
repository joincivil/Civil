import * as chaiAsPromised from "chai-as-promised";
import * as chaiBignumber from "chai-bignumber";
import * as dirtyChai from "dirty-chai";
import * as Web3 from "web3";

export function configureChai(chai: any): void {
  chai.config.includeStack = true;
  chai.use(chaiBignumber());
  chai.use(chaiAsPromised);
  chai.use(dirtyChai);
}

// TODO(ritave): Create a mock provider
export function dummyWeb3Provider(): Web3.Provider {
  return new Web3.providers.HttpProvider("http://localhost:8545");
}

// TODO(ritave): Duplicated code, use web3wrapper's rpc
export async function rpc(
  provider: Web3.Provider,
  method: string,
  ...params: any[]
): Promise<Web3.JSONRPCResponsePayload> {
  return new Promise<Web3.JSONRPCResponsePayload>((resolve, reject) => {
    provider.sendAsync(
      {
        id: new Date().getSeconds(),
        jsonrpc: "2.0",
        method,
        params,
      },
      (err, result) => {
        if (err) {
          return reject(err);
        }
        if ((result as any).error) {
          return reject((result as any).error);
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

export function getParamFromTxEvent<T>(tx: Web3.TransactionReceipt, param: string, event: string): T {
  const eventAny = tx.logs.find(log => (log as Web3.DecodedLogEntry<any>).event === event);
  if (eventAny === undefined) {
    throw new Error("No event found with name: " + event);
  }
  const foundEvent = eventAny as Web3.DecodedLogEntry<any>;
  const paramAny = foundEvent.args[param];
  if (paramAny === undefined) {
    throw new Error("No param found with name: " + param + " in event: " + event);
  }
  return paramAny as T;
}
