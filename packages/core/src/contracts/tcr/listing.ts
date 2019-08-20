import { Observable, Subscription, BehaviorSubject } from "rxjs";
import { CivilTCRContract, CivilTCR } from "../generated/wrappers/civil_t_c_r";
import { EthApi } from "@joincivil/ethapi";
import { EthAddress, ListingWrapper, ListingData, TimestampedEvent } from "../../types";
import { createTimestampedEvent } from "../../utils/events";
import { Challenge } from "./challenge";
import { BigNumber } from "@joincivil/typescript-types";

export class Listing {
  private ethApi: EthApi;
  private tcrInstance: CivilTCRContract;
  private listingAddress: EthAddress;
  private defaultBlock: number;

  constructor(ethApi: EthApi, instance: CivilTCRContract, address: EthAddress, defaultBlock: number) {
    this.ethApi = ethApi;
    this.tcrInstance = instance;
    this.listingAddress = address;
    this.defaultBlock = defaultBlock;
  }

  public async getListingWrapper(): Promise<ListingWrapper> {
    const data = await this.getListingData();
    return {
      address: this.listingAddress,
      data,
    };
  }

  public async getListingData(): Promise<ListingData> {
    const [appExpiry, isWhitelisted, owner, unstakedDeposit, challengeID] = await this.tcrInstance.listings.callAsync(
      this.listingAddress,
    );
    let challenge;
    if (!new BigNumber(challengeID).isZero()) {
      const c = new Challenge(this.ethApi, this.tcrInstance, new BigNumber(challengeID), this.listingAddress);
      challenge = await c.getChallengeData();
    }
    return {
      appExpiry: new BigNumber(appExpiry),
      isWhitelisted,
      owner,
      unstakedDeposit: new BigNumber(unstakedDeposit),
      challengeID: new BigNumber(challengeID),
      challenge,
    };
  }

  //#region EventStreams

