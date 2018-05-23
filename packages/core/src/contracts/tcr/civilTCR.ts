import BigNumber from "bignumber.js";
import { Observable } from "rxjs";
import * as Debug from "debug";
import "@joincivil/utils";

import { Voting } from "./voting";
import { Parameterizer } from "./parameterizer";
import { BaseWrapper } from "../basewrapper";
import { CivilTCRContract } from "../generated/wrappers/civil_t_c_r";
import { CivilTCRMultisigProxy } from "../generated/multisig/civil_t_c_r";
import { MultisigProxyTransaction } from "../multisig/basemultisigproxy";
import { EthApi } from "../../utils/ethapi";
import { ContentProvider } from "../../content/contentprovider";
import { CivilErrors, requireAccount } from "../../utils/errors";
import { EthAddress, TwoStepEthTransaction, ListingWrapper } from "../../types";
import { createTwoStepSimple } from "../utils/contracts";
import { EIP20 } from "./eip20";
import { Listing } from "./listing";
import {
  canBeWhitelisted,
  isInChallengedCommitVotePhase,
  isInChallengedRevealVotePhase,
  isAwaitingAppealRequest,
  canChallengeBeResolved,
  isAwaitingAppealJudgment,
  isListingAwaitingAppealChallenge,
  isInAppealChallengeCommitPhase,
  isInAppealChallengeRevealPhase,
  canListingAppealBeResolved,
} from "../../utils/listingDataHelpers/listingHelper";
import { Government } from "./government";

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
  public static singleton(ethApi: EthApi, contentProvider: ContentProvider): CivilTCR {
    const instance = CivilTCRContract.singletonTrusted(ethApi);
    if (!instance) {
      debug("Smart-contract wrapper for TCR returned null, unsupported network");
      throw new Error(CivilErrors.UnsupportedNetwork);
    }
    return new CivilTCR(ethApi, contentProvider, instance);
  }

  public static async singletonMultisigProxy(
    ethApi: EthApi,
    contentProvider: ContentProvider,
    multisigAddress?: EthAddress,
  ): Promise<CivilTCR> {
    const civilTCR = CivilTCR.singleton(ethApi, contentProvider);
    if (multisigAddress) {
      civilTCR.multisigProxy = await CivilTCRMultisigProxy.create(ethApi, civilTCR.instance, multisigAddress);
    }
    return civilTCR;
  }

  private contentProvider: ContentProvider;
  private voting: Voting;
  private multisigProxy?: CivilTCRMultisigProxy;

  private constructor(ethApi: EthApi, contentProvider: ContentProvider, instance: CivilTCRContract) {
    super(ethApi, instance);
    this.contentProvider = contentProvider;
    this.voting = Voting.singleton(this.ethApi);
  }

  /**
   * Get address for voting contract used with this TCR
   */
  public async getVotingAddress(): Promise<EthAddress> {
    return this.instance.voting.callAsync();
  }

  /**
   * Get Voting instance used with this TCR
   */
  public getVoting(): Voting {
    return this.voting;
  }

  /**
   * Returns Parameterizer instance associated with this TCR
   */
  public async getParameterizer(): Promise<Parameterizer> {
    return Parameterizer.singleton(this.ethApi);
  }

  public async getGovernment(): Promise<Government> {
    return Government.singleton(this.ethApi);
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
    if (this.multisigProxy) {
      return EIP20.atUntrusted(
        this.ethApi,
        await this.getTokenAddress(),
        await this.multisigProxy.getMultisigAddress(),
      );
    } else {
      return EIP20.atUntrusted(this.ethApi, await this.getTokenAddress());
    }
  }

  /**
   * Get address for parameterizer contract used with this TCR
   */
  public async getParameterizerAddress(): Promise<EthAddress> {
    return this.instance.parameterizer.callAsync();
  }

  //#region EventStreams
  /**
   * An unending stream of all events that change the state of a listing
   * @param fromBlock Starting block in history for events concerning whitelisted addresses.
   *                  Set to "latest" for only new events
   * @returns currently listings as new events get triggered
   */
  public allEventsExceptWhitelistFromBlock(fromBlock: number | "latest" = 0): Observable<ListingWrapper> {
    return Observable.merge(
      this.instance
        ._AppealRequestedStream({}, { fromBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._AppealGrantedStream({}, { fromBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._FailedChallengeOverturnedStream({}, { fromBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._SuccessfulChallengeOverturnedStream({}, { fromBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._GrantedAppealChallengedStream({}, { fromBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._GrantedAppealOverturnedStream({}, { fromBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._GrantedAppealConfirmedStream({}, { fromBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._ChallengeStream({}, { fromBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._DepositStream({}, { fromBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._WithdrawalStream({}, { fromBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._ApplicationRemovedStream({}, { fromBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._ListingRemovedStream({}, { fromBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._ListingWithdrawnStream({}, { fromBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._TouchAndRemovedStream({}, { fromBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._ChallengeFailedStream({}, { fromBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._ChallengeSucceededStream({}, { fromBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),
    ).concatMap(async l => l.getListingWrapper());
  }

  /**
   * An unending stream of all addresses that have been whitelisted
   * @param fromBlock Starting block in history for events concerning whitelisted addresses.
   *                  Set to "latest" for only new events
   * @returns currently whitelisted addresses
   */
  public whitelistedListings(fromBlock: number | "latest" = 0): Observable<ListingWrapper> {
    return this.instance
      ._ApplicationWhitelistedStream({}, { fromBlock })
      .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress))
      .concatMap(async l => l.getListingWrapper());
  }

  /**
   * An unending stream of all addresses that have applied
   * @param fromBlock Starting block in history for events concerning applied addresses.
   *                  Set to "latest" for only new events
   * @returns listings currently in application stage
   */
  public listingsInApplicationStage(fromBlock: number | "latest" = 0): Observable<ListingWrapper> {
    return this.instance
      ._ApplicationStream({}, { fromBlock })
      .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress))
      .concatMap(async l => l.getListingWrapper());
  }

  /**
   * An unending stream of all addresses currently able to be whitelisted
   * @param fromBlock Starting block in history for events concerning ready to whitelist addresses.
   *                  Set to "latest" for only new events
   * @returns addresses ready to be whitelisted
   */
  public readyToBeWhitelistedListings(fromBlock: number | "latest" = 0): Observable<ListingWrapper> {
    return this.instance
      ._ApplicationStream({}, { fromBlock })
      .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress))
      .concatMap(async l => l.getListingWrapper())
      .concatFilter(l => canBeWhitelisted(l.data));
  }

  /**
   * An unending stream of all addresses currently challenged in commit vote phase
   * @param fromBlock Starting block in history for events concerning challenged addresses in commit vote phase.
   *                  Set to "latest" for only new events
   * @returns currently challenged addresses in commit vote phase
   */
  public currentChallengedCommitVotePhaseListings(fromBlock: number | "latest" = 0): Observable<ListingWrapper> {
    return this.instance
      ._ChallengeStream({}, { fromBlock })
      .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress))
      .concatMap(async l => l.getListingWrapper())
      .concatFilter(l => isInChallengedCommitVotePhase(l.data));
  }

  /**
   * An unending stream of all addresses currently challenged in reveal vote phase
   * @param fromBlock Starting block in history for events concerning challenged addresses in reveal vote phase.
   *                  Set to "latest" for only new events
   * @returns currently challenged addresses in reveal vote phase
   */
  public currentChallengedRevealVotePhaseListings(fromBlock: number | "latest" = 0): Observable<ListingWrapper> {
    return this.instance
      ._ChallengeStream({}, { fromBlock })
      .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress))
      .concatMap(async l => l.getListingWrapper())
      .concatFilter(l => isInChallengedRevealVotePhase(l.data));
  }

  /**
   * An unending stream of all addresses currently challenged in request appeal phase
   * @param fromBlock Starting block in history for events concerning challenged addresses in request appeal phase.
   *                  Set to "latest" for only new events
   * @returns currently challenged addresses in request appeal phase
   */
  public listingsAwaitingAppealRequest(fromBlock: number | "latest" = 0): Observable<ListingWrapper> {
    return this.instance
      ._ChallengeStream({}, { fromBlock })
      .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress))
      .concatMap(async l => l.getListingWrapper())
      .concatFilter(l => isAwaitingAppealRequest(l.data));
  }

  public listingsWithChallengeToResolve(fromBlock: number | "latest" = 0): Observable<ListingWrapper> {
    return this.instance
      ._ChallengeStream({}, { fromBlock })
      .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress))
      .concatMap(async l => l.getListingWrapper())
      .concatFilter(l => canChallengeBeResolved(l.data));
  }

  /**
   * An unending stream of all addresses currently challenged in appeal phase
   * @param fromBlock Starting block in history for events concerning challenged addresses in appeal phase.
   *                  Set to "latest" for only new events
   * @returns currently challenged addresses in appeal phase
   */
  public listingsAwaitingAppealJudgment(fromBlock: number | "latest" = 0): Observable<ListingWrapper> {
    return this.instance
      ._ChallengeStream({}, { fromBlock })
      .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress))
      .concatMap(async l => l.getListingWrapper())
      .concatFilter(l => isAwaitingAppealJudgment(l.data));
  }

  /**
   * An unending stream of all addresses currently challenged in appeal phase
   * @param fromBlock Starting block in history for events concerning challenged addresses in appeal phase.
   *                  Set to "latest" for only new events
   * @returns currently challenged addresses in appeal phase
   */
  public listingsAwaitingAppealChallenge(fromBlock: number | "latest" = 0): Observable<ListingWrapper> {
    return this.instance
      ._ChallengeStream({}, { fromBlock })
      .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress))
      .concatMap(async l => l.getListingWrapper())
      .concatFilter(l => isListingAwaitingAppealChallenge(l.data));
  }

  /**
   * An unending stream of all addresses currently challenged in appeal phase
   * @param fromBlock Starting block in history for events concerning challenged addresses in appeal phase.
   *                  Set to "latest" for only new events
   * @returns currently challenged addresses in appeal phase
   */
  public listingsInAppealChallengeCommitPhase(fromBlock: number | "latest" = 0): Observable<ListingWrapper> {
    return this.instance
      ._ChallengeStream({}, { fromBlock })
      .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress))
      .concatMap(async l => l.getListingWrapper())
      .concatFilter(l => isInAppealChallengeCommitPhase(l.data));
  }

  /**
   * An unending stream of all addresses currently challenged in appeal phase
   * @param fromBlock Starting block in history for events concerning challenged addresses in appeal phase.
   *                  Set to "latest" for only new events
   * @returns currently challenged addresses in appeal phase
   */
  public listingsInAppealChallengeRevealPhase(fromBlock: number | "latest" = 0): Observable<ListingWrapper> {
    return this.instance
      ._ChallengeStream({}, { fromBlock })
      .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress))
      .concatMap(async l => l.getListingWrapper())
      .concatFilter(l => isInAppealChallengeRevealPhase(l.data));
  }

  /**
   * An unending stream of all addresses currently challenged in appeal phase
   * @param fromBlock Starting block in history for events concerning challenged addresses in appeal phase.
   *                  Set to "latest" for only new events
   * @returns currently challenged addresses in appeal phase
   */
  public listingsWithAppealToResolve(fromBlock: number | "latest" = 0): Observable<ListingWrapper> {
    return this.instance
      ._ChallengeStream({}, { fromBlock })
      .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress))
      .concatMap(async l => l.getListingWrapper())
      .concatFilter(l => canListingAppealBeResolved(l.data));
  }

  /**
   * An unending stream of all addresses currently challenged in appeal phase
   * @param fromBlock Starting block in history for events concerning challenged addresses in appeal phase.
   *                  Set to "latest" for only new events
   * @returns currently challenged addresses in appeal phase
   */
  public rejectedListings(fromBlock: number | "latest" = 0): Observable<ListingWrapper> {
    return this.instance
      ._ApplicationStream({}, { fromBlock })
      .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress))
      .concatMap(async l => l.getListingWrapper())
      .concatFilter(l => l.data.appExpiry.isZero());
  }

  public allApplicationsEver(): Observable<ListingWrapper> {
    return this.instance
      ._ApplicationStream({}, { fromBlock: 0 })
      .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress))
      .concatMap(async l => l.getListingWrapper());
  }

  //#endregion

  public getListing(listingAddress: EthAddress): Listing {
    return new Listing(this.ethApi, this.instance, listingAddress);
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
      who = requireAccount(this.ethApi);
    }
    return this.instance.voterReward.callAsync(who, challengeID, salt);
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
      who = requireAccount(this.ethApi);
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
  ): Promise<MultisigProxyTransaction> {
    // TODO(tobek) Confirm that multisig proxy isn't needed for generating this URI
    const { uri } = await this.contentProvider.put(applicationContent);

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
  ): Promise<MultisigProxyTransaction> {
    if (this.multisigProxy) {
      return this.multisigProxy.apply.sendTransactionAsync(listingAddress, deposit, applicationContentURI);
    }

    return createTwoStepSimple(
      this.ethApi,
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
      this.ethApi,
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
      this.ethApi,
      await this.instance.withdraw.sendTransactionAsync(listingAddress, withdrawalAmount),
    );
  }

  /**
   * Exits a listing, returning deposited tokens
   * @param address Address of listing to exit
   */
  public async exitListing(listingAddress: EthAddress): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(this.ethApi, await this.instance.exitListing.sendTransactionAsync(listingAddress));
  }

  /**
   * Challenges an application or whitelisted listing
   * @param listingAddress Address of listing to challenge
   * @param data Data associated with challenge
   */
  public async challenge(listingAddress: EthAddress, data: string = ""): Promise<TwoStepEthTransaction> {
    const { uri } = await this.contentProvider.put(data);
    return this.challengeWithURI(listingAddress, uri);
  }

  public async requestAppeal(listingAddres: EthAddress): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(this.ethApi, await this.instance.requestAppeal.sendTransactionAsync(listingAddres));
  }

  public async grantAppeal(listingAddres: EthAddress): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(this.ethApi, await this.instance.grantAppeal.sendTransactionAsync(listingAddres));
  }

  public async challengeGrantedAppeal(listingAddres: EthAddress, data: string = ""): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(
      this.ethApi,
      await this.instance.challengeGrantedAppeal.sendTransactionAsync(listingAddres, data),
    );
  }

  /**
   * This is a low-level call and assumes you stored your content on your own
   * Challenges an application or whitelisted listing
   * @param address Address of listing to challenge
   * @param data Data associated with challenge (URI that points to data object)
   */
  public async challengeWithURI(listingAddress: EthAddress, data: string = ""): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(this.ethApi, await this.instance.challenge.sendTransactionAsync(listingAddress, data));
  }

  /**
   * Updates status of a listing
   * @param address Address of new listing
   */
  public async updateStatus(listingAddress: EthAddress): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(this.ethApi, await this.instance.updateStatus.sendTransactionAsync(listingAddress));
  }

  /**
   * Claims reward associated with challenge
   * @param challengeID ID of challenge to claim reward of
   * @param salt Salt for user's vote on specified challenge
   */
  public async claimReward(challengeID: BigNumber, salt: BigNumber): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(this.ethApi, await this.instance.claimReward.sendTransactionAsync(challengeID, salt));
  }
}
