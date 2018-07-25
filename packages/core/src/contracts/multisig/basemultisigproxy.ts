import { isDefined, isDeployedBytecodeEqual } from "@joincivil/utils";
import { EthAddress, TwoStepEthTransaction, TxHash } from "../../types";
import { EthApi } from "@joincivil/ethapi";
import { artifacts } from "../generated/artifacts";
import { MultiSigWallet } from "../generated/wrappers/multi_sig_wallet";
import { Contract } from "../interfaces/contract";
import { createTwoStepSimple, isDecodedLog, isOwnableContract } from "../utils/contracts";
import { Multisig } from "./multisig";

/**
 * Proxies functionionality to a contract instance via multisig wallet. Also supports instantiation *without* multisig proxy, in which case calls are passed directly to the contract. If the wrapped contract has an `owner` property, it will be checked to see if the owner is a multisig wallet.
 */
export class BaseMultisigProxy {
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

  public requireMultisig(): Multisig {
    if (!this.multisig) {
      throw new Error("Unexpected state happened, multisig not found but required");
    }
    return this.multisig;
  }

  public async owners(): Promise<EthAddress[]> {
    if (isDefined(this.multisig)) {
      return this.multisig.owners();
    } else if (isOwnableContract(this.instance) && this.instance.owner) {
      return [await this.instance.owner.callAsync()];
    } else {
      return [];
    }
  }

  public async isOwner(address: EthAddress): Promise<boolean> {
    if (isDefined(this.multisig)) {
      return this.multisig.isOwner(address);
    } else if (isOwnableContract(this.instance) && this.instance.owner) {
      return address === (await this.instance.owner.callAsync());
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

  public async isAddressMultisigWallet(address: EthAddress): Promise<boolean> {
    const code = await this.ethApi.getCode(address);
    // TODO(ritave): Have backwards compatibillity for older Multisig wallets and bytecodes
    return isDeployedBytecodeEqual(artifacts.MultiSigWallet.deployedBytecode, code);
  }

  /**
   * Instantiate `this.multisig` if appropriate.
   * @param multisigAddress (optional) If supplied, instantiate multisig from that, otherwise instance contract will be checked for multisig owner, and if none found, `this.multisig` remains undefined
   */
  protected async resolveMultisig(multisigAddress?: EthAddress): Promise<void> {
    if (multisigAddress) {
      if (!(await this.isAddressMultisigWallet(multisigAddress))) {
        throw new Error("Expected multisig at address " + multisigAddress + " but none found");
      }
      this.multisig = Multisig.atUntrusted(this.ethApi, multisigAddress);
    } else if (isOwnableContract(this.instance) && this.instance.owner) {
      const ownerAddress = await this.instance.owner.callAsync();
      if (await this.isAddressMultisigWallet(ownerAddress)) {
        this.multisig = Multisig.atUntrusted(this.ethApi, ownerAddress);
      }
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
