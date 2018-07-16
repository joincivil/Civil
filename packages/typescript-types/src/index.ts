import BigNumber from "bignumber.js";
import * as Web3 from "web3";

export interface DecodedLogBase<A, E extends string> {
  event: E;
  args: A;
}

export interface DecodedLogEntry<A = any, E extends string = string> extends Web3.LogEntry, DecodedLogBase<A, E> {}

export interface DecodedLogEntryEvent<A = any, E extends string = string>
  extends DecodedLogBase<A, E>,
    Web3.LogEntryEvent {}

export interface DecodedTransactionReceipt<L extends Web3.LogEntry = Web3.LogEntry> {
  blockHash: string;
  blockNumber: number;
  transactionHash: string;
  transactionIndex: number;
  from: string;
  to: string;
  status: null | string | 0 | 1;
  cumulativeGasUsed: number;
  gasUsed: number;
  contractAddress: string | null;
  logs: L[];
}

export type EthAddress = string;
export type Hex = string;

/**
 * Minimal amount of information needed to recover the public address of signer
 */
export interface EthSignedMessageRecovery {
  messageHash: Hex;
  // RLP Encoded
  signature: Hex;
}

export interface EthSignedMessage extends EthSignedMessageRecovery {
  message: string;
  /**
   * To avoid bad actors signing transactions on your behalf, Ethereum nodes prepend
   * additional string on top of your message before signing, according to the spec.
   *
   * This property contains the actual raw string that was hashed and signed.
   */
  rawMessage: string;
  // Coordinates of the signature (32 bytes first and 32 bytes second)
  r: Hex;
  s: Hex;
  // Recovery value + 27
  v: Hex;
  signer: EthAddress;
}

export interface TxDataBase {
  gas?: number | string | BigNumber;
  gasPrice?: number | string | BigNumber;
  nonce?: number;
  data?: string;
}

export interface TxData extends TxDataBase {
  from?: EthAddress;
}

export interface TxDataPayable extends TxData {
  value: number | string | BigNumber;
}

export interface TxDataAll extends Partial<TxDataPayable> {
  to?: EthAddress;
}

export interface TransactionObject extends TxDataBase {
  from: EthAddress;
  value?: number | string | BigNumber;
  to?: EthAddress;
  data?: string;
}

export type Bytes32 = string;
export type TxHash = string;
export type Uri = string;

export enum SolidityTypes {
  Address = "address",
  Uint256 = "uint256",
  Uint8 = "uint8",
  Uint = "uint",
}

// There is one in web3 typing, but it's not existent during runtimes
// we force it to exist by creating one with the same name
export enum AbiType {
  Function = "function",
  Constructor = "constructor",
  Event = "event",
  Fallback = "fallback",
}
