import { EthApi, requireAccount } from "@joincivil/ethapi";
import { CivilErrors, getDefaultFromBlock } from "@joincivil/utils";
import BigNumber from "bignumber.js";
import { Observable } from "rxjs";
import { EthAddress } from "../../types";
import { BaseWrapper } from "../basewrapper";
import { CVLTokenMultisigProxy } from "../generated/multisig/c_v_l_token";
import { CVLTokenContract } from "../generated/wrappers/c_v_l_token";
import { CivilTokenControllerContract } from "../generated/wrappers/civil_token_controller";
import { MultisigProxyTransaction } from "../multisig/basemultisigproxy";

/**
 * CVLToken allows user to interface with token.
 *
 * NOTE: If instantiated with a multisig wallet, all transactions are proxied through multisig, and all functions default to multisig address as the "current" user.
 */
export class CVLToken extends BaseWrapper<CVLTokenContract> {
  public static async atUntrusted(
    web3wrapper: EthApi,
    address: EthAddress,
    multisigAddress?: EthAddress,
  ): Promise<CVLToken> {
    const instance = CVLTokenContract.atUntrusted(web3wrapper, address);
    const multisigProxy = await CVLTokenMultisigProxy.create(web3wrapper, instance, multisigAddress);
    const tokenController = await CivilTokenControllerContract.singletonTrusted(web3wrapper);
    if (!tokenController) {
      throw new Error(CivilErrors.UnsupportedNetwork);
    }
    return new CVLToken(web3wrapper, instance, multisigProxy, tokenController);
  }

  /** If instantiated with `multisigAddress` undefined, proxy will send transactions directly to the contract instance. */
  private multisigProxy: CVLTokenMultisigProxy;
  private tokenController: CivilTokenControllerContract;

  private constructor(
    ethApi: EthApi,
    instance: CVLTokenContract,
    multisigProxy: CVLTokenMultisigProxy,
    tokenController: CivilTokenControllerContract,
  ) {
    super(ethApi, instance);
    this.multisigProxy = multisigProxy;
    this.tokenController = tokenController;
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
    return this.multisigProxy.approve.sendTransactionAsync(spender, numTokens);
  }

  public balanceUpdate(
    fromBlock: number | "latest" = getDefaultFromBlock(this.ethApi.network()),
    user: EthAddress,
  ): Observable<BigNumber> {
    return this.instance
      .TransferStream({ from: user }, { fromBlock })
      .merge(this.instance.TransferStream({ to: user }, { fromBlock }))
      .concatMap(async () => this.getBalance(user));
  }

  /**
   * Contract Getters
   */

  /**
   * Get number of approved tokens for spender
   * @param spender spender to check approved tokens for
   * @param tokenOwner address whose tokens we check approval for (defaults to current user, or multisig if instantiated with multisig)
   */
  public async getApprovedTokensForSpender(spender: EthAddress, tokenOwner?: EthAddress): Promise<BigNumber> {
    let who = tokenOwner;
    if (!who) {
      who = await this.getDefaultCurrentAddress();
    }
    return this.instance.allowance.callAsync(who, spender);
  }

  /**
   * Check the token balance of an address
   * @param tokenOwner address to check balance of (defaults to current user, or multisig if instantiated with multisig)
   */
  public async getBalance(tokenOwner?: EthAddress): Promise<BigNumber> {
    let who = tokenOwner;
    if (!who) {
      who = await this.getDefaultCurrentAddress();
    }
    return this.instance.balanceOf.callAsync(who);
  }

  public async isTransferAllowed(to: EthAddress, from?: EthAddress): Promise<boolean> {
    let who = from;
    if (!who) {
      who = await this.getDefaultCurrentAddress();
    }
    const code = await this.tokenController.detectTransferRestriction.callAsync(who, to, new BigNumber(1));

    return code.toNumber() === 0;
  }

  /**
   * Transfer tokens from user or multisig to another wallet
   * @param recipient address to send tokens to
   * @param numTokens number of tokens to send
   */
  public async transfer(recipient: EthAddress, numTokens: BigNumber): Promise<MultisigProxyTransaction> {
    return this.multisigProxy.transfer.sendTransactionAsync(recipient, numTokens);
  }

  private async getDefaultCurrentAddress(): Promise<EthAddress> {
    let who;
    if (this.multisigProxy.multisigEnabled) {
      who = await this.multisigProxy.getMultisigAddress();
    }
    if (!who) {
      who = await requireAccount(this.ethApi).toPromise();
    }
    return who;
  }
}
