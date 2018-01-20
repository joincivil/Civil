import BigNumber from "bignumber.js";
import { Observable } from "rxjs";
import "rxjs/add/operator/distinctUntilChanged";
import * as Web3 from "web3";

import { artifacts } from "../artifacts";
import { EthAddress } from "../types";
import { AbiDecoder } from "../utils/abidecoder";
import { awaitTXReceipt, isDecodedLog } from "../utils/contractutils";
import { CivilErrors } from "../utils/errors";
import { bindAll, promisify } from "../utils/language";
import "../utils/rxjs";
import { Web3Wrapper } from "../utils/web3wrapper";
import { BaseWrapper } from "./basewrapper";
import { RegistryWithAppellateContract } from "./generated/registry_with_appellate";

export class Registry extends BaseWrapper<RegistryWithAppellateContract> {
  constructor(web3Wrapper: Web3Wrapper, instance: RegistryWithAppellateContract, abiDecoder: AbiDecoder) {
    super(web3Wrapper, instance, abiDecoder);
    bindAll(this, ["constructor"]);
  }

  public owner() { return this.instance.owner.callAsync(); }

  public appealingListingAddresses(fromBlock: number = 0): Observable<EthAddress> {
    return this.instance
      .AppealRequestedStream({}, { fromBlock })
      .distinctUntilChanged((a, b) => {
        return a.blockNumber === b.blockNumber && a.logIndex === b.logIndex;
      }) // https://github.com/ethereum/web3.js/issues/573
      .map((e) => e.args.listing)
      .concatFilter(this.instance.isAppealInProgress.callAsync);
  }

  public approvedListingAddresses(fromBlock: number = 0): Observable<EthAddress> {
    return this.instance
      .AppealGrantedStream({}, { fromBlock })
      .distinctUntilChanged((a, b) => {
        return a.blockNumber === b.blockNumber && a.logIndex === b.logIndex;
      }) // https://github.com/ethereum/web3.js/issues/573
      .map((e) => e.args.listing)
      .concatFilter(this.instance.isWhitelisted.callAsync);
  }

  public async submitAppeal(listingAddress: EthAddress): Promise<Web3.TransactionReceipt> {
    const txhash = await this.instance.submitAppeal.sendTransactionAsync(listingAddress);
    return await awaitTXReceipt(this.web3Wrapper, txhash);
  }

  public async grantAppeal(listingAddress: EthAddress): Promise<Web3.TransactionReceipt> {
    await this.requireOwner();

    const txhash = await this.instance.grantAppeal.sendTransactionAsync(listingAddress);
    return await awaitTXReceipt(this.web3Wrapper, txhash);
  }

  public async denyAppeal(listingAddress: EthAddress): Promise<Web3.TransactionReceipt> {
    await this.requireOwner();

    const txhash = await this.instance.denyAppeal.sendTransactionAsync(listingAddress);
    return await awaitTXReceipt(this.web3Wrapper, txhash);
  }

  public isAppealInProgress(listingAddress: EthAddress) {
    return this.instance.isAppealInProgress.callAsync(listingAddress);
  }

  public isWhitelisted(listingAddress: EthAddress) {
    return this.instance.isWhitelisted.callAsync(listingAddress);
  }

  private async requireOwner() {
    const owner = await this.owner();
    if (this.web3Wrapper.account !== owner) {
      throw new Error(CivilErrors.NoPrivileges);
    }
  }
}
