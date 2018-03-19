import BN from "bignumber.js";
import { Observable } from "rxjs";
import "@joincivil/utils";

import "rxjs/add/operator/distinctUntilChanged";
import {
  CivilTransactionReceipt,
  EthAddress,
  TxHash,
  TxData,
  TwoStepEthTransaction,
} from "../types";
import {
  isDecodedLog,
  createTwoStepTransaction,
  createTwoStepSimple,
} from "../utils/contractutils";
import { requireAccount } from "../utils/errors";
import { Web3Wrapper } from "../utils/web3wrapper";
import { BaseWrapper } from "./basewrapper";
import { EIP20Contract } from "./generated/eip20";

/**
 * EIP20 allows user to interface with token
 */
export class EIP20 extends BaseWrapper<EIP20Contract> {
  public static atUntrusted(web3wrapper: Web3Wrapper, address: EthAddress): EIP20 {
    const instance = EIP20Contract.atUntrusted(web3wrapper, address);
    return new EIP20(web3wrapper, instance);
  }

  private constructor(web3Wrapper: Web3Wrapper, instance: EIP20Contract) {
    super(web3Wrapper, instance);
  }

  /**
   * Contract Transactions
   */

  /**
   * Approve spender to spend certain amount of tokens on user's behalf
   * @param spender address to approve as spender of tokens
   * @param numTokens number of tokens to approve for spender to spend on user's behalf
   */
  public async approveSpender(
    spender: EthAddress,
    numTokens: BN,
  ): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(
      this.web3Wrapper,
      await this.instance.approve.sendTransactionAsync(spender, numTokens),
    );
  }

  /**
   * Contract Getters
   */

  /**
   * Get number of approved tokens for spender
   * @param spender spender to check approved tokens for
   */
  public async getApprovedTokensForSpender(
    spender: EthAddress,
    tokenOwner?: EthAddress,
  ): Promise<BN> {
    let who = tokenOwner;
    if (!who) {
      who = requireAccount(this.web3Wrapper);
    }
    return this.instance.allowance.callAsync(who, spender);
  }

  /**
   * Check the token balance of an address
   * @param address address to check balance of
   */
  public async getBalance(
    tokenOwner?: EthAddress,
  ): Promise<BN> {
    let who = tokenOwner;
    if (!who) {
      who = requireAccount(this.web3Wrapper);
    }
    return this.instance.balanceOf.callAsync(who);
  }

}
