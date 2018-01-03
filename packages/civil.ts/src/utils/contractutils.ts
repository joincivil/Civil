import BigNumber from "bignumber.js";
import { Observable } from "rxjs/Observable";
import * as Web3 from "web3";

import { DecodedLogEntryEvent } from "web3";
import { EventFunction, MapObject, TxData, TxDataBase, TypedEventFilter } from "../types";

export function findEvent(tx: any, eventName: string) {
  return tx.logs.find((log: any) => log.event === eventName);
}

export function idFromEvent(tx: any): BigNumber {
  for (const log of tx.logs) {
    if (log.args.id) {
      return log.args.id;
    }
  }
  throw new Error("ID not found in the transaction");
}

export function is0x0Address(address: string) {
  return address === "0x0" || address === "0x0000000000000000000000000000000000000000";
}

export function timestampFromTx(web3: Web3, tx: Web3.Transaction | Web3.TransactionReceipt) {
  return new Promise((resolve, reject) => {
    if (tx.blockNumber == null) {
      return reject(new Error("Transaction not yet mined"));
    }
    web3.eth.getBlock(tx.blockNumber, (err, block) => {
      if (err) {
        return reject(err);
      }
      resolve(block.timestamp);
    });
  });
}

export function isContract<T extends Web3.ContractInstance>(what: any): what is T {
  return (what as T).abi !== undefined;
}

// TODO(ritave): Think how to solve race condition in filters, concat get/watch perhaps?
export function streamifyEvent<A>(original: EventFunction<TypedEventFilter<A>>)
: (paramFilters?: TypedEventFilter<A>, filterObject?: Web3.FilterObject) => Observable<Web3.DecodedLogEntryEvent<A>> {
  return (paramFilters?: TypedEventFilter<A>, filterObject?: Web3.FilterObject) => {
    return new Observable((subscriber) => {
      const filter = original(paramFilters, filterObject);
      let errored = false;
      filter.watch((err, event) => {
        if (err) {
          errored = true;
          return filter.stopWatching(() => subscriber.error(err));
        }
        subscriber.next(event as DecodedLogEntryEvent<A>);
      });

      return () => {
        if (!errored) {
          filter.stopWatching(() => subscriber.complete());
        }
      };
    });
  };
}

export function isTxData(data: any): data is TxDataBase {
  return data.gas !== undefined ||
    data.gasPrice !== undefined ||
    data.nonce !== undefined ||
    data.from !== undefined ||
    data.value !== undefined ||
    data.to !== undefined;
}
