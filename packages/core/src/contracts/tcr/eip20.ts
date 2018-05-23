import BigNumber from "bignumber.js";
import "@joincivil/utils";

import { BaseWrapper } from "../basewrapper";
import { EIP20Contract } from "../generated/wrappers/eip20";
import { EthApi } from "../../utils/ethapi";
import { EthAddress, TwoStepEthTransaction } from "../../types";
import { requireAccount } from "../../utils/errors";
import { createTwoStepSimple } from "../utils/contracts";
import { EIP20MultisigProxy } from "../generated/multisig/eip20";
import { MultisigProxyTransaction } from "../multisig/basemultisigproxy";

/**
 * EIP20 allows user to interface with token
 */
export class EIP20 extends BaseWrapper<EIP20Contract> {
  public static async atUntrusted(
    web3wrapper: EthApi,
    address: EthAddress,
    multisigAddress?: EthAddress,
  ): Promise<EIP20> {
    const instance = EIP20Contract.atUntrusted(web3wrapper, address);
    const eip20 = new EIP20(web3wrapper, instance);
    if (multisigAddress) {
      eip20.multisigProxy = await EIP20MultisigProxy.create(web3wrapper, instance, multisigAddress);
    }
    return eip20;
  }

  private multisigProxy?: EIP20MultisigProxy;

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
  public async approveSpender(spender: EthAddress, numTokens: BigNumber): Promise<MultisigProxyTransaction> {
    if (this.multisigProxy) {
      return this.multisigProxy.approve.sendTransactionAsync(spender, numTokens);
    }
    return createTwoStepSimple(this.ethApi, await this.instance.approve.sendTransactionAsync(spender, numTokens));
  }

  /**
   * Contract Getters
   */

  /**
   * Get number of approved tokens for spender
   * @param spender spender to check approved tokens for
   * @param tokenOwner address whose tokens we check approval for (defaults to current user)
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
   * @param tokenOwner address to check balance of (defaults to current user)
   */
  public async getBalance(tokenOwner?: EthAddress): Promise<BigNumber> {
    let who = tokenOwner;
    if (!who) {
      who = requireAccount(this.ethApi);
    }
    return this.instance.balanceOf.callAsync(who);
  }

  /**
   * Transfer tokens from user to another wallet
   * @param recipient address to send tokens to
   * @param numTokens number of tokens to send
   */
  public async transfer(recipient: EthAddress, numTokens: BigNumber): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(this.ethApi, await this.instance.transfer.sendTransactionAsync(recipient, numTokens));
  }
}
