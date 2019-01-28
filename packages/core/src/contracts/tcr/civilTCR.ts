import { EthApi, requireAccount } from "@joincivil/ethapi";
import { CivilErrors, getDefaultFromBlock } from "@joincivil/utils";
import BigNumber from "bignumber.js";
import * as Debug from "debug";
import { Observable } from "rxjs/Observable";
import {
  canBeWhitelisted,
  canChallengeBeResolved,
  canListingAppealBeResolved,
  isAwaitingAppealRequest,
  isInAppealChallengeCommitPhase,
  isInAppealChallengeRevealPhase,
  isInChallengedCommitVotePhase,
  isInChallengedRevealVotePhase,
  isListingAwaitingAppealChallenge,
  isListingAwaitingAppealJudgment,
} from "../../";
import { ContentProvider } from "../../content/contentprovider";
import {
  EthAddress,
  ListingWrapper,
  TwoStepEthTransaction,
  UserChallengeData,
  WrappedChallengeData,
} from "../../types";
import { BaseWrapper } from "../basewrapper";
import { CivilTCRMultisigProxy } from "../generated/multisig/civil_t_c_r";
import { CivilTCRContract } from "../generated/wrappers/civil_t_c_r";
import { MultisigProxyTransaction } from "../multisig/basemultisigproxy";
import { Challenge } from "./challenge";
import { Council } from "./council";
import { CVLToken } from "./cvltoken";
import { Government } from "./government";
import { Listing } from "./listing";
import { Parameterizer } from "./parameterizer";
import { Voting } from "./voting";
import { TxDataAll } from "@joincivil/typescript-types";
import { isChallengeInRevealStage, isChallengeInCommitStage } from "../../utils/listingDataHelpers/challengeHelper";
import { isInCommitStage, isInRevealStage } from "../../utils/listingDataHelpers/pollHelper";

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
 *
 * NOTE: If instantiated with a multisig wallet, *all* transactions are proxied through multisig.
 */
export class CivilTCR extends BaseWrapper<CivilTCRContract> {
  public static async singleton(ethApi: EthApi, contentProvider: ContentProvider): Promise<CivilTCR> {
    const instance = await CivilTCRContract.singletonTrusted(ethApi);
    if (!instance) {
      debug("Smart-contract wrapper for TCR returned null, unsupported network");
      throw new Error(CivilErrors.UnsupportedNetwork);
    }
    // We create this dummy proxy so that `this.multisigProxy` is always available and can be used without knowing if this is a multisig instance or not - the proxy handles non-multisig instances as well.
    const multisigProxyDummy = CivilTCRMultisigProxy.createNonMultisig(ethApi, instance);
    return new CivilTCR(ethApi, contentProvider, instance, multisigProxyDummy, await Voting.singleton(ethApi));
  }

  public static async singletonMultisigProxy(
    ethApi: EthApi,
    contentProvider: ContentProvider,
    multisigAddress?: EthAddress,
  ): Promise<CivilTCR> {
    const instance = await CivilTCRContract.singletonTrusted(ethApi);
    if (!instance) {
      debug("Smart-contract wrapper for TCR returned null, unsupported network");
      throw new Error(CivilErrors.UnsupportedNetwork);
    }
    const multisigProxy = await CivilTCRMultisigProxy.create(ethApi, instance, multisigAddress);
    return new CivilTCR(ethApi, contentProvider, instance, multisigProxy, await Voting.singleton(ethApi));
  }

  private contentProvider: ContentProvider;
  private voting: Voting;
  /** If instantiated with `multisigAddress` undefined, proxy will send transactions directly to the contract instance. */
  private multisigProxy: CivilTCRMultisigProxy;

