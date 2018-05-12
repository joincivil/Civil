import BigNumber from "bignumber.js";
import "@joincivil/utils";

import { BaseWrapper } from "../basewrapper";
import { EIP20Contract } from "../generated/wrappers/eip20";
import { EthApi } from "../../utils/ethapi";
import { EthAddress, TwoStepEthTransaction } from "../../types";
import { requireAccount } from "../../utils/errors";
import { createTwoStepSimple } from "../utils/contracts";

/**
 * EIP20 allows user to interface with token
 */
export class EIP20 extends BaseWrapper<EIP20Contract> {
  public static atUntrusted(web3wrapper: EthApi, address: EthAddress): EIP20 {
    const instance = EIP20Contract.atUntrusted(web3wrapper, address);
    return new EIP20(web3wrapper, instance);
  }

  private constructor(ethApi: EthApi, instance: EIP20Contract) {
    super(ethApi, instance);
  }

  /**
   * Contract Transactions
   */

  /**
   * Approve spender to spend certain amount of tokens on user's behalf
   * @param spender address to approve as spender of tokens
   * @param numTokens number of tokens to approve for spender to spend on user's behalf
   */
  public async approveSpender(spender: EthAddress, numTokens: BigNumber): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(this.ethApi, await this.instance.approve.sendTransactionAsync(spender, numTokens));
  }

  /**
   * Contract Getters
   */

  /**
   * Get number of approved tokens for spender
   * @param spender spender to check approved tokens for
   */
  public async getApprovedTokensForSpender(spender: EthAddress, tokenOwner?: EthAddress): Promise<BigNumber> {
    let who = tokenOwner;
    if (!who) {
      who = requireAccount(this.ethApi);
    }
    return this.instance.allowance.callAsync(who, spender);
  }

  /**
   * Check the token balance of an address
   * @param address address to check balance of
   */
  public async getBalance(tokenOwner?: EthAddress): Promise<BigNumber> {
    let who = tokenOwner;
    if (!who) {
      who = requireAccount(this.ethApi);
    }
    return this.instance.balanceOf.callAsync(who);
  }
}
