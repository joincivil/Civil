import BigNumber from "bignumber.js";
import { Observable } from "rxjs";
import * as Debug from "debug";
import "@joincivil/utils";

import { Voting } from "./voting";
import { Parameterizer } from "./parameterizer";
import { BaseWrapper } from "../basewrapper";
import { CivilTCRContract } from "../generated/civil_t_c_r";
import { Web3Wrapper } from "../../utils/web3wrapper";
import { ContentProvider } from "../../content/contentprovider";
import { CivilErrors, requireAccount } from "../../utils/errors";
import { Appeal, EthAddress, Listing, ListingState, TwoStepEthTransaction, Challenge } from "../../types";
import { createTwoStepSimple, isEthAddress } from "../utils/contracts";
import { EIP20 } from "./eip20";

const debug = Debug("civil:tcr");

/**
 * The CivilTCR tracks the status of addresses that have been applied and allows
 * users to make transactions that modify the state of the TCR.
 *
 * Users can get stream of currently approved addresses, as well as specific information
 * about individual listings (may or may not be approved)
 *
 * Users can also apply to the registry, challenge applications or listings, as well
 * as collect winnings related to challenges, or withdraw/deposit tokens from listings.
 */
export class CivilTCR extends BaseWrapper<CivilTCRContract> {
  public static singleton(web3Wrapper: Web3Wrapper, contentProvider: ContentProvider): CivilTCR {
    const instance = CivilTCRContract.singletonTrusted(web3Wrapper);
    if (!instance) {
      debug("Smart-contract wrapper for TCR returned null, unsupported network");
      throw new Error(CivilErrors.UnsupportedNetwork);
    }
    return new CivilTCR(web3Wrapper, contentProvider, instance);
  }

  private contentProvider: ContentProvider;
  private voting: Voting;

  private constructor(web3Wrapper: Web3Wrapper, contentProvider: ContentProvider, instance: CivilTCRContract) {
    super(web3Wrapper, instance);
    this.contentProvider = contentProvider;
    this.voting = Voting.singleton(this.web3Wrapper);
  }

  /**
   * Get address for voting contract used with this TCR
   */
  public async getVotingAddress(): Promise<EthAddress> {
    return this.instance.voting.callAsync();
  }

  /**
   * Returns Parameterizer instance associated with this TCR
   */
  public async getParameterizer(): Promise<Parameterizer> {
    return Parameterizer.singleton(this.web3Wrapper);
  }

  /**
   * Get address for token used with this TCR
   */
  public async getTokenAddress(): Promise<EthAddress> {
    return this.instance.token.callAsync();
  }

  /**
   * Get Token instance used with this TCR
   */
  public async getToken(): Promise<EIP20> {
    return EIP20.atUntrusted(this.web3Wrapper, await this.getTokenAddress());
  }

