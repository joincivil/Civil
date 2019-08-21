import { EthApi } from "@joincivil/ethapi";
import { DecodedLogEntry, DecodedLogEntryEvent } from "@joincivil/typescript-types";
import { isDefined, isDeployedBytecodeEqual } from "@joincivil/utils";
import { Observable, Subscriber } from "rxjs";
import { CivilTransactionReceipt, EthAddress, TwoStepEthTransaction, TxHash } from "../../types";
import { artifacts } from "../generated/artifacts";
import { OwnableContract } from "../interfaces/ownable";
import { Contract as IContract } from "../interfaces/contract";
import { EventLog as EventData, TransactionReceipt, Log } from "web3/types";
import { Tx as TransactionConfig } from "web3/eth/types";
import Contract from "web3/eth/contract";

// https://github.com/ethereum/web3.js/blob/2.x/packages/web3-eth-contract/types/index.d.ts#L108
export interface EventOptions {
  filter?: {};
  fromBlock?: number;
  toBlock?: number | "latest" | "pending" | "genesis" | undefined;
  topics?: any[];
}

export function findEvent<T extends DecodedLogEntry>(tx: TransactionReceipt, eventName: string): T | undefined {
  if (tx.events && tx.events[eventName]) {
    return tx.events[eventName] as T | undefined;
  }
  // return tx.events!.find(log => isDecodedLog(log) && log.event === eventName) as T | undefined;
}

export function findEventOrThrow<T extends DecodedLogEntry>(tx: TransactionReceipt, eventName: string): T {
  const event = findEvent<T>(tx, eventName);
  if (!event) {
    throw new Error(`Log with event == "${eventName}" not found`);
  }
  return event;
}

export function findEvents<T extends DecodedLogEntry>(tx: TransactionReceipt, eventName: string): T[] {
  return tx.logs!.filter(log => isDecodedLog(log) && log.event === eventName) as T[];
}

export function isContract<T extends Contract>(what: any): what is T {
  // TODO(dankins): ignoring typescript error, make sure this works
  // @ts-ignore
  return (what as T).abi !== undefined;
}

export function isOwnableContract(contract: IContract | OwnableContract): contract is OwnableContract {
  return (contract as OwnableContract).owner !== undefined;
}

export function isDecodedLog(what: Log | EventData): what is DecodedLogEntry {
  return typeof (what as any).event === "string" && isDefined(what as any);
}

export type TypedEventFilter<T> = { [P in keyof T]?: T[P] | Array<T[P]> };
export type DecodedFilterCallback<L extends DecodedLogEntryEvent> = (err: Error, result: L) => void;
export interface DecodedFilterResult<L extends DecodedLogEntryEvent> {
  get(callback: (err: Error, logs: L[]) => void): void;
  watch(callback: DecodedFilterCallback<L>): void;
  stopWatching(callback?: () => void): void;
}
export type EventFunction<A, L extends DecodedLogEntryEvent<A>> = (
  paramFilters?: TypedEventFilter<A>,
  filterObject?: EventOptions,
  callback?: DecodedFilterCallback<L>,
) => DecodedFilterResult<L>;

// TODO(ritave): Think how to solve race condition in filters, concat get/watch perhaps?
export function streamifyEvent<A, L extends DecodedLogEntryEvent<A>>(
  instance: Contract,
  eventName: string,
): (paramFilters?: TypedEventFilter<any>, filterObject?: EventOptions) => Observable<L> {
  return (paramFilters?: TypedEventFilter<A>, filterObject?: EventOptions) => {
    return new Observable<L>((subscriber: Subscriber<L>) => {
      if (filterObject && filterObject.toBlock) {
        instance
          .getPastEvents(eventName, filterObject)
          .then(logs => {
            for (const log of logs) {
              // @ts-ignore
              subscriber.next(log);
            }
            subscriber.complete();
          })
          .catch(err => {
            subscriber.error(err);
          });
      } else {
        // Infinite stream of historic and future events
        const eventStream = instance.events[eventName](filterObject);
        eventStream
          .on("data", (event: any) => {
            subscriber.next(event);
          })
          .on("error", (err: Error) => {
            subscriber.error(err);
            subscriber.complete();
          });
      }
    }).distinctUntilChanged((a, b) => {
      return a.blockNumber === b.blockNumber && a.logIndex === b.logIndex;
    }); // https://github.com/ethereum/web3.js/issues/573;
  };
}

export function isTxData(data: any): data is TransactionConfig {
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
      ethApi.awaitReceipt<CivilTransactionReceipt>(txHash, blockConfirmations).then(transform),
  };
}

export function createTwoStepSimple(ethApi: EthApi, txHash: TxHash): TwoStepEthTransaction {
  return {
    txHash,
    // @ts-ignore
    awaitReceipt: ethApi.awaitReceipt.bind(ethApi, txHash),
  };
}

export function isEthAddress(what: any): what is EthAddress {
  return typeof what === "string";
}

export async function isAddressMultisigWallet(ethApi: EthApi, address: EthAddress): Promise<boolean> {
  const code = await ethApi.getCode(address);
  // TODO(ritave): Have backwards compatibillity for older Multisig wallets and bytecodes
  return isDeployedBytecodeEqual(artifacts.MultiSigWallet.deployedBytecode, code);
}
