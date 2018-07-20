import { EthApi } from "@joincivil/ethapi";
import { CivilErrors } from "@joincivil/utils";
import BigNumber from "bignumber.js";
import * as Debug from "debug";
import { Observable } from "rxjs";
import { EthAddress, Param, TwoStepEthTransaction } from "../../types";
import { BaseWrapper } from "../basewrapper";
import { GovernmentContract } from "../generated/wrappers/government";
import { createTwoStepSimple } from "../utils/contracts";

const debug = Debug("civil:tcr");

export const enum GovtParameters {
  requestAppealLen = "requestAppealLen",
  judgeAppealLen = "judgeAppealLen",
  appealFee = "appealFee",
  appealVotePercentage = "appealVotePercentage",
}

/**
 * The Government contract is where parameters related to appeals are stored and where
 * the controlling entities can update them and update the controlling entities as well
 */
export class Government extends BaseWrapper<GovernmentContract> {
  public static async singleton(ethApi: EthApi): Promise<Government> {
    const instance = await GovernmentContract.singletonTrusted(ethApi);
    if (!instance) {
      debug("Smart-contract wrapper for Parameterizer returned null, unsupported network");
      throw new Error(CivilErrors.UnsupportedNetwork);
    }
    return new Government(ethApi, instance);
  }

  public static atUntrusted(web3wrapper: EthApi, address: EthAddress): Government {
    const instance = GovernmentContract.atUntrusted(web3wrapper, address);
    return new Government(web3wrapper, instance);
  }

  private constructor(ethApi: EthApi, instance: GovernmentContract) {
    super(ethApi, instance);
  }

  /**
   * Gets an unending stream of parameters being set
   */
  public getParameterSet(fromBlock: number | "latest" = 0): Observable<Param> {
    return this.instance.ParameterSetStream({}, { fromBlock }).map(e => {
      return {
        paramName: e.args.name,
        value: e.args.value,
      };
    });
  }

  public async getAppealFee(): Promise<BigNumber> {
    return this.getParameterValue("appealFee");
  }
  /**
   * Gets the current value of the specified parameter
   * @param parameter key of parameter to check
   */
  public async getParameterValue(parameter: string): Promise<BigNumber> {
    return this.instance.get.callAsync(parameter);
  }

  /**
   * Set value of Government Parameter
   * @param paramName name of parameter you intend to change
   * @param newValue value you want parameter to be changed to
   */
  public async set(paramName: GovtParameters | string, newValue: BigNumber): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(this.ethApi, await this.instance.set.sendTransactionAsync(paramName, newValue));
  }
  /**
   * Get the URI of the Civil Constitution
   */
  public async getConstitutionURI(): Promise<string> {
    return this.instance.constitutionURI.callAsync();
  }

  /**
   * Get the hash of the Civil Constitution
   */
  public async getConstitutionHash(): Promise<string> {
    return this.instance.constitutionHash.callAsync();
  }

  public async getAppellate(): Promise<EthAddress> {
    return this.instance.getAppellate.callAsync();
  }

  public async getController(): Promise<EthAddress> {
    return this.instance.getGovernmentController.callAsync();
  }
}