  /**
   * Get address for parameterizer contract used with this TCR
   */
  public async getParameterizerAddress(): Promise<EthAddress> {
    return this.instance.parameterizer.callAsync();
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
  public whitelistedListings(fromBlock: number | "latest" = 0): Observable<EthAddress> {
    return this.instance
      .NewListingWhitelistedStream({}, { fromBlock })
      .map(e => e.args.listingAddress)
      .concatFilter(async listingAddress => this.isWhitelisted(listingAddress));
  }

  /**
   * An unending stream of all addresses currently applied
   * @param fromBlock Starting block in history for events concerning applied addresses.
   *                  Set to "latest" for only new events
   * @returns listings currently in application stage
   */
  public listingsInApplicationStage(fromBlock: number | "latest" = 0): Observable<EthAddress> {
    return this.instance
      .ApplicationStream({}, { fromBlock })
      .map(e => e.args.listingAddress)
      .concatFilter(async listingAddress => this.isInApplicationPhase(listingAddress));
  }

  /**
   * An unending stream of all addresses currently able to be whitelisted
   * @param fromBlock Starting block in history for events concerning ready to whitelist addresses.
   *                  Set to "latest" for only new events
   * @returns addresses ready to be whitelisted
   */
  public readyToBeWhitelistedListings(fromBlock: number | "latest" = 0): Observable<EthAddress> {
    return this.instance
      .ApplicationStream({}, { fromBlock })
      .map(e => e.args.listingAddress)
      .concatFilter(async listingAddress => this.isReadyToWhitelist(listingAddress));
  }

  /**
   * An unending stream of all addresses currently challenged in commit vote phase
   * @param fromBlock Starting block in history for events concerning challenged addresses in commit vote phase.
   *                  Set to "latest" for only new events
   * @returns currently challenged addresses in commit vote phase
   */
  public currentChallengedCommitVotePhaseListings(fromBlock: number | "latest" = 0): Observable<EthAddress> {
    return this.instance
      .ChallengeInitiatedStream({}, { fromBlock })
      .map(e => e.args.listingAddress)
      .concatFilter(async listingAddress => this.isInChallengedCommitVotePhase(listingAddress));
  }

  /**
   * An unending stream of all addresses currently challenged in reveal vote phase
   * @param fromBlock Starting block in history for events concerning challenged addresses in reveal vote phase.
   *                  Set to "latest" for only new events
   * @returns currently challenged addresses in reveal vote phase
   */
  public currentChallengedRevealVotePhaseListings(fromBlock: number | "latest" = 0): Observable<EthAddress> {
    return this.instance
      .ChallengeInitiatedStream({}, { fromBlock })
      .map(e => e.args.listingAddress)
      .concatFilter(async listingAddress => this.isInChallengedRevealVotePhase(listingAddress));
  }

  /**
   * An unending stream of all addresses currently challenged in request appeal phase
   * @param fromBlock Starting block in history for events concerning challenged addresses in request appeal phase.
   *                  Set to "latest" for only new events
   * @returns currently challenged addresses in request appeal phase
   */
  public listingsAwaitingAppealRequest(fromBlock: number | "latest" = 0): Observable<EthAddress> {
    return this.instance
      .ChallengeFailedStream({}, { fromBlock })
      .map(e => e.args.listingAddress)
      .concatFilter(async listingAddress => this.isInRequestAppealPhase(listingAddress));
  }

  /**
   * An unending stream of all addresses currently challenged in appeal phase
   * @param fromBlock Starting block in history for events concerning challenged addresses in appeal phase.
   *                  Set to "latest" for only new events
   * @returns currently challenged addresses in appeal phase
   */
  public listingsAwaitingAppeal(fromBlock: number | "latest" = 0): Observable<EthAddress> {
    return this.instance
      .ChallengeFailedStream({}, { fromBlock })
      .map(e => e.args.listingAddress)
      .concatFilter(async listingAddress => this.isInAppealPhase(listingAddress));
  }

  /**
   * An unending stream of all addresses for listings that can be updated
   * @param fromBlock Starting block in history for events concerning addresses in a state that can be updated
   *                  Set to "latest" for only new events
   * @returns addresses for listings that can be updated
   */
  public listingsAwaitingUpdate(fromBlock: number | "latest" = 0): Observable<EthAddress> {
    return this.instance
      .ApplicationStream({}, { fromBlock })
      .map(e => e.args.listingAddress)
      .concatFilter(async listingAddress => this.challengeCanBeResolved(listingAddress));
  }

  /**
   * An unending stream of all challenges that failed for given listing
   * @param listingAddress Address of failed challenges to get
   * @param fromBlock Starting block in history for events concerning challenges that failed.
   *                  Set to "latest" for only new events
   * @returns all failed challenges for listing since 'fromBlock'
   */
  public failedChallengesForListing(
    listingAddress: EthAddress,
    fromBlock: number | "latest" = 0,
  ): Observable<BigNumber> {
    return this.instance.ChallengeFailedStream({ listingAddress }, { fromBlock }).map(e => e.args.challengeID);
  }

  /**
   * An unending stream of all challenges that succeeded for given listing
   * @param listingAddress Address of succeeded challenges to get
   * @param fromBlock Starting block in history for events concerning challnges that succeeded.
   *                  Set to "latest" for only new events
   * @returns all succeeded challenges for listing since 'fromBlock'
   */
  public successfulChallengesForListing(
    listingAddress: EthAddress,
    fromBlock: number | "latest" = 0,
  ): Observable<BigNumber> {
    return this.instance.ChallengeSucceededStream({ listingAddress }, { fromBlock }).map(e => e.args.challengeID);
  }

  /**
   * Contract Getters
   */

  public async getListing(listingAddress: EthAddress): Promise<Listing> {
    const listing = await this.instance.listings.callAsync(listingAddress);
    return {
      appExpiry: listing[0],
      isWhitelisted: listing[1],
      owner: listing[2],
      unstakedDeposit: listing[3],
      challengeID: listing[4],
    };
  }

  public async getChallenge(challengeID: BigNumber): Promise<Challenge> {
    const challenge = await this.instance.challenges.callAsync(challengeID);
    return {
      rewardPool: challenge[0],
      challenger: challenge[1],
      resolved: challenge[2],
      stake: challenge[3],
      totalTokens: challenge[4],
    };
  }

  public async getAppeal(listingAddress: EthAddress): Promise<Appeal> {
    const appeal = await this.instance.appeals.callAsync(listingAddress);
    return {
      requester: appeal[0],
      requestAppealPhaseExpiry: appeal[1],
      appealRequested: appeal[2],
      appealFeePaid: appeal[3],
      appealPhaseExpiry: appeal[4],
      appealGranted: appeal[5],
      challengeID: appeal[6],
    };
  }

  public async getAppealChallenge(challengeID: BigNumber): Promise<Challenge> {
    // TODO: challenges -> appealChallenges
    const challenge = await this.instance.appealChallenges.callAsync(challengeID);
    return {
      rewardPool: challenge[0],
      challenger: challenge[1],
      resolved: challenge[2],
      stake: challenge[3],
      totalTokens: challenge[4],
    };
  }

  /**
   * Get's the current state of the listing
   * @param listingAddress Address of listing to check state of
   */
  public async getListingState(listingAddress: EthAddress): Promise<ListingState> {
    const listing = await this.getListing(listingAddress);

    if (!await this.doesListingExist(listing)) {
      return ListingState.NOT_FOUND;
    } else if (await this.isInApplicationPhase(listing)) {
      return ListingState.APPLYING;
    } else if (await this.isReadyToWhitelist(listingAddress)) {
      return ListingState.READY_TO_WHITELIST;
    } else if (await this.hasUnresolvedChallenge(listing)) {
      if (await this.isInChallengedCommitVotePhase(listing)) {
        return ListingState.CHALLENGED_IN_COMMIT_VOTE_PHASE;
      } else if (await this.isInChallengedRevealVotePhase(listing)) {
        return ListingState.CHALLENGED_IN_REVEAL_VOTE_PHASE;
      } else if (await this.challengeCanBeResolved(listingAddress, listing)) {
        return ListingState.READY_TO_RESOLVE_CHALLENGE;
      } else {
        const appeal = await this.getAppeal(listingAddress);

        if (await this.isInRequestAppealPhase(appeal)) {
          return ListingState.WAIT_FOR_APPEAL_REQUEST;
        } else if (await this.isInAppealPhase(appeal)) {
          return ListingState.IN_APPEAL_PHASE;
        } else if (await this.isReadyToResolveAppeal(appeal)) {
          return ListingState.READY_TO_RESOLVE_APPEAL;
        } else {
          return ListingState.NOT_FOUND;
        }
      }
    } else if (await this.isWhitelisted(listing)) {
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

  public async getListingInstance(listingOrAddress: EthAddress | Listing): Promise<Listing> {
    let listing: Listing;
    if (isEthAddress(listingOrAddress)) {
      listing = await this.getListing(listingOrAddress);
    } else {
      listing = listingOrAddress;
    }
    return listing;
  }

  public async getAppealInstance(appealOrAddress: EthAddress | Appeal): Promise<Appeal> {
    let appeal: Appeal;
    if (isEthAddress(appealOrAddress)) {
      appeal = await this.getAppeal(appealOrAddress);
    } else {
      appeal = appealOrAddress;
    }
    return appeal;
  }
  /**
   * Checks if the listing exists on the contract. If this is false, either the listing
   * has never applied, or it has applied and been rejected (whether during application
   * or while on whitelist)
   * @param listingAddress address of listing to check
   */
  public async doesListingExist(listingOrAddress: EthAddress | Listing): Promise<boolean> {
    const listing = await this.getListingInstance(listingOrAddress);
    return listing.appExpiry > new BigNumber(0);
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
  public async isWhitelisted(listingOrAddress: EthAddress | Listing): Promise<boolean> {
    const listing = await this.getListingInstance(listingOrAddress);
    return listing.isWhitelisted;
  }

  /**
   * Checks if a listing address is ready to be whitelisted
   * @param listingAddress Address of listing to check
   */
  public async isReadyToWhitelist(listingAddress: EthAddress): Promise<boolean> {
    return this.instance.canBeWhitelisted.callAsync(listingAddress);
  }

  /**
   * Checks if a listing is ready to resolve its appeal. Returns true only if the "request appeal
   * phase" is over and listing owner never requested appeal, or if the "appeal phase" is over and
   * appeal has not yet been resolved
   * @param listingAddress Address of listing to check
   */
  public async isReadyToResolveAppeal(appealOrAddress: EthAddress | Appeal): Promise<boolean> {
    const appeal = await this.getAppealInstance(appealOrAddress);
    const requestAppealPhaseExpiryTimestamp = appeal.requestAppealPhaseExpiry;
    const requestAppealPhaseExpiry = new Date(requestAppealPhaseExpiryTimestamp.toNumber() * 1000);

    const appealPhaseExpiryTimestamp = appeal.appealPhaseExpiry;
    const appealPhaseExpiry = new Date(appealPhaseExpiryTimestamp.toNumber() * 1000);

    const now = new Date();

    if (requestAppealPhaseExpiryTimestamp.toNumber() > 0) {
      // request appeal phase initialized
      if (appealPhaseExpiryTimestamp.toNumber() > 0) {
        // appeal phase initialized
        if (appealPhaseExpiry < now) {
          return true; // appeal phase over
        } else {
          return false; // appeal phase still in progress
        }
      } else if (requestAppealPhaseExpiry < now) {
        return true; // request appeal phase initialized and over, appeal phase never initialized
      } else {
        return false; // request appeal phase still in progress
      }
    } else {
      return false; // request appeal phase never initialized
    }
  }

  /**
   * Checks if a listing address is in unchallenged application phase
   * @param listingAddress Address of potential listing to check
   */
  public async isInApplicationPhase(listingOrAddress: EthAddress | Listing): Promise<boolean> {
    let isInApplicationPhase = true;
    const listing = await this.getListingInstance(listingOrAddress);
    // if expiry time has passed
    if (new Date(listing.appExpiry.toNumber() * 1000) < new Date()) {
      isInApplicationPhase = false;
    }

    if (isInApplicationPhase) {
      // if there is a challenge
      if (!listing.challengeID.isZero()) {
        isInApplicationPhase = false;
      }
    }
    return isInApplicationPhase;
  }

  /**
   * Gets the application expiry timestamp for the given listing address
   * @param listingAddress Address of listing to check
   */
  public async getApplicationExpiryDate(listingOrAddress: EthAddress | Listing): Promise<Date> {
    const listing = await this.getListingInstance(listingOrAddress);
    const applicationExpiryTimestamp = listing.appExpiry;
    return new Date(applicationExpiryTimestamp.toNumber() * 1000);
  }

  /**
   * Checks if a listing address is in challenged commit vote phase
   * @param listingAddress Address of potential listing to check
   * @param pollID Optional pollID causes function to return true only if active challenge is equal to pollID
   */
  public async isInChallengedCommitVotePhase(
    listingOrAddress: EthAddress | Listing,
    pollID?: BigNumber,
  ): Promise<boolean> {
    let isInCommitPhase = true;
    const listing = await this.getListingInstance(listingOrAddress);
    // if there is no challenge
    if (listing.challengeID.toNumber() === 0) {
      isInCommitPhase = false;
    }

    if (pollID) {
      if (!listing.challengeID.equals(pollID)) {
        isInCommitPhase = false;
      }
    }

    if (isInCommitPhase) {
      const commitPeriodActive = await this.voting.isCommitPeriodActive(listing.challengeID);
      if (!commitPeriodActive) {
        isInCommitPhase = false;
      }
    }

    return isInCommitPhase;
  }

  /**
   * Checks if a listing address is in challenged commit vote phase
   * @param listingAddress Address of potential listing to
   * @param pollID Optional pollID causes function to return true only if active challenge is equal to pollID
   */
  public async isInChallengedRevealVotePhase(
    listingOrAddress: EthAddress | Listing,
    pollID?: BigNumber,
  ): Promise<boolean> {
    let isInRevealPhase = true;
    const listing = await this.getListingInstance(listingOrAddress);

    // if there is no challenge
    if (listing.challengeID.toNumber() === 0) {
      isInRevealPhase = false;
    }

    if (pollID) {
      if (!listing.challengeID.equals(pollID)) {
        isInRevealPhase = false;
      }
    }

    if (isInRevealPhase) {
      // if reveal period not active
      const revealPeriodActive = await this.voting.isRevealPeriodActive(listing.challengeID);
      if (!revealPeriodActive) {
        isInRevealPhase = false;
      }
    }

    return isInRevealPhase;
  }

  /**
   * Checks if a listing is currently in the Request Appeal phase
   * @param listingAddress Address of listing to check
   */
  public async isInRequestAppealPhase(appealOrAddress: EthAddress | Appeal): Promise<boolean> {
    const appeal = await this.getAppealInstance(appealOrAddress);
    const appealExpiryDate = this.getRequestAppealExpiryDate(appeal);
    const hasRequestedAppeal = appeal.appealRequested;
    return !hasRequestedAppeal && appealExpiryDate > new Date();
  }

  /**
   * Gets the expiry date-time of the request appeal phase.
   * @param appeal Appeal to check
   */
  public getRequestAppealExpiryDate(appeal: Appeal): Date {
    return new Date(appeal.requestAppealPhaseExpiry.toNumber() * 1000);
  }

  /**
   * Checks if a listing is currently in the Appeal phase
   * @param listingAddress Address of listing to check
   */
  public async isInAppealPhase(appealOrAddress: EthAddress | Appeal): Promise<boolean> {
    const appeal = await this.getAppealInstance(appealOrAddress);
    const appealExpiryDate = await this.getAppealExpiryDate(appeal);
    return appealExpiryDate > new Date();
  }

  /**
   * Gets the expiry time of the appeal phase.
   * @param listingAddress Address of listing to check
   */
  public getAppealExpiryDate(appeal: Appeal): Date {
    return new Date(appeal.appealPhaseExpiry.toNumber() * 1000);
  }

  /**
   * Gets the expiry time of the commit vote phase.
   * @param listingAddress Address of listing to check
   * @throws {CivilErrors.NoChallenge}
   */
  public async getCommitVoteExpiryDate(listingOrAddress: EthAddress | Listing): Promise<Date> {
    const listing = await this.getListingInstance(listingOrAddress);
    // if there is no challenge
    if (listing.challengeID.isZero()) {
      throw CivilErrors.NoChallenge;
    }
    const revealPeriodActive = await this.voting.getCommitPeriodExpiry(listing.challengeID);

    return new Date(revealPeriodActive.toNumber() * 1000);
  }

  /**
   * Gets the expiry time of the commit vote phase.
   * @param listingAddress Address of listing to check
   * @throws {CivilErrors.NoChallenge}
   */
  public async getRevealVoteExpiryDate(listingOrAddress: EthAddress | Listing): Promise<Date> {
    const listing = await this.getListingInstance(listingOrAddress);
    // if there is no challenge
    if (listing.challengeID.isZero()) {
      throw CivilErrors.NoChallenge;
    }
    const revealPeriodActive = await this.voting.getRevealPeriodExpiry(listing.challengeID);

    return new Date(revealPeriodActive.toNumber() * 1000);
  }

  /**
   * Checks if an address has application associated with it
   * App can either be in progress or approved
   * @param address Address of listing to check
   */
  public async appWasMade(listingAddress: EthAddress): Promise<boolean> {
    return this.instance.appWasMade.callAsync(listingAddress);
  }

  /**
   * Checks if an address has application/listing has an unresolved challenge
   * @param address Address of listing to check
   */
  public async challengeExists(listingAddress: EthAddress): Promise<boolean> {
    return this.instance.challengeExists.callAsync(listingAddress);
  }

  /**
   * Gets whether or not the listing has an unresoved challenge
   * @param listingAddress Address of listing to check
   */
  public async hasUnresolvedChallenge(listingOrAddress: EthAddress | Listing): Promise<boolean> {
    const listing = await this.getListingInstance(listingOrAddress);
    if (listing.challengeID.isZero()) {
      return false;
    }
    const challenge = await this.getChallenge(listing.challengeID);
    const isChallengeResolved = challenge.resolved;
    return !isChallengeResolved;
  }

  /**
   * Checks if an address has challenge that can be resolved
   * Challenge can be resolved if reveal period is over but request appeal phase is uninitialized
   * @param address Address of listing to check
   */
  public async challengeCanBeResolved(
    listingAddress: EthAddress,
    listing?: Listing,
    appeal?: Appeal,
  ): Promise<boolean> {
    let listingInstance: Listing;
    if (!listing) {
      listingInstance = await this.getListing(listingAddress);
    } else {
      listingInstance = listing;
    }
    // if challenge exists, but not in commit or reveal phase, and request appeal phase not started
    if (!listingInstance.challengeID.isZero()) {
      const revealPeriodExpiryTimestamp = await this.voting.getRevealPeriodExpiry(listingInstance.challengeID);
      const revealPeriodExpiry = new Date(revealPeriodExpiryTimestamp.toNumber() * 1000);
      if (revealPeriodExpiry < new Date()) {
        const isPassed = await this.voting.isPollPassed(listingInstance.challengeID);
        if (!isPassed) {
          let appealInstance: Appeal;
          if (!appeal) {
            appealInstance = await this.getAppeal(listingAddress);
          } else {
            appealInstance = appeal;
          }
          const requestAppealPhaseExpiry = appealInstance.requestAppealPhaseExpiry;
          if (requestAppealPhaseExpiry.isZero()) {
            return true;
          }
        } else {
          return true;
        }
      }
    }
    return false;
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
  public async hasClaimedTokens(challengeID: BigNumber, voter?: EthAddress): Promise<boolean> {
    let who = voter;
    if (!who) {
      who = requireAccount(this.web3Wrapper);
    }
    return this.instance.hasClaimedTokens.callAsync(challengeID, who);
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
  public async deposit(listingAddress: EthAddress, depositAmount: BigNumber): Promise<TwoStepEthTransaction> {
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
  public async withdraw(listingAddress: EthAddress, withdrawalAmount: BigNumber): Promise<TwoStepEthTransaction> {
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
    return createTwoStepSimple(this.web3Wrapper, await this.instance.exitListing.sendTransactionAsync(listingAddress));
  }

  /**
   * Challenges an application or whitelisted listing
   * @param listingAddress Address of listing to challenge
   * @param data Data associated with challenge
   */
  public async challenge(listingAddress: EthAddress, data: string = ""): Promise<TwoStepEthTransaction> {
    const uri = await this.contentProvider.put(data);
    return this.challengeWithURI(listingAddress, uri);
  }

  /**
   * This is a low-level call and assumes you stored your content on your own
   * Challenges an application or whitelisted listing
   * @param address Address of listing to challenge
   * @param data Data associated with challenge (URI that points to data object)
   */
  public async challengeWithURI(listingAddress: EthAddress, data: string = ""): Promise<TwoStepEthTransaction> {
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
    return createTwoStepSimple(this.web3Wrapper, await this.instance.updateStatus.sendTransactionAsync(listingAddress));
  }

  /**
   * Claims reward associated with challenge
   * @param challengeID ID of challenge to claim reward of
   * @param salt Salt for user's vote on specified challenge
   */
  public async claimReward(challengeID: BigNumber, salt: BigNumber): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(
      this.web3Wrapper,
      await this.instance.claimReward.sendTransactionAsync(challengeID, salt),
    );
  }
}
