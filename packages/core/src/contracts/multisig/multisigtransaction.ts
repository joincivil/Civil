import BigNumber from "bignumber.js";

import { EthAddress, TwoStepEthTransaction } from "../../types";
import { Web3Wrapper } from "../../utils/web3wrapper";
import { MultiSigWalletContract } from "../generated/multi_sig_wallet";
import { createTwoStepTransaction } from "../utils/contracts";

// TODO(ritave): Move to ABI v2 to get support for structs
export class MultisigTransaction {
  public static async fromId(
    web3Wrapper: Web3Wrapper,
    instance: MultiSigWalletContract,
    id: number,
  ): Promise<MultisigTransaction> {
    const data = await instance.transactions.callAsync(new BigNumber(id));

    return new MultisigTransaction(web3Wrapper, instance, id, {
      destination: data[0],
      value: data[1],
      data: data[2],
      executed: data[3],
    });
  }

  public readonly id: number;
  public readonly information: Readonly<MultisigTransactionStruct>;

  private readonly web3Wrapper: Web3Wrapper;
  private readonly instance: MultiSigWalletContract;

  private constructor(
    web3Wrapper: Web3Wrapper,
    instance: MultiSigWalletContract,
    id: number,
    transactionData: MultisigTransactionStruct,
  ) {
    this.web3Wrapper = web3Wrapper;
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
      this.web3Wrapper,
      await this.instance.executeTransaction.sendTransactionAsync(new BigNumber(this.id)),
      async receipt => MultisigTransaction.fromId(this.web3Wrapper, this.instance, this.id),
    );
  }

  /**
   * Confirms that you as an owner want to send this transaction
   * If after this confirmation, the requirements are met, the transaction is additionally executed
   * @returns This transaction with the updated state
   */
  public async confirmTransaction(): Promise<TwoStepEthTransaction<MultisigTransaction>> {
    return createTwoStepTransaction(
      this.web3Wrapper,
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
      this.web3Wrapper,
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
