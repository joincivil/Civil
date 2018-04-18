import * as Web3 from "web3";

export interface DecodedLogBase<A, E extends string> {
  event: E;
  args: A;
}

export interface DecodedLogEntry<A = any, E extends string = string> extends Web3.LogEntry, DecodedLogBase<A, E> {}

export interface DecodedLogEntryEvent<A = any, E extends string = string>
  extends DecodedLogBase<A, E>,
    Web3.LogEntryEvent {}
