import { DecodedLogEntryEvent, DecodedTransactionReceipt, TxHash } from "@joincivil/typescript-types";
import { CivilLogs } from "./contracts/generated/events";

// For backwards compatibillity
export { Bytes32, DecodedTransactionReceipt, EthAddress, Hex, Uri } from "@joincivil/typescript-types";
export { ContentProvider, ContentProviderCreator, ContentProviderOptions } from "./content/contentprovider";

export type CivilTransactionReceipt = DecodedTransactionReceipt<CivilLogs>;

export interface TwoStepEthTransaction<T = CivilTransactionReceipt> {
  txHash: TxHash;
  awaitReceipt(blockConfirmations?: number): Promise<T>;
}

// tslint:disable-next-line
export interface TimestampedEvent<T extends DecodedLogEntryEvent> extends DecodedLogEntryEvent {
  timestamp(): Promise<number>;
}
