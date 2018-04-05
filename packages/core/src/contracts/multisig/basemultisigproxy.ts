import { isDeployedBytecodeEqual } from "@joincivil/utils";

import { OwnableContract } from "../interfaces/ownable";
import { Multisig } from "./multisig";
import { TxHash } from "../../types";
import { Web3Wrapper } from "../../utils/web3wrapper";
import { artifacts } from "../generated/artifacts";

export class BaseMultisigProxy {
  protected web3Wrapper: Web3Wrapper;
  protected multisig: Multisig|null = null;
  protected instance: OwnableContract;

  protected constructor(web3Wrapper: Web3Wrapper, instance: OwnableContract) {
    this.web3Wrapper = web3Wrapper;
    this.instance = instance;
  }

  protected async resolveMultisig(): Promise<void> {
    const owner = await this.instance.owner.callAsync();
    // TODO(ritave): Have backwards compatibillity for older Multisig wallets and bytecodes
    const ownerCode = await this.web3Wrapper.getCode(owner);
    if (isDeployedBytecodeEqual(artifacts.MultiSigWallet.deployedBytecode, ownerCode)) {
      this.multisig = Multisig.atUntrusted(this.web3Wrapper, owner);
    }
  }
}

export interface MultisigProxyTransaction {
  txHash: TxHash;
}
