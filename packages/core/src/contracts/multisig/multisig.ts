import BigNumber from "bignumber.js";
import { Observable } from "rxjs";

import { MultisigTransaction } from "./multisigtransaction";
import { BaseWrapper } from "../basewrapper";
import { MultiSigWalletContract, MultiSigWalletEvents, SubmissionArgs } from "../generated/multi_sig_wallet";
import { Web3Wrapper } from "../../utils/web3wrapper";
import { EthAddress, TwoStepEthTransaction } from "../../types";
import { createTwoStepTransaction, createTwoStepSimple, isDecodedLog } from "../utils/contracts";
import { requireAccount, CivilErrors } from "../../utils/errors";

export class Multisig extends BaseWrapper<MultiSigWalletContract> {
  public static atUntrusted(web3Wrapper: Web3Wrapper, address: EthAddress): Multisig {
    const instance = MultiSigWalletContract.atUntrusted(web3Wrapper, address);
    return new Multisig(web3Wrapper, instance);
  }

  public static async deployTrusted(
    web3Wrapper: Web3Wrapper,
    owners: EthAddress[],
    required: number,
  ): Promise<TwoStepEthTransaction<Multisig>> {
    return createTwoStepTransaction(
      web3Wrapper,
      await MultiSigWalletContract.deployTrusted.sendTransactionAsync(web3Wrapper, owners, new BigNumber(required)),
      receipt => new Multisig(web3Wrapper, MultiSigWalletContract.atUntrusted(web3Wrapper, receipt.contractAddress!)),
    );
  }

  private constructor(web3Wrapper: Web3Wrapper, instance: MultiSigWalletContract) {
    super(web3Wrapper, instance);
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
    const who = address || requireAccount(this.web3Wrapper);
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
    return this.submitTransaction(this.address, new BigNumber(0), options.data!);
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
    return this.submitTransaction(this.address, new BigNumber(0), options.data!);
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
    return this.submitTransaction(this.address, new BigNumber(0), options.data!);
  }

  /**
   * Sends money from the current active account to the multisig wallet
   * @param ethers How many ethers to send
   */
  public async transferEther(ethers: BigNumber): Promise<TwoStepEthTransaction> {
    const wei = this.web3Wrapper.web3.toWei(ethers.toString(), "ether");
    return createTwoStepSimple(
      this.web3Wrapper,
      await this.web3Wrapper.sendTransaction({ to: this.address, value: wei }),
    );
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

    const options = await this.instance.changeRequirement.getRaw(new BigNumber(newRequired), { gas: 0 });
    return this.submitTransaction(this.address, new BigNumber(0), options.data!);
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
      this.web3Wrapper,
      await this.instance.submitTransaction.sendTransactionAsync(address, weiToSend, payload),
      async receipt => {
        const event = receipt.logs.filter(isDecodedLog).find(log => log.event === MultiSigWalletEvents.Submission);
        if (!event) {
          throw new Error("No Submisison event found when adding transaction to Multisig");
        }
        return this.transaction((event.args as SubmissionArgs).transactionId.toNumber());
      },
    );
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
    return Observable.fromPromise(this.instance.transactionCount.callAsync())
      .concatMap(async noTransactions =>
        this.instance.getTransactionIds.callAsync(
          new BigNumber(0),
          noTransactions,
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
    return MultisigTransaction.fromId(this.web3Wrapper, this.instance, id);
  }

  private async requireOwner(who?: EthAddress): Promise<void> {
    const owner = who || this.web3Wrapper.account;
    if (!await this.isOwner(owner)) {
      throw new Error(CivilErrors.NoPrivileges);
    }
  }
}

export interface TransactionFilters {
  pending?: boolean;
  executed?: boolean;
}
