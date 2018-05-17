import BigNumber from "bignumber.js";
import * as Debug from "debug";
import "@joincivil/utils";

import { EthAddress } from "../../types";
import { CivilErrors } from "../../utils/errors";
import { EthApi } from "../../utils/ethapi";
import { BaseWrapper } from "../basewrapper";
import { GovernmentContract } from "../generated/wrappers/government";

const debug = Debug("civil:tcr");
/**
 * The Government contract is where parameters related to appeals are stored and where
 * the controlling entities can update them and update the controlling entities as well
 */
export class Government extends BaseWrapper<GovernmentContract> {
  public static singleton(ethApi: EthApi): Government {
    const instance = GovernmentContract.singletonTrusted(ethApi);
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
}
