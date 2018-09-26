import { EthApi, EthereumUnits, requireAccount, toWei } from "@joincivil/ethapi";
import { CivilErrors } from "@joincivil/utils";
import BigNumber from "bignumber.js";
import { Observable } from "rxjs";
import { EthAddress, TwoStepEthTransaction, TxDataAll } from "../../types";
import { BaseWrapper } from "../basewrapper";
import { MultiSigWallet, MultiSigWalletContract } from "../generated/wrappers/multi_sig_wallet";
import { createTwoStepSimple, createTwoStepTransaction, isDecodedLog } from "../utils/contracts";
import { MultisigTransaction } from "./multisigtransaction";

export class Multisig extends BaseWrapper<MultiSigWalletContract> {
  public static atUntrusted(ethApi: EthApi, address: EthAddress): Multisig {
    const instance = MultiSigWalletContract.atUntrusted(ethApi, address);
    return new Multisig(ethApi, instance);
  }

  public static async deployTrusted(
    ethApi: EthApi,
    owners: EthAddress[],
    required: number,
  ): Promise<TwoStepEthTransaction<Multisig>> {
    return createTwoStepTransaction(
      ethApi,
      await MultiSigWalletContract.deployTrusted.sendTransactionAsync(ethApi, owners, ethApi.toBigNumber(required)),
      receipt => new Multisig(ethApi, MultiSigWalletContract.atUntrusted(ethApi, receipt.contractAddress!)),
    );
  }

  private constructor(ethApi: EthApi, instance: MultiSigWalletContract) {
    super(ethApi, instance);
  }

  /**
   * A list of current owners that can submit, confirm and execute transactions
   * in this wallet
   */
  public async owners(): Promise<EthAddress[]> {
    return this.instance.getOwners.callAsync();
  }

  /**
   * Returns whether the provided address is one of the owners of the Wallet
   * @param address If null, checks your account, othwerise checks the provided address
   */
  public async isOwner(address?: EthAddress): Promise<boolean> {
    const who = address || (await requireAccount(this.ethApi).toPromise());
    return this.instance.isOwner.callAsync(who);
  }

  /**
   * How many owners need to confirm a submited transaction before it's allowed to be executed
   */
  public async required(): Promise<number> {
    return (await this.instance.required.callAsync()).toNumber();
  }

  /**
   * Adds an additional owner to the Wallet
   * This transaction can be only done by the wallet itself - this means it's multistep.
   * First a current owner submits a new transaction to the wallet, not actually adding owner.
   * When that transaction is executed by the required number of owners, then the new owner is added
   * @param owner New owner in the Wallet
   */
  public async addOwner(owner: EthAddress): Promise<TwoStepEthTransaction<MultisigTransaction>> {
    await this.requireOwner();

    const options = await this.instance.addOwner.getRaw(owner, { gas: 0 });
    return this.submitTransaction(this.address, this.ethApi.toBigNumber(0), options.data!);
  }

  public async estimateAddOwner(owner: EthAddress): Promise<number> {
    await this.requireOwner();
    const options = await this.instance.addOwner.getRaw(owner, { gas: 0 });
    return this.estimateTransaction(this.address, this.ethApi.toBigNumber(0), options.data!);
  }

  /**
   * Removes an owner from the Wallet
   * This transaction can be only done by the wallet itself - this means it's multistep.
   * First a current owner submits a new transaction to the wallet, not actually removing owner.
   * When that transaciton is executed by the required number of owners, then the owner is removed.
   *
   * Additionally, there can't be less owners then the number of required confirmations of the transaction
   *
   * @param owner New owner in the Wallet
   */
  public async removeOwner(owner: EthAddress): Promise<TwoStepEthTransaction<MultisigTransaction>> {
    await this.requireOwner();

    const options = await this.instance.removeOwner.getRaw(owner, { gas: 0 });
    return this.submitTransaction(this.address, this.ethApi.toBigNumber(0), options.data!);
  }

  /**
   * Swaps some existing owner in the Wallet for a new address
   * This transaction can be only done by the wallet itself - this means it's multistep.
   * First a current owner submits a new transaction to the wallet, not actually swapping.
   * When that transaction is executed by the required number of owners, then the owners are swapped.
   *
   * This can be used to minimize the amount of transactions, or to ensure proper balacne of power during exchange
   *
   * @param owner New owner in the Wallet
   */
  public async replaceOwner(
    oldOwner: EthAddress,
    newOwner: EthAddress,
  ): Promise<TwoStepEthTransaction<MultisigTransaction>> {
    await this.requireOwner();

    const options = await this.instance.replaceOwner.getRaw(oldOwner, newOwner, { gas: 0 });
    return this.submitTransaction(this.address, this.ethApi.toBigNumber(0), options.data!);
  }

  /**
   * Sends money from the current active account to the multisig wallet
   * @param ethers How many ethers to send
   */
  public async transferEther(ethers: BigNumber): Promise<TwoStepEthTransaction> {
    const wei = toWei(ethers, EthereumUnits.ether);
    return createTwoStepSimple(this.ethApi, await this.ethApi.sendTransaction({ to: this.address, value: wei }));
  }

