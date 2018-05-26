import { isDeployedBytecodeEqual, isDefined } from "@joincivil/utils";

import { Contract } from "../interfaces/contract";
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
  public static async isAddressMultisigWallet(ethApi: EthApi, address: EthAddress): Promise<boolean> {
    const code = await ethApi.getCode(address);
    // TODO(ritave): Have backwards compatibillity for older Multisig wallets and bytecodes
    return isDeployedBytecodeEqual(artifacts.MultiSigWallet.deployedBytecode, code);
  }

  protected ethApi: EthApi;
  protected multisig?: Multisig;
  // TODO(ritave): Add support for lowercase newsroom contract in abi-gen
  protected instance: Contract;

  protected constructor(ethApi: EthApi, instance: Contract) {
    this.ethApi = ethApi;
    this.instance = instance;
  }

  public get multisigEnabled(): boolean {
    return isDefined(this.multisig);
  }

  public async owners(): Promise<EthAddress[]> {
    if (isDefined(this.multisig)) {
      return this.multisig.owners();
    } else {
      return [];
    }
  }

  public async isOwner(address: EthAddress): Promise<boolean> {
    if (isDefined(this.multisig)) {
      return this.multisig.isOwner(address);
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
   * @param multisigAddress (optional) If supplied, instantiate multisig from that, otherwise `this.multisig` remains undefined
   */
  protected async resolveMultisig(multisigAddress?: EthAddress): Promise<void> {
    if (!multisigAddress) {
      return;
    }
    if (!(await BaseMultisigProxy.isAddressMultisigWallet(this.ethApi, multisigAddress))) {
      throw new Error("Expected multisig at address " + multisigAddress + " but none found");
    }

    this.multisig = Multisig.atUntrusted(this.ethApi, multisigAddress);
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
