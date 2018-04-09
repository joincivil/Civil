import { isDeployedBytecodeEqual, isDefined } from "@joincivil/utils";
import * as Web3 from "web3";

import { OwnableContract } from "../interfaces/ownable";
import { Multisig } from "./multisig";
import { TxHash, EthAddress, TwoStepEthTransaction } from "../../types";
import { Web3Wrapper } from "../../utils/web3wrapper";
import { artifacts } from "../generated/artifacts";
import { createTwoStepSimple, isDecodedLog } from "../utils/contracts";
import { MultiSigWalletEvents, SubmissionArgs } from "../generated/multi_sig_wallet";

export class BaseMultisigProxy<T extends OwnableContract> {
  protected web3Wrapper: Web3Wrapper;
  protected multisig?: Multisig;
  protected instance: T;

  protected constructor(web3Wrapper: Web3Wrapper, instance: T) {
    this.web3Wrapper = web3Wrapper;
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

  protected async resolveMultisig(): Promise<void> {
    const owner = await this.instance.owner.callAsync();
    // TODO(ritave): Have backwards compatibillity for older Multisig wallets and bytecodes
    const ownerCode = await this.web3Wrapper.getCode(owner);
    if (isDeployedBytecodeEqual(artifacts.MultiSigWallet.deployedBytecode, ownerCode)) {
      this.multisig = Multisig.atUntrusted(this.web3Wrapper, owner);
    }
  }

  protected emptyProxyTransaction(txHash: TxHash): MultisigProxyTransaction {
    return createTwoStepSimple(this.web3Wrapper, txHash);
  }

  protected createProxyTransaction(txHash: TxHash): MultisigProxyTransaction {
    const twoStep = createTwoStepSimple(this.web3Wrapper, txHash);
    return {
      ...twoStep,
      isProxied: true,
      proxiedId: async () => {
        const receipt = await twoStep.awaitReceipt();
        const submissionLogs: Array<Web3.DecodedLogEntry<SubmissionArgs>> = receipt.logs
          .filter(log => isDecodedLog(log) && log.event === MultiSigWalletEvents.Submission)
          .map(log => log as Web3.DecodedLogEntry<SubmissionArgs>);
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