  public applications(
    fromBlock: number = this.defaultBlock,
  ): Observable<TimestampedEvent<CivilTCR.LogEvents._Application>> {
    return this.tcrInstance._ApplicationStream({ listingAddress: this.listingAddress }, { fromBlock }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._Application>(this.ethApi, e);
    });
  }

  public challenges(
    fromBlock: number = this.defaultBlock,
  ): Observable<TimestampedEvent<CivilTCR.LogEvents._Challenge>> {
    return this.tcrInstance._ChallengeStream({ listingAddress: this.listingAddress }, { fromBlock }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._Challenge>(this.ethApi, e);
    });
  }

  public deposits(fromBlock: number = this.defaultBlock): Observable<TimestampedEvent<CivilTCR.LogEvents._Deposit>> {
    return this.tcrInstance._DepositStream({ listingAddress: this.listingAddress }, { fromBlock }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._Deposit>(this.ethApi, e);
    });
  }

  public withdrawls(
    fromBlock: number = this.defaultBlock,
  ): Observable<TimestampedEvent<CivilTCR.LogEvents._Withdrawal>> {
    return this.tcrInstance._WithdrawalStream({ listingAddress: this.listingAddress }, { fromBlock }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._Withdrawal>(this.ethApi, e);
    });
  }

  public whitelisteds(
    fromBlock: number = this.defaultBlock,
  ): Observable<TimestampedEvent<CivilTCR.LogEvents._ApplicationWhitelisted>> {
    return this.tcrInstance
      ._ApplicationWhitelistedStream({ listingAddress: this.listingAddress }, { fromBlock })
      .map(e => {
        return createTimestampedEvent<CivilTCR.LogEvents._ApplicationWhitelisted>(this.ethApi, e);
      });
  }

  public applicationRemoveds(
    fromBlock: number = this.defaultBlock,
  ): Observable<TimestampedEvent<CivilTCR.LogEvents._ApplicationRemoved>> {
    return this.tcrInstance._ApplicationRemovedStream({ listingAddress: this.listingAddress }, { fromBlock }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._ApplicationRemoved>(this.ethApi, e);
    });
  }

  public listingRemoveds(
    fromBlock: number = this.defaultBlock,
  ): Observable<TimestampedEvent<CivilTCR.LogEvents._ListingRemoved>> {
    return this.tcrInstance._ListingRemovedStream({ listingAddress: this.listingAddress }, { fromBlock }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._ListingRemoved>(this.ethApi, e);
    });
  }

  public failedChallenges(
    fromBlock: number = this.defaultBlock,
  ): Observable<TimestampedEvent<CivilTCR.LogEvents._ChallengeFailed>> {
    return this.tcrInstance._ChallengeFailedStream({ listingAddress: this.listingAddress }, { fromBlock }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._ChallengeFailed>(this.ethApi, e);
    });
  }

  public successfulChallenges(
    fromBlock: number = this.defaultBlock,
  ): Observable<TimestampedEvent<CivilTCR.LogEvents._ChallengeSucceeded>> {
    return this.tcrInstance._ChallengeSucceededStream({ listingAddress: this.listingAddress }, { fromBlock }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._ChallengeSucceeded>(this.ethApi, e);
    });
  }

  public touchedAndRemoves(
    fromBlock: number = this.defaultBlock,
  ): Observable<TimestampedEvent<CivilTCR.LogEvents._TouchAndRemoved>> {
    return this.tcrInstance._TouchAndRemovedStream({ listingAddress: this.listingAddress }, { fromBlock }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._TouchAndRemoved>(this.ethApi, e);
    });
  }

  public appealChallenges(
    fromBlock: number = this.defaultBlock,
  ): Observable<TimestampedEvent<CivilTCR.LogEvents._GrantedAppealChallenged>> {
    return this.tcrInstance
      ._GrantedAppealChallengedStream({ listingAddress: this.listingAddress }, { fromBlock })
      .map(e => {
        return createTimestampedEvent<CivilTCR.LogEvents._GrantedAppealChallenged>(this.ethApi, e);
      });
  }

  public appealGranteds(
    fromBlock: number = this.defaultBlock,
  ): Observable<TimestampedEvent<CivilTCR.LogEvents._AppealGranted>> {
    return this.tcrInstance._AppealGrantedStream({ listingAddress: this.listingAddress }, { fromBlock }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._AppealGranted>(this.ethApi, e);
    });
  }

  public appealRequesteds(
    fromBlock: number = this.defaultBlock,
  ): Observable<TimestampedEvent<CivilTCR.LogEvents._AppealRequested>> {
    return this.tcrInstance._AppealRequestedStream({ listingAddress: this.listingAddress }, { fromBlock }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._AppealRequested>(this.ethApi, e);
    });
  }

  public compositeObservables(start: number = 0): Observable<any> {
    const appealChallenges = this.appealChallenges(start);
    const appealGranteds = this.appealGranteds(start);
    const appealRequesteds = this.appealRequesteds(start);
    const applicationRemoveds = this.applicationRemoveds(start);
    const applications = this.applications(start);
    const challenges = this.challenges(start);
    const deposits = this.deposits(start);
    const failedChallenges = this.failedChallenges(start);
    const listingRemoveds = this.listingRemoveds(start);
    const successfulChallenges = this.successfulChallenges(start);
    const touchedAndRemoves = this.touchedAndRemoves(start);
    const whitelisteds = this.whitelisteds(start);
    const withdrawls = this.withdrawls(start);

    return Observable.merge(
      appealChallenges,
      appealGranteds,
      appealRequesteds,
      applicationRemoveds,
      applications,
      challenges,
      deposits,
      failedChallenges,
      listingRemoveds,
      successfulChallenges,
      touchedAndRemoves,
      whitelisteds,
      withdrawls,
    );
  }
  public compositeEventsSubscription(start: number = 0): Subscription {
    return this.compositeObservables(start).subscribe();
  }

  public latestChallengeSucceeded(): BehaviorSubject<
    TimestampedEvent<CivilTCR.LogEvents._ChallengeSucceeded> | undefined
  > {
    const subject = new BehaviorSubject<TimestampedEvent<CivilTCR.LogEvents._ChallengeSucceeded> | undefined>(
      undefined,
    );
    this.successfulChallenges().subscribe(subject);
    return subject;
  }

  public latestWhitelisted(): BehaviorSubject<
    TimestampedEvent<CivilTCR.LogEvents._ApplicationWhitelisted> | undefined
  > {
    const subject = new BehaviorSubject<TimestampedEvent<CivilTCR.LogEvents._ApplicationWhitelisted> | undefined>(
      undefined,
    );
    this.whitelisteds().subscribe(subject);
    return subject;
  }

  public latestListingRemoved(): BehaviorSubject<TimestampedEvent<CivilTCR.LogEvents._ListingRemoved> | undefined> {
    const subject = new BehaviorSubject<TimestampedEvent<CivilTCR.LogEvents._ApplicationRemoved> | undefined>(
      undefined,
    );
    this.listingRemoveds().subscribe(subject);
    return subject;
  }

  //#endregion
}
