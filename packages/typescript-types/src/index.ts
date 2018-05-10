import * as Web3 from "web3";

export interface DecodedLogBase<A, E extends string> {
  event: E;
  args: A;
}

export interface DecodedLogEntry<A = any, E extends string = string> extends Web3.LogEntry, DecodedLogBase<A, E> {}

export interface DecodedLogEntryEvent<A = any, E extends string = string>
  extends DecodedLogBase<A, E>,
    Web3.LogEntryEvent {}

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
