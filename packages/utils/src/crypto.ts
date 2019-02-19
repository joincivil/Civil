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
import { recoverPersonalSignature } from "eth-sig-util";
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

export function recoverSignerPersonal(recovery: { message: string; signature: Hex }): EthAddress {
  return recoverPersonalSignature({
    data: bufferToHex(toBuffer(recovery.message)),
    sig: recovery.signature,
  });
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

export const networkNames: { [index: string]: string } = {
  1: "main",
  2: "morden",
  3: "ropsten",
  4: "rinkeby",
  50: "ganache",
};

export function isWellFormattedAddress(address: EthAddress): boolean {
  return /^(0x)?[0-9a-f]{40}$/i.test(address);
}

export async function isEthereumEnabled(): Promise<boolean> {
  if ((window as any).ethereum) {
    try {
      return !!(await (window as any).ethereum.enable());
    } catch (e) {
      return false;
    }
  } else {
    return true;
  }
}

export async function enableEthereum(): Promise<any> {
  if ((window as any).ethereum) {
    return await (window as any).ethereum.enable();
  }
}