  private constructor(
    ethApi: EthApi,
    contentProvider: ContentProvider,
    instance: CivilTCRContract,
    multisigProxy: CivilTCRMultisigProxy,
    voting: Voting,
  ) {
    super(ethApi, instance);
    this.contentProvider = contentProvider;
    this.multisigProxy = multisigProxy;
    this.voting = voting;
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

  public async getCouncil(): Promise<Council> {
    return Council.singleton(this.ethApi);
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
  public async getToken(): Promise<CVLToken> {
    if (this.multisigProxy.multisigEnabled) {
      return CVLToken.atUntrusted(
        this.ethApi,
        await this.getTokenAddress(),
        await this.multisigProxy.getMultisigAddress(),
      );
    } else {
      return CVLToken.atUntrusted(this.ethApi, await this.getTokenAddress());
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
  public allEventsExceptWhitelistFromBlock(
    fromBlock: number | "latest" = getDefaultFromBlock(this.ethApi.network()),
    toBlock?: number,
  ): Observable<ListingWrapper> {
    return Observable.merge(
      this.instance
        ._ApplicationStream({}, { fromBlock, toBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),
      this.instance
        ._AppealRequestedStream({}, { fromBlock, toBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._AppealGrantedStream({}, { fromBlock, toBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._FailedChallengeOverturnedStream({}, { fromBlock, toBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._SuccessfulChallengeOverturnedStream({}, { fromBlock, toBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._GrantedAppealChallengedStream({}, { fromBlock, toBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._GrantedAppealOverturnedStream({}, { fromBlock, toBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._GrantedAppealConfirmedStream({}, { fromBlock, toBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._ChallengeStream({}, { fromBlock, toBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._DepositStream({}, { fromBlock, toBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._WithdrawalStream({}, { fromBlock, toBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._ApplicationRemovedStream({}, { fromBlock, toBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._ListingRemovedStream({}, { fromBlock, toBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._ListingWithdrawnStream({}, { fromBlock, toBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._TouchAndRemovedStream({}, { fromBlock, toBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._ChallengeFailedStream({}, { fromBlock, toBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),

      this.instance
        ._ChallengeSucceededStream({}, { fromBlock, toBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress)),
    ).concatMap(async l => l.getListingWrapper());
  }

  /**
   * An unending stream of all events that change the state of a listing
   * @param fromBlock Starting block in history for events concerning whitelisted addresses.
   *                  Set to "latest" for only new events
   * @returns currently listings as new events get triggered
   */
  public allEventsFromBlock(
    fromBlock: number | "latest" = getDefaultFromBlock(this.ethApi.network()),
    toBlock?: number,
  ): Observable<ListingWrapper> {
    return Observable.merge(
      this.allEventsExceptWhitelistFromBlock(fromBlock, toBlock),
      this.instance
        ._ApplicationWhitelistedStream({}, { fromBlock, toBlock })
        .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress))
        .concatMap(async l => l.getListingWrapper()),
    );
  }

  /**
   * An unending stream of all addresses that have been whitelisted
   * @param fromBlock Starting block in history for events concerning whitelisted addresses.
   *                  Set to "latest" for only new events
   * @returns currently whitelisted addresses
   */
  public whitelistedListings(
    fromBlock: number | "latest" = getDefaultFromBlock(this.ethApi.network()),
    toBlock?: number,
  ): Observable<ListingWrapper> {
    return this.instance
      ._ApplicationWhitelistedStream({}, { fromBlock, toBlock })
      .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress))
      .concatMap(async l => l.getListingWrapper());
  }

  /**
   * An unending stream of all addresses that have applied
   * @param fromBlock Starting block in history for events concerning applied addresses.
   *                  Set to "latest" for only new events
   * @returns listings currently in application stage
   */
  public listingsInApplicationStage(
    fromBlock: number | "latest" = getDefaultFromBlock(this.ethApi.network()),
    toBlock?: number,
  ): Observable<ListingWrapper> {
    return this.instance
      ._ApplicationStream({}, { fromBlock, toBlock })
      .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress))
      .concatMap(async l => l.getListingWrapper());
  }

  /**
   * An unending stream of all addresses currently able to be whitelisted
   * @param fromBlock Starting block in history for events concerning ready to whitelist addresses.
   *                  Set to "latest" for only new events
   * @returns addresses ready to be whitelisted
   */
  public readyToBeWhitelistedListings(
    fromBlock: number | "latest" = getDefaultFromBlock(this.ethApi.network()),
    toBlock?: number,
  ): Observable<ListingWrapper> {
    return this.instance
      ._ApplicationStream({}, { fromBlock, toBlock })
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
  public currentChallengedCommitVotePhaseListings(
    fromBlock: number | "latest" = getDefaultFromBlock(this.ethApi.network()),
    toBlock?: number,
  ): Observable<ListingWrapper> {
    return this.instance
      ._ChallengeStream({}, { fromBlock, toBlock })
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
  public currentChallengedRevealVotePhaseListings(
    fromBlock: number | "latest" = getDefaultFromBlock(this.ethApi.network()),
    toBlock?: number,
  ): Observable<ListingWrapper> {
    return this.instance
      ._ChallengeStream({}, { fromBlock, toBlock })
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
  public listingsAwaitingAppealRequest(
    fromBlock: number | "latest" = getDefaultFromBlock(this.ethApi.network()),
    toBlock?: number,
  ): Observable<ListingWrapper> {
    return this.instance
      ._ChallengeStream({}, { fromBlock, toBlock })
      .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress))
      .concatMap(async l => l.getListingWrapper())
      .concatFilter(l => isAwaitingAppealRequest(l.data));
  }

  public listingsWithChallengeToResolve(
    fromBlock: number | "latest" = getDefaultFromBlock(this.ethApi.network()),
    toBlock?: number,
  ): Observable<ListingWrapper> {
    return this.instance
      ._ChallengeStream({}, { fromBlock, toBlock })
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
  public listingsAwaitingAppealJudgment(
    fromBlock: number | "latest" = getDefaultFromBlock(this.ethApi.network()),
    toBlock?: number,
  ): Observable<ListingWrapper> {
    return this.instance
      ._ChallengeStream({}, { fromBlock, toBlock })
      .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress))
      .concatMap(async l => l.getListingWrapper())
      .concatFilter(l => isListingAwaitingAppealJudgment(l.data));
  }

  /**
   * An unending stream of all addresses currently challenged in appeal phase
   * @param fromBlock Starting block in history for events concerning challenged addresses in appeal phase.
   *                  Set to "latest" for only new events
   * @returns currently challenged addresses in appeal phase
   */
  public listingsAwaitingAppealChallenge(
    fromBlock: number | "latest" = getDefaultFromBlock(this.ethApi.network()),
    toBlock?: number,
  ): Observable<ListingWrapper> {
    return this.instance
      ._ChallengeStream({}, { fromBlock, toBlock })
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
  public listingsInAppealChallengeCommitPhase(
    fromBlock: number | "latest" = getDefaultFromBlock(this.ethApi.network()),
    toBlock?: number,
  ): Observable<ListingWrapper> {
    return this.instance
      ._ChallengeStream({}, { fromBlock, toBlock })
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
  public listingsInAppealChallengeRevealPhase(
    fromBlock: number | "latest" = getDefaultFromBlock(this.ethApi.network()),
    toBlock?: number,
  ): Observable<ListingWrapper> {
    return this.instance
      ._ChallengeStream({}, { fromBlock, toBlock })
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
  public listingsWithAppealToResolve(
    fromBlock: number | "latest" = getDefaultFromBlock(this.ethApi.network()),
    toBlock?: number,
  ): Observable<ListingWrapper> {
    return this.instance
      ._ChallengeStream({}, { fromBlock, toBlock })
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
  public rejectedListings(
    fromBlock: number | "latest" = getDefaultFromBlock(this.ethApi.network()),
    toBlock?: number,
  ): Observable<ListingWrapper> {
    return this.instance
      ._ApplicationStream({}, { fromBlock, toBlock })
      .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress))
      .concatMap(async l => l.getListingWrapper())
      .concatFilter(l => l.data.appExpiry.isZero());
  }

  public allApplicationsEver(): Observable<ListingWrapper> {
    return this.instance
      ._ApplicationStream({}, { fromBlock: getDefaultFromBlock(this.ethApi.network()) })
      .map(e => new Listing(this.ethApi, this.instance, e.args.listingAddress))
      .concatMap(async l => l.getListingWrapper());
  }

  public challengesStartedByUser(user: EthAddress): Observable<BigNumber> {
    return this.instance
      ._ChallengeStream({ challenger: user }, { fromBlock: getDefaultFromBlock(this.ethApi.network()) })
      .map(e => e.args.challengeID);
  }

  /**
   * An unending stream of all pollIDs of polls the user has collected rewards on
   * @param fromBlock Starting block in history for events concerning new polls
   *                  Set to "latest" for only new events
   * @param user the user to check
   */
  public rewardsCollected(
    fromBlock: number | "latest" = getDefaultFromBlock(this.ethApi.network()),
    user?: EthAddress,
    toBlock?: number,
  ): Observable<BigNumber> {
    return this.instance._RewardClaimedStream({ voter: user }, { fromBlock, toBlock }).map(e => e.args.challengeID);
  }

  //#endregion

  public getListing(listingAddress: EthAddress): Listing {
    return new Listing(this.ethApi, this.instance, listingAddress);
  }

  public async getRawGrantAppealTxData(listingAddress: EthAddress): Promise<TxDataAll> {
    return this.instance.grantAppeal.getRaw(listingAddress, "", { gas: 0 });
  }

  /*
   * It is possible to have a pollID without knowing if it corresponds to a challenge or an appeal challenge
   * (e.g., if you subscribed to an event stream on the voting contract)
   * This function checks event streams on the CivilTCR contract (only one of which will ever fire) in order to
   * return the challengeID associated with the poll. If the pollID corresponds to a challenge, the returned value will
   * equal the poll ID. If the pollID corresponds to an appeal challenge, the returned value will be the challengeID
   * of the original challenge that was appealed.
   * @param pollID an ID of a poll which can correspond to either a challenge or an appeal challenge
   * @return the challengeID associated with the pollID passed in
   */
  public async getChallengeIDForPollID(pollID: BigNumber): Promise<BigNumber> {
    const challengeStream = this.instance._ChallengeStream(
      { challengeID: pollID },
      { fromBlock: getDefaultFromBlock(this.ethApi.network()) },
    );
    const appealChallengeStream = this.instance._GrantedAppealChallengedStream(
      { appealChallengeID: pollID },
      { fromBlock: getDefaultFromBlock(this.ethApi.network()) },
    );
    const event = await challengeStream
      .merge(appealChallengeStream)
      .first() // only one will ever emit an event and it will emit exactly one
      .toPromise();

    return event.args.challengeID; // both events have this argument
  }

  public async getChallengeData(challengeID: BigNumber): Promise<WrappedChallengeData> {
    const challenge = new Challenge(this.ethApi, this.instance, challengeID);
    const listingAddress = await challenge.getListingIdForChallenge();
    const challengeData = await challenge.getChallengeData();
    return {
      listingAddress,
      challengeID,
      challenge: challengeData,
    };
  }

  public async getUserChallengeData(challengeID: BigNumber, user: EthAddress): Promise<UserChallengeData> {
    let didUserCommit;
    let didUserReveal;
    let didUserCollect;
    let didUserRescue = false;
    let didCollectAmount;
    let isVoterWinner;
    let salt;
    let numTokens;
    let choice;
    const [, , resolved] = await this.instance.challenges.callAsync(challengeID);
    const pollData = await this.voting.getPoll(challengeID);
    let canUserReveal;
    let canUserRescue;
    let canUserCollect;
    if (user) {
      didUserCommit = await this.voting.didCommitVote(user, challengeID);
      if (didUserCommit) {
        didUserReveal = await this.voting.didRevealVote(user, challengeID);
        if (resolved) {
          if (didUserReveal) {
            const reveal = await this.voting.getRevealedVoteEvent(challengeID, user);
            salt = reveal!.args.salt;
            numTokens = reveal!.args.numTokens;
            choice = reveal!.args.choice;
            didUserCollect = await this.instance.tokenClaims.callAsync(challengeID, user);
            isVoterWinner = await this.voting.isVoterWinner(challengeID, user);
            canUserCollect = isVoterWinner && !didUserCollect;
          } else {
            didUserRescue =
              !(await this.voting.canRescueTokens(user, challengeID)) &&
              !(await isInCommitStage(pollData)) &&
              !(await isInRevealStage(pollData));
          }
        } else {
          canUserReveal = !didUserReveal && (await isInRevealStage(pollData));
        }
        canUserRescue = !didUserRescue && !(await isInCommitStage(pollData)) && !(await isInRevealStage(pollData));
      }
    }

    if (didUserCollect) {
      didCollectAmount = await this.getRewardClaimed(challengeID, user);
    }

    return {
      didUserCommit,
      didUserReveal,
      canUserReveal,
      didUserCollect,
      canUserCollect,
      didUserRescue,
      canUserRescue,
      didCollectAmount,
      isVoterWinner,
      salt,
      numTokens,
      choice,
    };
  }

  public async getRewardClaimed(challengeID: BigNumber, user: EthAddress): Promise<BigNumber> {
    const reward = await this.instance
      ._RewardClaimedStream({ challengeID, voter: user }, { fromBlock: getDefaultFromBlock(this.ethApi.network()) })
      .first()
      .toPromise();
    return reward.args.reward;
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
      who = await requireAccount(this.ethApi).toPromise();
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
      who = await requireAccount(this.ethApi).toPromise();
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
  ): Promise<MultisigProxyTransaction> {
    // const { uri } = await this.contentProvider.put(applicationContent);

    return this.applyWithURI(listingAddress, deposit, "");
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
    return this.multisigProxy.apply.sendTransactionAsync(listingAddress, deposit, applicationContentURI);
  }

  /**
   * Deposits more tokens into a listing
   * @param address Address of listing to deposit to
   * @param depositAmount How many tokens to deposit
   */
  public async deposit(listingAddress: EthAddress, depositAmount: BigNumber): Promise<MultisigProxyTransaction> {
    return this.multisigProxy.deposit.sendTransactionAsync(listingAddress, depositAmount);
  }

  /**
   * Withdraw tokens from a listing
   * @param address Address of listing to withdraw from
   * @param withdrawalAmount How many tokens to withdraw
   */
  public async withdraw(listingAddress: EthAddress, withdrawalAmount: BigNumber): Promise<MultisigProxyTransaction> {
    return this.multisigProxy.withdraw.sendTransactionAsync(listingAddress, withdrawalAmount);
  }

  /**
   * Exits a listing, returning deposited tokens
   * @param address Address of listing to exit
   */
  public async exitListing(listingAddress: EthAddress): Promise<MultisigProxyTransaction> {
    return this.multisigProxy.exit.sendTransactionAsync(listingAddress);
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

  public async requestAppeal(listingAddress: EthAddress, data: string = ""): Promise<TwoStepEthTransaction> {
    const { uri } = await this.contentProvider.put(data);
    return this.requestAppealWithURI(listingAddress, uri);
  }

  public async grantAppeal(listingAddress: EthAddress, data: string = ""): Promise<MultisigProxyTransaction> {
    return this.multisigProxy.grantAppeal.sendTransactionAsync(listingAddress, data);
  }

  public async challengeGrantedAppeal(
    listingAddress: EthAddress,
    data: string = "",
  ): Promise<MultisigProxyTransaction> {
    return this.multisigProxy.challengeGrantedAppeal.sendTransactionAsync(listingAddress, data);
  }

  public async challengeGrantedAppealWithURI(
    listingAddress: EthAddress,
    uri: string = "",
  ): Promise<MultisigProxyTransaction> {
    return this.multisigProxy.challengeGrantedAppeal.sendTransactionAsync(listingAddress, uri);
  }

  /**
   * This is a low-level call and assumes you stored your content on your own
   * Challenges an application or whitelisted listing
   * @param address Address of listing to challenge
   * @param data Data associated with challenge (URI that points to data object)
   */
  public async challengeWithURI(listingAddress: EthAddress, data: string = ""): Promise<MultisigProxyTransaction> {
    return this.multisigProxy.challenge.sendTransactionAsync(listingAddress, data);
  }

  /**
   * This is a low-level call and assumes you stored your content on your own
   * Requests an appeal on a challenged application
   * @param address Address of listing to request appeal
   * @param data Data associated with requested appeal (URI that points to data object)
   */
  public async requestAppealWithURI(listingAddress: EthAddress, data: string = ""): Promise<MultisigProxyTransaction> {
    return this.multisigProxy.requestAppeal.sendTransactionAsync(listingAddress, data);
  }

  /**
   * Updates status of a listing
   * @param address Address of new listing
   */
  public async updateStatus(listingAddress: EthAddress): Promise<MultisigProxyTransaction> {
    return this.multisigProxy.updateStatus.sendTransactionAsync(listingAddress);
  }

  /**
   * Claims reward associated with challenge
   * @param challengeID ID of challenge to claim reward of
   * @param salt Salt for user's vote on specified challenge
   */
  public async claimReward(challengeID: BigNumber, salt: BigNumber): Promise<MultisigProxyTransaction> {
    return this.multisigProxy.claimReward.sendTransactionAsync(challengeID, salt);
  }

  /**
   * Claims multiple rewards associated with challenges
   * @param challengeIDs IDs of challenges to claim rewards of
   * @param salts Salts for user's votes on specified challenges
   */
  public async multiClaimReward(challengeIDs: BigNumber[], salts: BigNumber[]): Promise<MultisigProxyTransaction> {
    return this.multisigProxy.claimRewards.sendTransactionAsync(challengeIDs, salts);
  }
}
