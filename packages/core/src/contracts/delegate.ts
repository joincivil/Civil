import { currentAccount, EthApi, requireAccount } from "@joincivil/ethapi";

import * as Debug from "debug";
import { TransactionReceipt, TxData } from "web3";

import { BaseWrapper } from "./basewrapper";
import { Delegate as Events, DelegateContract } from "./generated/wrappers/delegate";
import { DelegateFactory, DelegateFactoryContract } from "./generated/wrappers/delegate_factory";

import { createTwoStepTransaction, findEvents, createTwoStepSimple } from "./utils/contracts";
import { Uri, EthAddress, DecodedLogEntryEvent } from "@joincivil/typescript-types";
import { CivilErrors, getDefaultFromBlock } from "@joincivil/utils";
import { TwoStepEthTransaction } from "../types";
import { Observable } from "rxjs";
import BigNumber from "@joincivil/ethapi/node_modules/bignumber.js";

export interface ExitingDeposit {
  numTokens: BigNumber;
  releaseTime: BigNumber;
}

export class Delegate extends BaseWrapper<DelegateContract> {
  public static async deployTrusted(ethApi: EthApi, charterUri: Uri = ""): Promise<TwoStepEthTransaction<Delegate>> {
    const account = await requireAccount(ethApi).toPromise();
    const txData: TxData = { from: account };

    const factory = await DelegateFactoryContract.singletonTrusted(ethApi);

    return createTwoStepTransaction(
      ethApi,
      await factory!.createDelegate.sendTransactionAsync(charterUri, txData),
      async factoryReceipt => {
        return Delegate.fromFactoryReceipt(factoryReceipt, ethApi);
      },
    );
  }

  public static async fromFactoryReceipt(factoryReceipt: TransactionReceipt, ethApi: EthApi): Promise<Delegate> {
    const factory = await DelegateFactoryContract.singletonTrusted(ethApi);
    if (!factory) {
      throw new Error(CivilErrors.UnsupportedNetwork);
    }
    const createdDelegate = findEvents<DelegateFactory.Logs._DelegateCreated>(
      factoryReceipt,
      DelegateFactory.Events._DelegateCreated,
    ).find(log => log.address === factory!.address);

    if (!createdDelegate) {
      throw new Error("No Newsroom created during deployment through factory");
    }

    const contract = DelegateContract.atUntrusted(ethApi, createdDelegate.args.delegateAddress);
    return new Delegate(ethApi, contract);
  }

  public static atUntrusted(ethApi: EthApi, address: EthAddress): Delegate {
    const contract = DelegateContract.atUntrusted(ethApi, address);
    return new Delegate(ethApi, contract);
  }

  public static async delegatesCreated(
    ethApi: EthApi,
  ): Promise<Observable<DecodedLogEntryEvent<DelegateFactory.Args._DelegateCreated, DelegateFactory.Events>>> {
    const factory = await DelegateFactoryContract.singletonTrusted(ethApi);

    return factory!._DelegateCreatedStream({}, { fromBlock: getDefaultFromBlock(ethApi.network()) });
  }

  private constructor(ethApi: EthApi, instance: DelegateContract) {
    super(ethApi, instance);
  }

  public async charterUri(): Promise<string> {
    return this.instance.charter.callAsync();
  }

  public async totalDeposits(): Promise<BigNumber> {
    return this.instance.totalDeposits.callAsync();
  }

  public async userDeposit(user: EthAddress): Promise<BigNumber> {
    return this.instance.deposits.callAsync(user);
  }

  public async userExitingDeposit(user: EthAddress): Promise<ExitingDeposit> {
    const [numTokens, releaseTime] = await this.instance.exitingDeposits.callAsync(user);
    return {
      numTokens,
      releaseTime,
    };
  }

  public async deposit(numTokens: BigNumber): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(this.ethApi, await this.instance.deposit.sendTransactionAsync(numTokens));
  }

  public async beginWithdrawal(numTokens: BigNumber): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(this.ethApi, await this.instance.beginWithdrawal.sendTransactionAsync(numTokens));
  }

  public async finishWithdrawal(): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(this.ethApi, await this.instance.finishWithdrawal.sendTransactionAsync());
  }

  public async commitVote(
    pollID: BigNumber,
    secret: string,
    numTokens: BigNumber,
    prevPollID: BigNumber,
  ): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(
      this.ethApi,
      await this.instance.commitVote.sendTransactionAsync(pollID, secret, numTokens, prevPollID),
    );
  }

  public async revealVote(pollID: BigNumber, choice: BigNumber, salt: BigNumber): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(this.ethApi, await this.instance.revealVote.sendTransactionAsync(pollID, choice, salt));
  }
}
