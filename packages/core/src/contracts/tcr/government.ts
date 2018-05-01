import BigNumber from "bignumber.js";
import * as Debug from "debug";
import "@joincivil/utils";

import { EthAddress } from "../../types";
import { CivilErrors } from "../../utils/errors";
import { Web3Wrapper } from "../../utils/web3wrapper";
import { BaseWrapper } from "../basewrapper";
import { GovernmentContract } from "../generated/wrappers/government";

const debug = Debug("civil:tcr");
/**
 * The Government contract is where parameters related to appeals are stored and where
 * the controlling entities can update them and update the controlling entities as well
 */
export class Government extends BaseWrapper<GovernmentContract> {
  public static singleton(web3Wrapper: Web3Wrapper): Government {
    const instance = GovernmentContract.singletonTrusted(web3Wrapper);
    if (!instance) {
      debug("Smart-contract wrapper for Parameterizer returned null, unsupported network");
      throw new Error(CivilErrors.UnsupportedNetwork);
    }
    return new Government(web3Wrapper, instance);
  }

  public static atUntrusted(web3wrapper: Web3Wrapper, address: EthAddress): Government {
    const instance = GovernmentContract.atUntrusted(web3wrapper, address);
    return new Government(web3wrapper, instance);
  }

  private constructor(web3Wrapper: Web3Wrapper, instance: GovernmentContract) {
    super(web3Wrapper, instance);
  }

  public async getAppealFee(): Promise<BigNumber> {
    return this.getParameterValue("appealFee");
  }
  /**
   * Gets the current value of the specified parameter
   * @param parameter key of parameter to check
   */
  private async getParameterValue(parameter: string): Promise<BigNumber> {
    return this.instance.get.callAsync(parameter);
  }
}
