import {
  bufferToHex,
  sha3,
  toBuffer,
  isHexPrefixed,
  fromRpcSig,
  ecrecover,
  toChecksumAddress,
  publicToAddress,
} from "ethereumjs-util";
import { soliditySHA3 } from "ethereumjs-abi";
import { Hex, EthSignedMessageRecovery, EthAddress } from "@joincivil/typescript-types";

const SIGN_PREFFIX = "\u0019Ethereum Signed Message:\n";

export function soliditySha3(types: string[], data: any[]): Hex {
  return bufferToHex(soliditySHA3(types, data));
}

export function keccak256String(what: string): Hex {
  return bufferToHex(sha3(what));
}

export function keccak256Hex(what: Hex): Hex {
  if (!isHexPrefixed(what)) {
    throw new Error("Provided string is not a hex string");
  }
  return bufferToHex(sha3(what));
}

export function hashPersonalMessage(message: string): { rawMessage: string; messageHash: Hex } {
  const rawMessage = SIGN_PREFFIX + message.length.toString() + message;
  return {
    rawMessage,
    messageHash: bufferToHex(sha3(rawMessage)),
  };
}

export function recoverSigner(recovery: EthSignedMessageRecovery): EthAddress {
  const rsv = fromRpcSig(recovery.signature);
  const publicKey = ecrecover(toBuffer(recovery.messageHash), rsv.v, rsv.r, rsv.s);
  return toChecksumAddress(bufferToHex(publicToAddress(publicKey)));
}

export function hashContent(content: string | object): Hex {
  let serialized: string;
  if (typeof content !== "string") {
    serialized = JSON.stringify(content);
  } else {
    serialized = content;
  }
  return keccak256String(serialized);
}
