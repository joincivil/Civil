import { isDeployedBytecodeEqual, isDefined } from "@joincivil/utils";

import { Contract } from "../interfaces/contract";
import { OwnableContract } from "../interfaces/ownable";
import { Multisig } from "./multisig";
import { TxHash, EthAddress, TwoStepEthTransaction } from "../../types";
import { EthApi } from "../../utils/ethapi";
import { artifacts } from "../generated/artifacts";
import { createTwoStepSimple, isDecodedLog } from "../utils/contracts";
import { MultiSigWallet } from "../generated/wrappers/multi_sig_wallet";

/**
 * Proxies functionionality to a contract instance via multisig wallet. Also supports instantiation *without* multisig proxy, in which case calls are passed directly to the contract.
 */
export class BaseMultisigProxy {
  protected ethApi: EthApi;
  protected contractOwner?: EthAddress;
  protected multisig?: Multisig;
  // TODO(ritave): Add support for lowercase newsroom contract in abi-gen
  protected instance: Contract | OwnableContract;

  protected constructor(ethApi: EthApi, instance: Contract | OwnableContract, contractOwner?: EthAddress) {
    this.ethApi = ethApi;
    this.instance = instance;
    this.contractOwner = contractOwner;
  }

  public async owners(): Promise<EthAddress[]> {
    if (isDefined(this.multisig)) {
      return this.multisig.owners();
    } else if (this.contractOwner) {
      return [this.contractOwner];
    } else {
      return [];
    }
  }

  public async isOwner(address: EthAddress): Promise<boolean> {
    if (isDefined(this.multisig)) {
      return this.multisig.isOwner(address);
    } else if (this.contractOwner) {
      return this.contractOwner === address;
    } else {
      return false;
    }
  }

  public async getMultisigAddress(): Promise<EthAddress | undefined> {
    if (isDefined(this.multisig)) {
      return this.multisig.address;
    }
    return undefined;
  }

  /**
   * Instantiate `this.multisig` if appropriate.
   * @param multisigAddress (optional) If supplied, instantiate multisig from that, otherwise check if `this.contractOwner` is a multisig wallet and instantiate from that. Otherwise `this.multisig` remains undefined.
   */
  protected async resolveMultisig(multisigAddress?: EthAddress): Promise<void> {
    if (multisigAddress) {
      this.multisig = Multisig.atUntrusted(this.ethApi, multisigAddress);
      return;
    }

    if (!this.contractOwner) {
      return;
    }

    // TODO(ritave): Have backwards compatibillity for older Multisig wallets and bytecodes
    const ownerCode = await this.ethApi.getCode(this.contractOwner);
    if (isDeployedBytecodeEqual(artifacts.MultiSigWallet.deployedBytecode, ownerCode)) {
      this.multisig = Multisig.atUntrusted(this.ethApi, this.contractOwner);
    }
  }

  protected createProxyTransaction(txHash: TxHash): MultisigProxyTransaction {
    const twoStep = createTwoStepSimple(this.ethApi, txHash);
    return {
      ...twoStep,
      isProxied: true,
      proxiedId: async () => {
        const receipt = await twoStep.awaitReceipt();
        const submissionLogs = receipt.logs
          .filter(log => isDecodedLog(log) && log.event === MultiSigWallet.Events.Submission)
          .map(log => log as MultiSigWallet.Logs.Submission);
        if (submissionLogs.length !== 1) {
          throw new Error("Too many Submission events than expected in multisig");
        }
        return submissionLogs[0].args.transactionId.toNumber();
      },
    };
  }
}

export interface MultisigProxyTransaction extends TwoStepEthTransaction {
  readonly isProxied?: true;
  proxiedId?(): Promise<number>;
}
