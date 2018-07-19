import BigNumber from "bignumber.js";
import * as Debug from "debug";

import { EthAddress, TwoStepEthTransaction } from "../../types";
import { CivilErrors } from "../../utils/errors";
import { EthApi } from "../../utils/ethapi";
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
    const multisig = Multisig.atUntrusted(ethApi, appellateAddr);
    return new Council(govt, tcr, multisig);
  }

  private govtInstance: GovernmentContract;
  private civilInstance: CivilTCRContract;
  private multisig: Multisig;

  private constructor(govt: GovernmentContract, tcr: CivilTCRContract, multi: Multisig) {
    this.govtInstance = govt;
    this.civilInstance = tcr;
    this.multisig = multi;
  }

  public async grantAppeal(listingAddress: EthAddress): Promise<TwoStepEthTransaction<any>> {
    const data = await this.civilInstance.grantAppeal.getRaw(listingAddress, { gas: 0 });
    return this.multisig.submitTransaction(this.civilInstance.address, new BigNumber(0), data.data!);
  }

  public async transferAppellate(newAppellate: EthAddress): Promise<TwoStepEthTransaction<any>> {
    const data = await this.govtInstance.setAppellate.getRaw(newAppellate);
    return this.multisig.submitTransaction(this.govtInstance.address, new BigNumber(0), data.data!);
  }

  public async getAppellateMembers(): Promise<string[]> {
    return this.multisig.owners();
  }
}
