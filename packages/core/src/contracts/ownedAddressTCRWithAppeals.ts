import BigNumber from "bignumber.js";
import { Observable } from "rxjs";
import "rxjs/add/operator/distinctUntilChanged";
import "@joincivil/utils";

import { ContentProvider } from "../content/contentprovider";
import {
  EthAddress,
  ListingState,
  TwoStepEthTransaction,
} from "../types";
import {
  createTwoStepSimple,
} from "../utils/contractutils";
import { requireAccount } from "../utils/errors";
import { Web3Wrapper } from "../utils/web3wrapper";
import { BaseWrapper } from "./basewrapper";
import { OwnedAddressTCRWithAppealsContract } from "./generated/owned_address_t_c_r_with_appeals";
import { Voting } from "./voting";

/**
 * The OwnedAddressTCRWithAppeals tracks the status of addresses that have been applied and allows
 * users to make transactions that modify the state of the TCR.
 *
 * Users can get stream of currently approved addresses, as well as specific information
 * about individual listings (may or may not be approved)
 *
 * Users can also apply to the registry, challenge applications or listings, as well
 * as collect winnings related to challenges, or withdraw/deposit tokens from listings.
 */
export class OwnedAddressTCRWithAppeals extends BaseWrapper<OwnedAddressTCRWithAppealsContract> {

  public static atUntrusted(
    web3wrapper: Web3Wrapper,
    contentProvider: ContentProvider,
    address: EthAddress,
  ): OwnedAddressTCRWithAppeals {
    const instance = OwnedAddressTCRWithAppealsContract.atUntrusted(web3wrapper, address);
    return new OwnedAddressTCRWithAppeals(web3wrapper, contentProvider, instance);
  }

  private contentProvider: ContentProvider;

