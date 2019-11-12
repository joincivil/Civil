import { AbiItem } from "web3-utils";
import { TransactionReceipt, Log } from "web3-core";

// make sure that typescript-types/ethers is using the same version as web3's abi-encoder ether
import { utils } from "ethers";

export type BigNumber = utils.BigNumber;
export const { BigNumber, bigNumberify, parseEther, formatEther, parseUnits, commify } = utils;

// this isn't exported: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/web3/eth/contract.d.ts#L6
export interface ContractOptions {
  address?: string;
  jsonInterface?: AbiItem[];
  data?: string;
  from?: string;
  gasPrice?: string;
  gas?: number;
}

export interface DecodedLogBase<A, E extends string> {
  event: E;
  returnValues: A;
  args: A;
}

export interface DecodedLogEntry<A = any, E extends string = string> extends Log, DecodedLogBase<A, E> {}

export interface DecodedLogEntryEvent<A = any, E extends string = string> extends DecodedLogBase<A, E>, Log {}

export interface DecodedTransactionReceipt<L extends Log = Log> extends TransactionReceipt {
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
