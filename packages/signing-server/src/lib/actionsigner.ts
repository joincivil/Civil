import hdkey = require("ethereumjs-wallet/hdkey");
import { prepareForceUnionMessage, prepareMaxGroupSizeMessage } from "@joincivil/utils";
import { mnemonicToSeed, validateMnemonic } from "bip39";
import { bufferToHex, ecsign, hashPersonalMessage, toBuffer, toRpcSig } from "ethereumjs-util";
import BN = require("bn.js");

const WALLET_HDPATH = "m/44'/60'/0'/0/";

export class ActionSigner {
  public static fromMnemonic(mnemonic: string, addressIndex: number = 0): ActionSigner {
    if (!validateMnemonic(mnemonic)) {
      throw new Error("Not a valid mnemonic");
    }
    const hdwallet = hdkey.fromMasterSeed(mnemonicToSeed(mnemonic));
    const privateKey = hdwallet
      .derivePath(WALLET_HDPATH + addressIndex)
      .getWallet()
      .getPrivateKey();
    return new ActionSigner(privateKey);
  }

  private privateKey: Buffer;

  private constructor(privateKey: Buffer) {
    this.privateKey = privateKey;
  }

  public signUnion(userGroupAddress: Buffer, addressA: Buffer, addressB: Buffer): string {
    return this.actionToSignedMessage(
      toBuffer(prepareForceUnionMessage(bufferToHex(userGroupAddress), bufferToHex(addressA), bufferToHex(addressB))),
    );
  }

  public signMaxGroupSize(userGroupAddress: Buffer, nonce: BN, groupSize: BN): string {
    return this.actionToSignedMessage(
      toBuffer(prepareMaxGroupSizeMessage(bufferToHex(userGroupAddress), nonce.toNumber(), groupSize.toNumber())),
    );
  }

  private actionToSignedMessage(message: Buffer): string {
    const signature = ecsign(hashPersonalMessage(message), this.privateKey);
    return toRpcSig(signature.v, signature.r, signature.s);
  }
}
