import { isUndefined } from "lodash";
import { Observable } from "rxjs/Observable";
import * as Web3 from "web3";
import { DecodedLogEntry, DecodedLogEntryEvent } from "@joincivil/typescript-types";
import { Contract } from "../interfaces/contract";
import { OwnableContract } from "../interfaces/ownable";

import { EthAddress, TxDataBase, TxHash, CivilTransactionReceipt, TwoStepEthTransaction } from "../../types";
import { EthApi } from "../../utils/ethapi";

export function findEvent<T extends DecodedLogEntry>(tx: Web3.TransactionReceipt, eventName: string): T | undefined {
  return tx.logs.find(log => isDecodedLog(log) && log.event === eventName) as T | undefined;
}

export function findEventOrThrow<T extends DecodedLogEntry>(tx: Web3.TransactionReceipt, eventName: string): T {
  const event = findEvent<T>(tx, eventName);
  if (!event) {
    throw new Error(`Log with event == "${eventName}" not found`);
  }
  return event;
}

export function findEvents<T extends DecodedLogEntry>(tx: Web3.TransactionReceipt, eventName: string): T[] {
  return tx.logs.filter(log => isDecodedLog(log) && log.event === eventName) as T[];
}

export function isContract<T extends Web3.ContractInstance>(what: any): what is T {
  return (what as T).abi !== undefined;
}

export function isOwnableContract(contract: Contract | OwnableContract): contract is OwnableContract {
  return (contract as OwnableContract).owner !== undefined;
}

export function isDecodedLog(what: Web3.LogEntry | DecodedLogEntry): what is DecodedLogEntry {
  return typeof (what as any).event === "string" && !isUndefined((what as any).args);
}

export type TypedEventFilter<T> = { [P in keyof T]?: T[P] | Array<T[P]> };
export type DecodedFilterCallback<L extends DecodedLogEntryEvent> = (err: Error, result: L) => void;
export interface DecodedFilterResult<L extends DecodedLogEntryEvent> {
  get(callback: () => void): void;
  watch(callback: DecodedFilterCallback<L>): void;
  stopWatching(callback?: () => void): void;
}
export type EventFunction<A, L extends DecodedLogEntryEvent<A>> = (
  paramFilters?: TypedEventFilter<A>,
  filterObject?: Web3.FilterObject,
  callback?: DecodedFilterCallback<L>,
) => DecodedFilterResult<L>;

// TODO(ritave): Think how to solve race condition in filters, concat get/watch perhaps?
export function streamifyEvent<A, L extends DecodedLogEntryEvent<A>>(
  original: EventFunction<A, L>,
): (paramFilters?: TypedEventFilter<A>, filterObject?: Web3.FilterObject) => Observable<L> {
  return (paramFilters?: TypedEventFilter<A>, filterObject?: Web3.FilterObject) => {
    return new Observable<L>(subscriber => {
      const filter = original(paramFilters, filterObject);
      let errored = false;
      filter.watch((err: Error, event: L) => {
        if (err) {
          errored = true;
          return filter.stopWatching(() => subscriber.error(err));
        }
        subscriber.next(event);
      });

      return () => {
        if (!errored) {
          filter.stopWatching(() => subscriber.complete());
        }
      };
    }).distinctUntilChanged((a, b) => {
      return a.blockNumber === b.blockNumber && a.logIndex === b.logIndex;
    }); // https://github.com/ethereum/web3.js/issues/573;
  };
}

export function isTxData(data: any): data is TxDataBase {
  return (
    data.gas !== undefined ||
    data.gasPrice !== undefined ||
    data.nonce !== undefined ||
    data.from !== undefined ||
    data.value !== undefined ||
    data.to !== undefined
  );
}

export function createTwoStepTransaction<T>(
  ethApi: EthApi,
  txHash: TxHash,
  transform: (receipt: CivilTransactionReceipt) => Promise<T> | T,
): TwoStepEthTransaction<T> {
  return {
    txHash,
    awaitReceipt: async (blockConfirmations?: number) =>
      ethApi.awaitReceipt(txHash, blockConfirmations).then(transform),
  };
}

export function createTwoStepSimple(ethApi: EthApi, txHash: TxHash): TwoStepEthTransaction {
  return {
    txHash,
    awaitReceipt: ethApi.awaitReceipt.bind(ethApi, txHash),
  };
}

export function isEthAddress(what: any): what is EthAddress {
  return typeof what === "string";
}
