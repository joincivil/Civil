import { BigNumber } from "bignumber.js";
import { Observable } from "rxjs";
import "rxjs/add/operator/distinctUntilChanged";
import "@joincivil/utils";

import { ContentProvider } from "../content/contentprovider";
import { EthAddress, TwoStepEthTransaction } from "../types";
import { requireAccount } from "../utils/errors";
import { Web3Wrapper } from "../utils/web3wrapper";
import { BaseWrapper } from "./basewrapper";
import { AddressRegistryContract } from "./generated/address_registry";
import { createTwoStepSimple } from "../utils/contractutils";

/**
 * The AddressRegistry tracks the status of addresses that have been applied.
 *
 * Users can get stream of currently approved addresses, as well as specific information
 * about individual listings (may or may not be approved)
 *
 * Users can also apply to the registry, challenge applications or listings, as well
 * as collect winnings related to challenges, or withdraw/deposit tokens from listings.
 */
export class AddressRegistry extends BaseWrapper<AddressRegistryContract> {
  public static atUntrusted(
    web3wrapper: Web3Wrapper,
    contentProvider: ContentProvider,
    address: EthAddress,
  ): AddressRegistry {
    const instance = AddressRegistryContract.atUntrusted(web3wrapper, address);
    return new AddressRegistry(web3wrapper, contentProvider, instance);
  }

  private contentProvider: ContentProvider;

  private constructor(web3Wrapper: Web3Wrapper, contentProvider: ContentProvider, instance: AddressRegistryContract) {
    super(web3Wrapper, instance);
    this.contentProvider = contentProvider;
  }

  /**
   * Event Streams
   */

  /**
   * An unending stream of all addresses currently whitelisted
   * @param fromBlock Starting block in history for events concerning whitelisted addresses.
   *                  Set to "latest" for only new events
   * @returns currently Whitelisted addresses
   */
  public whitelistedAddresses(fromBlock: number|"latest" = 0): Observable<EthAddress> {
    return this.instance
      .ApplicationStream({}, { fromBlock })
      .distinctUntilChanged((a, b) => {
        return a.blockNumber === b.blockNumber && a.logIndex === b.logIndex;
      })
      .map((e) => e.args.listingAddress)
      .concatFilter(async (listingAddress) => this.instance.getListingIsWhitelisted.callAsync(listingAddress));
  }

  /**
   * Contract Getters
   */

   /**
    * Gets reward for voter
    * @param challengeID ID of challenge to check
    * @param salt Salt of vote associated with voter for specified challenge
    * @param voter Voter of which to check reward
    */
  public async voterReward(challengeID: BigNumber, salt: BigNumber, voter?: EthAddress): Promise<BigNumber> {
    let who = voter;
    if (!who) {
      who = requireAccount(this.web3Wrapper);
    }
    return this.instance.voterReward.callAsync(who, challengeID, salt);
  }

   /**
    * Checks if listing can be whitelisted (application was made and passed
    * without challenge or resolved challenge, is not already whitelisted)
    * @param listingAddress address of listing to check
    */
    public async canBeWhitelisted(listingAddress: EthAddress): Promise<boolean> {
      return this.instance.canBeWhitelisted.callAsync(listingAddress);
    }

  /**
   * Checks if a listing address is whitelisted
   * @param address Address of potential listing to check
   * @throws {CivilErrors.NoUnlockedAccount} Requires the node to have at least one account if no address provided
   */
  public async isWhitelisted(listingAddress: EthAddress): Promise<boolean> {
    return this.instance.getListingIsWhitelisted.callAsync(listingAddress);
  }

  /**
   * Checks if an address has application associated with it
   * App can either be in progress or approved
   * @param address Address of potential listing to check
   */
  public async appWasMade(listingAddress: EthAddress): Promise<boolean> {
    return this.instance.appWasMade.callAsync(listingAddress);
  }

  /**
   * Checks if an address has application/listing has an unresolved challenge
   * @param address Address of potential listing to check
   */
  public async challengeExists(listingAddress: EthAddress): Promise<boolean> {
    return this.instance.challengeExists.callAsync(listingAddress);
  }

