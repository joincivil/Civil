import { promisify } from "util";
// We're just using types from web3
/* tslint:disable no-implicit-dependencies */
import * as Web3 from "web3";
/* tslint:enable no-implicit-dependencies */
import { BigNumber } from "web3-typescript-typings/node_modules/bignumber.js";

export function findEvent<T = any>(tx: any, eventName: string): Web3.DecodedLogEntry<T> {
  return tx.logs.find((log: any) => log.event === eventName);
}

export function idFromEvent(tx: any): BigNumber | undefined {
  for (const log of tx.logs) {
    if (log.args.id) {
      return log.args.id;
    }
  }
  return undefined;
}

export function is0x0Address(address: string): boolean {
  return address === "0x0" || address === "0x0000000000000000000000000000000000000000";
}

export async function timestampFromTx(web3: Web3, tx: Web3.Transaction | Web3.TransactionReceipt): Promise<number> {
  if (tx.blockNumber === null) {
    throw new Error("Transaction not yet mined");
  }
  const getBlock = promisify<number, Web3.BlockWithoutTransactionData>(web3.eth.getBlock.bind(web3.eth));
  return (await getBlock(tx.blockNumber)).timestamp;
}
