import BigNumber from "bignumber.js";
import { Observable } from "rxjs";

import { BaseWrapper } from "./basewrapper";
import { MultiSigWalletContract, MultiSigWalletEvents, SubmissionArgs } from "./generated/multi_sig_wallet";
import { Web3Wrapper } from "../utils/web3wrapper";
import { EthAddress, TwoStepEthTransaction } from "..";
import { requireAccount, CivilErrors } from "../utils/errors";
import { createTwoStepTransaction, createTwoStepSimple, isDecodedLog } from "../utils/contractutils";

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
      await MultiSigWalletContract
        .deployTrusted
        .sendTransactionAsync(web3Wrapper, owners, new BigNumber(required)),
      (receipt) => new Multisig(web3Wrapper, MultiSigWalletContract.atUntrusted(web3Wrapper, receipt.contractAddress!)),
    );
  }

  private constructor(web3Wrapper: Web3Wrapper, instance: MultiSigWalletContract) {
    super(web3Wrapper, instance);
  }

  public async owners(): Promise<EthAddress[]> {
    return this.instance.getOwners.callAsync();
  }

  public async isOwner(address?: EthAddress): Promise<boolean> {
    const who = address || requireAccount(this.web3Wrapper);
    return this.instance.isOwner.callAsync(who);
  }

  public async required(): Promise<number> {
    return (await this.instance.required.callAsync()).toNumber();
  }

  public async addOwner(owner: EthAddress): Promise<TwoStepEthTransaction<MultisigTransaction>> {
    await this.requireOwner();

    const options = await this.instance.addOwner.getRaw(owner, { gas: 0 });
    return this.submitTransaction(this.address, new BigNumber(0), options.data!);
  }

  public async removeOwner(owner: EthAddress): Promise<TwoStepEthTransaction<MultisigTransaction>> {
    await this.requireOwner();

    const options = await this.instance.removeOwner.getRaw(owner, { gas: 0 });
    return this.submitTransaction(this.address, new BigNumber(0), options.data!);
  }

  public async replaceOwner(
    oldOwner: EthAddress,
    newOwner: EthAddress,
  ): Promise<TwoStepEthTransaction<MultisigTransaction>> {
    await this.requireOwner();

    const options = await this.instance.replaceOwner.getRaw(oldOwner, newOwner, { gas: 0 });
    return this.submitTransaction(this.address, new BigNumber(0), options.data!);
  }

  public async transferEther(ethers: BigNumber): Promise<TwoStepEthTransaction> {
    const wei = this.web3Wrapper.web3.toWei(ethers.toString(), "ether");
    return createTwoStepSimple(
      this.web3Wrapper,
      await this.web3Wrapper.sendTransaction({ to: this.address, value: wei }),
    );
  }

  public async changeRequirement(newRequired: number): Promise<TwoStepEthTransaction<MultisigTransaction>> {
    await this.requireOwner();

    const options = await this.instance.changeRequirement.getRaw(new BigNumber(newRequired), { gas: 0 });
    return this.submitTransaction(this.address, new BigNumber(0), options.data!);
  }

  public async submitTransaction(
    address: EthAddress,
    weiToSend: BigNumber,
    payload: string,
  ): Promise<TwoStepEthTransaction<MultisigTransaction>> {
    return createTwoStepTransaction(
      this.web3Wrapper,
      await this.instance.submitTransaction.sendTransactionAsync(address, weiToSend, payload),
      (receipt) => {
        const event = receipt.logs.filter(isDecodedLog).find((log) => log.event === MultiSigWalletEvents.Submission);
        if (!event) {
          throw new Error("No Submisison event found when adding transaction to Multisig");
        }
        return this.transaction((event.args as SubmissionArgs).transactionId.toNumber());
      },
    );
  }

  public async transactionCount(filters: TransactionFilters = { pending: true }): Promise<number> {
    return (await this.instance
      .getTransactionCount.callAsync(filters.pending || false, filters.executed || false))
    .toNumber();
  }

  // This call might take a while, that's why it's a stream that can be quickly displayed on the user interface
  // TODO(ritave): Support pagination
  public transactions(
    filters: TransactionFilters = { pending: true },
  ): Observable<MultisigTransaction> {
     // Notice that we're using transactionCount smart-contract variable, not getTransactonCount func
    return Observable
      .fromPromise(this.instance.transactionCount.callAsync())
      .concatMap((noTransactions) =>
        this.instance.getTransactionIds.callAsync(
          new BigNumber(0),
          noTransactions,
          filters.pending || false,
          filters.executed || false))
      .concatMap((ids) => Observable.from(ids))
      .concatMap((id) => this.transaction(id.toNumber()));
  }

  public transaction(id: number): Promise<MultisigTransaction> {
    return transactionFromId(this.web3Wrapper, this.instance, id);
  }

  private async requireOwner(who?: EthAddress): Promise<void> {
    const owner = who || this.web3Wrapper.account;
    if (!(await this.isOwner(owner))) {
      throw new Error(CivilErrors.NoPrivileges);
    }
  }
}

export interface TransactionFilters {
  pending?: boolean;
  executed?: boolean;
}

export interface MultisigTransactionStruct {
  destination: EthAddress;
  value: BigNumber;
  data: string;
  executed: boolean;
}

// TODO(ritave): Move to ABI v2 to get support for structs
export class MultisigTransaction {
  public readonly id: number;
  public readonly information: Readonly<MultisigTransactionStruct>;

  private readonly web3Wrapper: Web3Wrapper;
  private readonly instance: MultiSigWalletContract;

  constructor(
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

  public async canBeExecuted(): Promise<boolean> {
    return !this.information.executed && this.instance.isConfirmed.callAsync(new BigNumber(this.id));
  }

  public confirmations(): Promise<EthAddress[]> {
    return this.instance.getConfirmations.callAsync(new BigNumber(this.id));
  }

  public async execute(): Promise<TwoStepEthTransaction<MultisigTransaction>> {
    return createTwoStepTransaction(
      this.web3Wrapper,
      await this.instance.executeTransaction.sendTransactionAsync(new BigNumber(this.id)),
      (receipt) => transactionFromId(this.web3Wrapper, this.instance, this.id),
    );
  }

  public async confirmTransaction(): Promise<TwoStepEthTransaction<MultisigTransaction>> {
    return createTwoStepTransaction(
      this.web3Wrapper,
      await this.instance.confirmTransaction.sendTransactionAsync(new BigNumber(this.id)),
      (receipt) => this,
    );
  }
  public async revokeConfirmation(): Promise<TwoStepEthTransaction<MultisigTransaction>> {
    return createTwoStepTransaction(
      this.web3Wrapper,
      await this.instance.revokeConfirmation.sendTransactionAsync(new BigNumber(this.id)),
      (receipt) => this,
    );
  }
}

async function transactionFromId(
  web3Wrapper: Web3Wrapper,
  instance: MultiSigWalletContract,
  id: number,
): Promise<MultisigTransaction> {
  const data = await instance.transactions.callAsync(new BigNumber(id));

  return new MultisigTransaction(
    web3Wrapper,
    instance,
    id,
    {
      destination: data[0],
      value: data[1],
      data: data[2],
      executed: data[3],
    },
  );
}