  private constructor(
    web3Wrapper: Web3Wrapper,
    contentProvider: ContentProvider,
    instance: OwnedAddressTCRWithAppealsContract,
  ) {
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
   * @returns currently whitelisted addresses
   */
  public whitelistedListings(fromBlock: number|"latest" = 0): Observable<EthAddress> {
    return this.instance
      .NewListingWhitelistedStream({}, { fromBlock })
      .distinctUntilChanged((a, b) => {
        return a.blockNumber === b.blockNumber && a.logIndex === b.logIndex;
      })
      .map((e) => e.args.listingAddress)
      .concatFilter(async (listingAddress) => this.instance.getListingIsWhitelisted.callAsync(listingAddress));
  }

  /**
   * An unending stream of all addresses currently applied
   * @param fromBlock Starting block in history for events concerning applied addresses.
   *                  Set to "latest" for only new events
   * @returns listings currently in application stage
   */
  public listingsInApplicationStage(fromBlock: number|"latest" = 0): Observable<EthAddress> {
    return this.instance
      .ApplicationStream({}, { fromBlock })
      .distinctUntilChanged((a, b) => {
        return a.blockNumber === b.blockNumber && a.logIndex === b.logIndex;
      })
      .map((e) => e.args.listingAddress)
      .concatFilter(async (listingAddress) => this.isInApplicationPhase(listingAddress));
  }

  /**
   * An unending stream of all addresses currently able to be whitelisted
   * @param fromBlock Starting block in history for events concerning ready to whitelist addresses.
   *                  Set to "latest" for only new events
   * @returns addresses ready to be whitelisted
   */
  public readyToBeWhitelistedListings(fromBlock: number|"latest" = 0): Observable<EthAddress> {
    return this.instance
    .ApplicationStream({}, { fromBlock })
    .distinctUntilChanged((a, b) => {
      return a.blockNumber === b.blockNumber && a.logIndex === b.logIndex;
    })
    .map((e) => e.args.listingAddress)
    .concatFilter(async (listingAddress) => this.isReadyToWhitelist(listingAddress));
  }

  /**
   * An unending stream of all addresses currently challenged in commit vote phase
   * @param fromBlock Starting block in history for events concerning challenged addresses in commit vote phase.
   *                  Set to "latest" for only new events
   * @returns currently challenged addresses in commit vote phase
   */
  public currentChallengedCommitVotePhaseListings(fromBlock: number|"latest" = 0): Observable<EthAddress> {
    return this.instance
      .ChallengeInitiatedStream({}, { fromBlock })
      .distinctUntilChanged((a, b) => {
        return a.blockNumber === b.blockNumber && a.logIndex === b.logIndex;
      })
      .map((e) => e.args.listingAddress)
      .concatFilter(async (listingAddress) => this.isInChallengedCommitVotePhase(listingAddress));
  }

  /**
   * An unending stream of all addresses currently challenged in reveal vote phase
   * @param fromBlock Starting block in history for events concerning challenged addresses in reveal vote phase.
   *                  Set to "latest" for only new events
   * @returns currently challenged addresses in reveal vote phase
   */
  public currentChallengedRevealVotePhaseListings(fromBlock: number|"latest" = 0): Observable<EthAddress> {
    return this.instance
      .ChallengeInitiatedStream({}, { fromBlock })
      .distinctUntilChanged((a, b) => {
        return a.blockNumber === b.blockNumber && a.logIndex === b.logIndex;
      })
      .map((e) => e.args.listingAddress)
      .concatFilter(async (listingAddress) => this.isInChallengedRevealVotePhase(listingAddress));
  }

  /**
   * Contract Getters
   */

  /**
   * Get's the current state of the listing
   * @param listingAddress Address of listing to check state of
   */
  public async getListingState(listingAddress: EthAddress): Promise<ListingState> {
    if (!await this.doesListingExist(listingAddress)) {
      return ListingState.NOT_FOUND;
    } else if (await this.isInApplicationPhase(listingAddress)) {
      return ListingState.APPLYING;
    } else if (await this.isReadyToWhitelist(listingAddress)) {
      return ListingState.READY_TO_WHITELIST;
    } else if (await this.isInChallengedCommitVotePhase(listingAddress)) {
      return ListingState.CHALLENGED_IN_COMMIT_VOTE_PHASE;
    } else if (await this.isInChallengedRevealVotePhase(listingAddress)) {
      return ListingState.CHALLENGED_IN_REVEAL_VOTE_PHASE;
    } else if (await this.isInRequestAppealPhase(listingAddress)) {
      return ListingState.WAIT_FOR_APPEAL_REQUEST;
    } else if (await this.isWhitelisted(listingAddress)) {
      return ListingState.WHITELISTED_WITHOUT_CHALLENGE;
    } else {
      return ListingState.NOT_FOUND;
    }
  }

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
   * Checks if the listing exists on the contract. If this is false, either the listing
   * has never applied, or it has applied and been rejected (whether during application
   * or while on whitelist)
   * @param listingAddress address of listing to check
   */
  public async doesListingExist(listingAddress: EthAddress): Promise<boolean> {
    const appExpiry = await this.instance.getListingApplicationExpiry.callAsync(listingAddress);
    return (appExpiry > new BigNumber(0));
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
   * @param address Address of listing to check
   */
  public async isWhitelisted(listingAddress: EthAddress): Promise<boolean> {
    return this.instance.getListingIsWhitelisted.callAsync(listingAddress);
  }

  /**
   * Checks if a listing address is ready to be whitelisted
   * @param listingAddress Address of listing to check
   */
  public async isReadyToWhitelist(listingAddress: EthAddress): Promise<boolean> {
    return this.instance.canBeWhitelisted.callAsync(listingAddress);
  }

  /**
   * Checks if a listing address is in unchallenged application phase
   * @param listingAddress Address of potential listing to check
   */
  public async isInApplicationPhase(listingAddress: EthAddress): Promise<boolean> {
    let isInApplicationPhase = true;

    // if expiry time has passed
    const appExpiry = await this.instance.getListingApplicationExpiry.callAsync(listingAddress);
    const now = (new Date()).getTime() / 1000;
    if (appExpiry.toNumber() < now) {
      isInApplicationPhase = false;
    }

    // if there is a challenge
    const challenge = await this.instance.getListingChallengeID.callAsync(listingAddress);
    if (challenge.toNumber() > 0) {
      isInApplicationPhase = false;
    }
    return isInApplicationPhase;
  }

  public async getApplicationExpiryTimestamp(listingAddress: EthAddress): Promise<BigNumber> {
    return this.instance.getListingApplicationExpiry.callAsync(listingAddress);
  }

  /**
   * Checks if a listing address is in challenged commit vote phase
   * @param listingAddress Address of potential listing to check
   */
  public async isInChallengedCommitVotePhase(listingAddress: EthAddress): Promise<boolean> {
    let isInCommitPhase = true;

    // if there is no challenge
    const challenge = await this.instance.getListingChallengeID.callAsync(listingAddress);
    if (challenge.toNumber() === 0) {
      isInCommitPhase = false;
    }

    // if commit period not active
    const voting = Voting.atUntrusted(this.web3Wrapper, await this.instance.voting.callAsync());
    const commitPeriodActive = await voting.isCommitPeriodActive(challenge);
    if (!commitPeriodActive) {
      isInCommitPhase = false;
    }

    return isInCommitPhase;
  }

  /**
   * Checks if a listing address is in challenged commit vote phase
   * @param listingAddress Address of potential listing to check
   */
  public async isInChallengedRevealVotePhase(listingAddress: EthAddress): Promise<boolean> {
    let isInRevealPhase = true;

    // if there is no challenge
    const challenge = await this.instance.getListingChallengeID.callAsync(listingAddress);
    if (challenge.toNumber() === 0) {
      isInRevealPhase = false;
    }

    // if reveal period not active
    const voting = Voting.atUntrusted(this.web3Wrapper, await this.instance.voting.callAsync());
    const revealPeriodActive = await voting.isRevealPeriodActive(challenge);
    if (!revealPeriodActive) {
      isInRevealPhase = false;
    }

    return isInRevealPhase;
  }

  /**
   * Checks if a listing is currently in the Request Appeal phase
   * @param listingAddress Address of listing to check
   */
  public async isInRequestAppealPhase(listingAddress: EthAddress): Promise<boolean> {
    const appealExpiryUnixTimestamp = await this.getRequestAppealExpiryTimestamp(listingAddress);
    const appealExpiryDate = new Date(appealExpiryUnixTimestamp.toNumber() * 1000);
    return (appealExpiryDate > new Date());
  }

  /**
   * Gets the expiry time of the request appeal phase.
   * @param listingAddress Address of listing to check
   */
  public async getRequestAppealExpiryTimestamp(listingAddress: EthAddress): Promise<BigNumber> {
    return this.instance.getRequestAppealPhaseExpiry.callAsync(listingAddress);
  }

  /**
   * Checks if a listing is currently in the Appeal phase
   * @param listingAddress Address of listing to check
   */
  public async isInAppealPhase(listingAddress: EthAddress): Promise<boolean> {
    const appealExpiryUnixTimestamp = await this.getAppealExpiryTimestamp(listingAddress);
    const appealExpiryDate = new Date(appealExpiryUnixTimestamp.toNumber() * 1000);
    return (appealExpiryDate > new Date());
  }

  /**
   * Gets the expiry time of the appeal phase.
   * @param listingAddress Address of listing to check
   */
  public async getAppealExpiryTimestamp(listingAddress: EthAddress): Promise<BigNumber> {
    return this.instance.getAppealPhaseExpiry.callAsync(listingAddress);
  }

  /**
   * Gets the expiry time of the commit vote phase.
   * @param listingAddress Address of listing to check
   */
  public async getCommitVoteExpiryTimestamp(listingAddress: EthAddress): Promise<BigNumber> {
    // if there is no challenge
    const challenge = await this.instance.getListingChallengeID.callAsync(listingAddress);
    if (challenge.toNumber() !== 0) {
      const voting = Voting.atUntrusted(this.web3Wrapper, await this.instance.voting.callAsync());
      const revealPeriodActive = await voting.getCommitPeriodExpiry(challenge);

      return revealPeriodActive;
    } else {
      return new BigNumber(0);
    }
  }

  /**
   * Gets the expiry time of the commit vote phase.
   * @param listingAddress Address of listing to check
   */
  public async getRevealVoteExpiryTimestamp(listingAddress: EthAddress): Promise<BigNumber> {
    // if there is no challenge
    const challenge = await this.instance.getListingChallengeID.callAsync(listingAddress);
    if (challenge.toNumber() !== 0) {
      const voting = Voting.atUntrusted(this.web3Wrapper, await this.instance.voting.callAsync());
      const revealPeriodActive = await voting.getRevealPeriodExpiry(challenge);

      return revealPeriodActive;
    } else {
      return new BigNumber(0);
    }
  }

  /**
   * Get address for token used with this TCR
   */
  public async getTokenAddress(): Promise<EthAddress> {
    return this.instance.token.callAsync();
  }

  /**
   * Get address for voting contract used with this TCR
   */
  public async getVotingAddress(): Promise<EthAddress> {
    return this.instance.voting.callAsync();
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

  public async getListingChallengeID(listingAddress: EthAddress): Promise<BigNumber> {
    return this.instance.getListingChallengeID.callAsync(listingAddress);
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

  /**
   * Challenges an application or whitelisted listing
   * @param listingAddress Address of listing to challenge
   * @param data Data associated with challenge
   */
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
  public async updateListing(
    listingAddress: EthAddress,
  ): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(
      this.web3Wrapper,
      await this.instance.updateStatus.sendTransactionAsync(listingAddress),
    );
  }

  /**
   * Updates status of a listing after appeal phase(s) are over
   * @param address Address of listing to resolve appeal for
   */
  public async resolvePostAppealPhase(
    listingAddress: EthAddress,
  ): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(
      this.web3Wrapper,
      await this.instance.resolvePostAppealPhase.sendTransactionAsync(listingAddress),
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
