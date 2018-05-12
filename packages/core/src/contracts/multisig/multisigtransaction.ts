import BigNumber from "bignumber.js";

import { EthAddress, TwoStepEthTransaction } from "../../types";
import { EthApi } from "../../utils/ethapi";
import { MultiSigWalletContract } from "../generated/wrappers/multi_sig_wallet";
import { createTwoStepTransaction } from "../utils/contracts";

// TODO(ritave): Move to ABI v2 to get support for structs
export class MultisigTransaction {
  public static async fromId(
    ethApi: EthApi,
    instance: MultiSigWalletContract,
    id: number,
  ): Promise<MultisigTransaction> {
    const data = await instance.transactions.callAsync(new BigNumber(id));

    return new MultisigTransaction(ethApi, instance, id, {
      destination: data[0],
      value: data[1],
      data: data[2],
      executed: data[3],
    });
  }

  public readonly id: number;
  public readonly information: Readonly<MultisigTransactionStruct>;

  private readonly ethApi: EthApi;
  private readonly instance: MultiSigWalletContract;

  private constructor(
    ethApi: EthApi,
    instance: MultiSigWalletContract,
    id: number,
    transactionData: MultisigTransactionStruct,
  ) {
    this.ethApi = ethApi;
    this.instance = instance;

    this.id = id;
    this.information = transactionData;
  }

  /**
   * Returns whether this transaction can be executed:
   *  - Wasn't executed beforehand
   *  - Has enough confirmations
   */
  public async canBeExecuted(): Promise<boolean> {
    return !this.information.executed && this.instance.isConfirmed.callAsync(new BigNumber(this.id));
  }

  /**
   * Returns how many confirmations this Transaction needs to be executed
   * This is a sugar function, which is the same as the one in the main Multisig wrapper
   */
  public async requiredConfirmations(): Promise<number> {
    return (await this.instance.required.callAsync()).toNumber();
  }

  /**
   * How many owners (and who) have confirmed this transaction
   */
  public async confirmations(): Promise<EthAddress[]> {
    return this.instance.getConfirmations.callAsync(new BigNumber(this.id));
  }

  /**
   * Execute a transaction.
   * Most of the time, the transaction is executed during confirmation or submition.
   * This call is mostly useful when you change owners or requirements
   * and then need to execute transactions
   * @returns This transaction with the updated state
   */
  public async execute(): Promise<TwoStepEthTransaction<MultisigTransaction>> {
    return createTwoStepTransaction(
      this.ethApi,
      await this.instance.executeTransaction.sendTransactionAsync(new BigNumber(this.id)),
      async receipt => MultisigTransaction.fromId(this.ethApi, this.instance, this.id),
    );
  }

  /**
   * Confirms that you as an owner want to send this transaction
   * If after this confirmation, the requirements are met, the transaction is additionally executed
   * @returns This transaction with the updated state
   */
  public async confirmTransaction(): Promise<TwoStepEthTransaction<MultisigTransaction>> {
    return createTwoStepTransaction(
      this.ethApi,
      await this.instance.confirmTransaction.sendTransactionAsync(new BigNumber(this.id)),
      receipt => this,
    );
  }
  /**
   * Revokes your confirmation before the transaction is executed.
   * @returns This transaciton with the updated state
   */
  public async revokeConfirmation(): Promise<TwoStepEthTransaction<MultisigTransaction>> {
    return createTwoStepTransaction(
      this.ethApi,
      await this.instance.revokeConfirmation.sendTransactionAsync(new BigNumber(this.id)),
      receipt => this,
    );
  }
}

export interface MultisigTransactionStruct {
  destination: EthAddress;
  value: BigNumber;
  data: string;
  executed: boolean;
}