  /**
   * Changes how many confirmations the transaction needs to have before it can be executed
   * This transaction can be only done by the wallet itself - this means it's multistep.
   * First a current owner submits a new transaction to the wallet, not actually changing.
   * When that transaction is executed by the required number of owners, then the requirement is changed.
   *
   * Additionally, the required number of confirmations can't be higher than number of owners
   *
   * @param newRequired New required number of confirmations
   */
  public async changeRequirement(newRequired: number): Promise<TwoStepEthTransaction<MultisigTransaction>> {
    await this.requireOwner();

    const options = await this.instance.changeRequirement.getRaw(this.ethApi.toBigNumber(newRequired), { gas: 0 });
    return this.submitTransaction(this.address, this.ethApi.toBigNumber(0), options.data!);
  }

  /**
   * Low-level call
   * Requests that a transaction is sent from this Multisignature wallet.
   * If the amount of required owners is 1, it is executed immediately.
   * Otherwise it's put in the list of awaiting transactions.
   * The required number of owners need to confirm that they approve this transaction.
   * With the last transaction, it is sent out to the world.
   * @param address Who is the receipent of this transaction
   * @param weiToSend How much value to you want to send through this transaction
   * @param payload What bytes do you want to send along as the payload
   */
  public async submitTransaction(
    address: EthAddress,
    weiToSend: BigNumber,
    payload: string,
  ): Promise<TwoStepEthTransaction<MultisigTransaction>> {
    return createTwoStepTransaction(
      this.ethApi,
      await this.instance.submitTransaction.sendTransactionAsync(address, weiToSend, payload),
      async receipt => {
        const event = receipt.logs.filter(isDecodedLog).find(log => log.event === MultiSigWallet.Events.Submission);
        if (!event) {
          throw new Error("No Submisison event found when adding transaction to Multisig");
        }
        return this.transaction((event.args as MultiSigWallet.Args.Submission).transactionId.toNumber());
      },
    );
  }

  public async confirmTransaction(txId: number): Promise<TwoStepEthTransaction<MultisigTransaction>> {
    return createTwoStepTransaction(
      this.ethApi,
      await this.instance.confirmTransaction.sendTransactionAsync(this.ethApi.toBigNumber(txId)),
      async receipt => {
        const event = receipt.logs.filter(isDecodedLog).find(log => log.event === MultiSigWallet.Events.Confirmation);
        if (!event) {
          throw new Error("No Confirmation event found when confirming transaction to Multisig");
        }
        return this.transaction((event.args as MultiSigWallet.Args.Confirmation).transactionId.toNumber());
      },
    );
  }

  public async estimateTransaction(address: EthAddress, weiToSend: BigNumber, payload: string): Promise<number> {
    return this.instance.submitTransaction.estimateGasAsync(address, weiToSend, payload, {});
  }

  public async getRawTransaction(address: EthAddress, weiToSend: BigNumber, payload: string): Promise<TxDataAll> {
    return this.instance.submitTransaction.getRaw(address, weiToSend, payload, { gas: 0 });
  }

  /**
   * Counts how many transactions, with those specific criteria set by filters are in this multisig
   * @param filters Change which transactions are counted.
   */
  public async transactionCount(filters: TransactionFilters = { pending: true }): Promise<number> {
    return (await this.instance.getTransactionCount.callAsync(
      filters.pending || false,
      filters.executed || false,
    )).toNumber();
  }

  // TODO(ritave): Support pagination
  /**
   * Returns a finite stream of transactions according to the filters.
   * This call takes quite a long time due to network communication, and thus
   * is a RXJS stream. The transactions will show up in the subscription as they come, in the increasing
   * order of ids, starting from id 0.
   * @param filters What kind of transactions to return
   */
  public transactions(filters: TransactionFilters = { pending: true }): Observable<MultisigTransaction> {
    // Notice that we're using transactionCount smart-contract variable, not getTransactonCount func
    return Observable.fromPromise(
      this.instance.getTransactionCount.callAsync(filters.pending || false, filters.executed || false),
    )
      .concatMap(async numTransactions =>
        this.instance.getTransactionIds.callAsync(
          this.ethApi.toBigNumber(0),
          this.ethApi.toBigNumber(numTransactions),
          filters.pending || false,
          filters.executed || false,
        ),
      )
      .concatMap(ids => Observable.from(ids))
      .concatMap(async id => this.transaction(id.toNumber()));
  }

  /**
   * Returns a singular transaction
   * @param id Id the of the wanted transaction
   */
  public async transaction(id: number): Promise<MultisigTransaction> {
    return MultisigTransaction.fromId(this.ethApi, this.instance, id);
  }

  private async requireOwner(who?: EthAddress): Promise<void> {
    const owner = who || (await requireAccount(this.ethApi).toPromise());
    if (!(await this.isOwner(owner))) {
      throw new Error(CivilErrors.NoPrivileges);
    }
  }
}

export interface TransactionFilters {
  pending?: boolean;
  executed?: boolean;
}