  /**
   * Checks if an address has challenge that can be resolved
   * @param address Address of potential listing to check
   */
  public async challengeCanBeResolved(listingAddress: EthAddress): Promise<boolean> {
    return this.instance.challengeExists.callAsync(listingAddress);
  }

  /**
   * Determines number of tokens to award winning party in challenge
   * @param address ID of challenge to determine reward for
   */
  public async determineReward(challengeID: BigNumber): Promise<BigNumber> {
    return this.instance.determineReward.callAsync(challengeID);
  }

  /**
   * Gets whether or not specified user has a token claim for specified challenge
   * @param challengeID ID of challenge to check
   * @param address Address of voter to check
   */
  public async tokenClaims(challengeID: BigNumber, voter?: EthAddress): Promise<boolean> {
    let who = voter;
    if (!who) {
      who = requireAccount(this.web3Wrapper);
    }
    return this.instance.tokenClaims.callAsync(challengeID, who);
  }

  /**
   * Contract Transactions
   */

  /**
   * Starts an application for a listing
   * @param address Address of new listing
   * @param deposit How many tokens to deposit to start application
   * @param applicationContent Content associated with application
   */
  public async apply(
    listingAddress: EthAddress,
    deposit: BigNumber,
    applicationContent: string,
  ): Promise<TwoStepEthTransaction> {
    const uri = await this.contentProvider.put(applicationContent);
    return this.applyWithURI(listingAddress, deposit, uri);
  }

  /**
   * Starts an application for a listing
   * @param address Address of new listing
   * @param deposit How many tokens to deposit to start application
   * @param applicationContentURI (URI that points to data object)
   */
  // TODO(ritave): Return application id
  public async applyWithURI(
    listingAddress: EthAddress,
    deposit: BigNumber,
    applicationContentURI: string,
  ): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(
      this.web3Wrapper,
      await this.instance.apply.sendTransactionAsync(listingAddress, deposit, applicationContentURI),
    );
  }

  /**
   * Deposits more tokens into a listing
   * @param address Address of listing to deposit to
   * @param depositAmount How many tokens to deposit
   */
  public async deposit(
    listingAddress: EthAddress,
    depositAmount: BigNumber,
  ): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(
      this.web3Wrapper,
      await this.instance.deposit.sendTransactionAsync(listingAddress, depositAmount),
    );
  }

  /**
   * Withdraw tokens from a listing
   * @param address Address of listing to withdraw from
   * @param withdrawalAmount How many tokens to withdraw
   */
  public async withdraw(
    listingAddress: EthAddress,
    withdrawalAmount: BigNumber,
  ): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(
      this.web3Wrapper,
      await this.instance.withdraw.sendTransactionAsync(listingAddress, withdrawalAmount),
    );
  }

  /**
   * Exits a listing, returning deposited tokens
   * @param address Address of listing to exit
   */
  public async exitListing(listingAddress: EthAddress): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(
      this.web3Wrapper,
      await this.instance.exitListing.sendTransactionAsync(listingAddress),
    );
  }

  public async challenge(
    listingAddress: EthAddress,
    data: string = "",
  ): Promise<TwoStepEthTransaction> {
    const uri = await this.contentProvider.put(data);
    return this.challengeWithURI(listingAddress, uri);
  }

  /**
   * This is a low-level call and assumes you stored your content on your own
   * Challenges an application or whitelisted listing
   * @param address Address of listing to challenge
   * @param data Data associated with challenge (URI that points to data object)
   */
  public async challengeWithURI(
    listingAddress: EthAddress,
    data: string = "",
  ): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(
      this.web3Wrapper,
      await this.instance.challenge.sendTransactionAsync(listingAddress, data),
    );
  }

  /**
   * Updates status of a listing
   * @param address Address of new listing
   */
  public async updateListing(listingAddress: EthAddress): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(
      this.web3Wrapper,
      await this.instance.updateStatus.sendTransactionAsync(listingAddress),
    );
  }

  /**
   * Claims reward associated with challenge
   * @param challengeID ID of challenge to claim reward of
   * @param salt Salt for user's vote on specified challenge
   */
  public async claimReward(
    challengeID: BigNumber,
    salt: BigNumber,
  ): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(
      this.web3Wrapper,
      await this.instance.claimReward.sendTransactionAsync(challengeID, salt),
    );
  }
}
