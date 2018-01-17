import BigNumber from "bignumber.js";
import { Observable } from "rxjs";
import "rxjs/add/operator/distinctUntilChanged";
import * as Web3 from "web3";

import { artifacts } from "../artifacts";
import { EthAddress } from "../types";
import { AbiDecoder } from "../utils/abidecoder";
import { isDecodedLog } from "../utils/contractutils";
import { bindAll, promisify } from "../utils/language";
import "../utils/rxjs";
import { Web3Wrapper } from "../utils/web3wrapper";
import { AppealRequestedArgs, AppealGrantedArgs, AppealDeniedArgs, RegistryWithAppellateContract, RegistryWithAppellateEvents } from "./generated/registry_with_appellate";
import { BaseWrapper } from "./basewrapper";

export class Registry extends BaseWrapper<RegistryWithAppellateContract> {
  private web3Wrapper: Web3Wrapper;
  private abiDecoder: AbiDecoder;

  constructor(web3Wrapper: Web3Wrapper, instance: RegistryWithAppellateContract, abiDecoder: AbiDecoder) {
    super(instance);
    this.web3Wrapper = web3Wrapper;
    this.abiDecoder = abiDecoder;
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
      .concatFilter(this.instance.isAppealInProgress.callAsync)
  }

  public approvedListingAddresses(fromBlock: number = 0): Observable<EthAddress> {
    return this.instance
      .AppealGrantedStream({}, { fromBlock })
      .distinctUntilChanged((a, b) => {
        return a.blockNumber === b.blockNumber && a.logIndex === b.logIndex;
      }) // https://github.com/ethereum/web3.js/issues/573
      .map((e) => e.args.listing)
      .concatFilter(this.instance.isWhitelisted.callAsync)
  }

  public async submitAppeal(listingAddress: EthAddress): Promise<EthAddress> {
    await this.instance.submitAppeal.sendTransactionAsync(listingAddress);
    return listingAddress
  }

  public async grantAppeal(listingAddress: EthAddress): Promise<EthAddress> {    
    const owner = await this.owner();
    if (this.web3Wrapper.web3.eth.defaultAccount !== owner) {
      throw new Error("grantAppeal cannot be called by non-owner of registry.")
    }
    await this.instance.grantAppeal.sendTransactionAsync(listingAddress);
    return listingAddress
  }

  public async denyAppeal(listingAddress: EthAddress): Promise<EthAddress> {
    const owner = await this.owner();
    if (this.web3Wrapper.web3.eth.defaultAccount !== owner) {
      throw new Error("denyAppeal cannot be called by non-owner of registry.")
    }
    await this.instance.denyAppeal.sendTransactionAsync(listingAddress);
    return listingAddress;
  }

  public async isAppealInProgress(listingAddress: EthAddress) {
    return await this.instance.isAppealInProgress.callAsync(listingAddress);
  }

  public async isWhitelisted(listingAddress: EthAddress) {
    return await this.instance.isWhitelisted.callAsync(listingAddress);
  }
}
