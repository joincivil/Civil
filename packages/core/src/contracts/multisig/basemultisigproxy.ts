import { isDeployedBytecodeEqual, isDefined } from "@joincivil/utils";

import { OwnableContract } from "../interfaces/ownable";
import { Multisig } from "./multisig";
import { TxHash, EthAddress, TwoStepEthTransaction } from "../../types";
import { EthApi } from "../../utils/ethapi";
import { artifacts } from "../generated/artifacts";
import { createTwoStepSimple, isDecodedLog } from "../utils/contracts";
import { MultiSigWallet } from "../generated/wrappers/multi_sig_wallet";

export class BaseMultisigProxy {
  protected ethApi: EthApi;
  protected multisig?: Multisig;
  // TODO(ritave): Add support for lowercase newsroom contract in abi-gen
  protected instance: OwnableContract;

  protected constructor(ethApi: EthApi, instance: OwnableContract) {
    this.ethApi = ethApi;
    this.instance = instance;
  }

  public async owners(): Promise<EthAddress[]> {
    if (!isDefined(this.multisig)) {
      return [await this.instance.owner.callAsync()];
    }
    return this.multisig.owners();
  }

  public async isOwner(address: EthAddress): Promise<boolean> {
    if (!isDefined(this.multisig)) {
      return (await this.instance.owner.callAsync()) === address;
    }
    return this.multisig.isOwner(address);
  }

  public async getMultisigAddress(): Promise<EthAddress | undefined> {
    if (isDefined(this.multisig)) {
      return this.multisig.address;
    }
    return undefined;
  }

  protected async resolveMultisig(): Promise<void> {
    const owner = await this.instance.owner.callAsync();
    // TODO(ritave): Have backwards compatibillity for older Multisig wallets and bytecodes
    const ownerCode = await this.ethApi.getCode(owner);
    if (isDeployedBytecodeEqual(artifacts.MultiSigWallet.deployedBytecode, ownerCode)) {
      this.multisig = Multisig.atUntrusted(this.ethApi, owner);
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
