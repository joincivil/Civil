import { EthApi } from "@joincivil/ethapi";
import { CivilErrors } from "@joincivil/utils";
import * as Debug from "debug";
import { EthAddress, TwoStepEthTransaction } from "../../types";
import { CivilTCRContract } from "../generated/wrappers/civil_t_c_r";
import { GovernmentContract } from "../generated/wrappers/government";
import { Multisig } from "../multisig/multisig";

const debug = Debug("civil:tcr");

/**
 * The Government contract is where parameters related to appeals are stored and where
 * the controlling entities can update them and update the controlling entities as well
 */
export class Council {
  public static async singleton(ethApi: EthApi): Promise<Council> {
    const govt = await GovernmentContract.singletonTrusted(ethApi);
    const tcr = await CivilTCRContract.singletonTrusted(ethApi);
    if (!govt || !tcr) {
      debug("Smart-contract wrapper for Parameterizer returned null, unsupported network");
      throw new Error(CivilErrors.UnsupportedNetwork);
    }
    const appellateAddr = await govt.getAppellate.callAsync();
    const multisig = Multisig.atUntrusted(ethApi, appellateAddr);
    return new Council(govt, tcr, multisig, ethApi);
  }

  private govtInstance: GovernmentContract;
  private civilInstance: CivilTCRContract;
  private multisig: Multisig;
  private ethApi: EthApi;

  private constructor(govt: GovernmentContract, tcr: CivilTCRContract, multi: Multisig, api: EthApi) {
    this.govtInstance = govt;
    this.civilInstance = tcr;
    this.multisig = multi;
    this.ethApi = api;
  }

  public async grantAppeal(listingAddress: EthAddress, data: string = ""): Promise<TwoStepEthTransaction<any>> {
    const txdata = await this.civilInstance.grantAppeal.getRaw(listingAddress, data, { gas: 0 });
    return this.multisig.submitTransaction(this.civilInstance.address, this.ethApi.toBigNumber(0), txdata.data!);
  }

  public async transferAppellate(newAppellate: EthAddress): Promise<TwoStepEthTransaction<any>> {
    const txdata = await this.govtInstance.setAppellate.getRaw(newAppellate);
    return this.multisig.submitTransaction(this.govtInstance.address, this.ethApi.toBigNumber(0), txdata.data!);
  }

  public async getAppellateMembers(): Promise<string[]> {
    return this.multisig.owners();
  }
}
