import BigNumber from "bignumber.js";
import * as Debug from "debug";
import { Observable } from "rxjs";

import { EthAddress, TwoStepEthTransaction, Param } from "../../types";
import { CivilErrors } from "../../utils/errors";
import { EthApi } from "../../utils/ethapi";
import { BaseWrapper } from "../basewrapper";
import { GovernmentContract } from "../generated/wrappers/government";
import { CivilTCRContract } from "../generated/wrappers/civil_t_c_r";
import { Multisig } from "../multisig/multisig";
import { createTwoStepSimple, isAddressMultisigWallet } from "../utils/contracts";
const debug = Debug("civil:tcr");

/**
 * The Government contract is where parameters related to appeals are stored and where
 * the controlling entities can update them and update the controlling entities as well
 */
export class Council {
  public static async singleton(ethApi: EthApi): Promise<Council> {
    const govt = GovernmentContract.singletonTrusted(ethApi);
    const tcr = CivilTCRContract.singletonTrusted(ethApi);
    if (!govt || !tcr) {
      debug("Smart-contract wrapper for Parameterizer returned null, unsupported network");
      throw new Error(CivilErrors.UnsupportedNetwork);
    }
    const appellateAddr = await govt.getAppellate.callAsync();
    let multisig;
    if (await isAddressMultisigWallet(ethApi, appellateAddr)) {
      multisig = Multisig.atUntrusted(ethApi, appellateAddr);
    }
    return new Council(ethApi, govt, tcr, appellateAddr, multisig);
  }

  private govtInstance: GovernmentContract;
  private civilInstance: CivilTCRContract;
  private ethApi: EthApi;
  private multisig?: Multisig;
  private appellateAddr: EthAddress;

  private constructor(
    api: EthApi,
    govt: GovernmentContract,
    tcr: CivilTCRContract,
    addr: EthAddress,
    multi?: Multisig,
  ) {
    this.ethApi = api;
    this.govtInstance = govt;
    this.civilInstance = tcr;
    this.multisig = multi;
    this.appellateAddr = addr;
  }

  public async grantAppeal(listingAddress: EthAddress): Promise<TwoStepEthTransaction<any>> {
    if (this.multisig) {
      console.log("grantAppeal - multisig");
      const data = await this.civilInstance.grantAppeal.getRaw(listingAddress);
      return this.multisig.submitTransaction(this.civilInstance.address, new BigNumber(0), data.data!);
    } else {
      console.log("grantAppeal - no multisig.");
      return createTwoStepSimple(
        this.ethApi,
        await this.civilInstance.grantAppeal.sendTransactionAsync(listingAddress),
      );
    }
  }

  public async transferAppellate(newAppellate: EthAddress): Promise<TwoStepEthTransaction<any>> {
    if (this.multisig) {
      console.log("transferAppeallate - multisig");
      const data = await this.govtInstance.setAppellate.getRaw(newAppellate);
      return this.multisig.submitTransaction(this.govtInstance.address, new BigNumber(0), data.data!);
    } else {
      console.log("transferAppellate - no multisig.");
      return createTwoStepSimple(this.ethApi, await this.govtInstance.setAppellate.sendTransactionAsync(newAppellate));
    }
  }

  public async getAppellateMembers(): Promise<string[]> {
    if (this.multisig) {
      return this.multisig.owners();
    } else {
      return [this.appellateAddr];
    }
  }
}
