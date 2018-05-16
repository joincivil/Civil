import { Observable, Subscription } from "rxjs";
import "@joincivil/utils";
import { CivilTCRContract, CivilTCR } from "../generated/wrappers/civil_t_c_r";
import { EthApi } from "../../utils/ethapi";
import { EthAddress, ListingWrapper, ListingData, TimestampedEvent } from "../../types";
import { createTimestampedEvent } from "../../utils/events";
import { Challenge } from "./challenge";

export class Listing {
  private ethApi: EthApi;
  private tcrInstance: CivilTCRContract;
  private listingAddress: EthAddress;

  constructor(ethApi: EthApi, instance: CivilTCRContract, address: EthAddress) {
    this.ethApi = ethApi;
    this.tcrInstance = instance;
    this.listingAddress = address;
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
    if (!challengeID.isZero()) {
      const c = new Challenge(this.ethApi, this.tcrInstance, challengeID);
      challenge = await c.getChallengeData();
    }
    return {
      appExpiry,
      isWhitelisted,
      owner,
      unstakedDeposit,
      challengeID,
      challenge,
    };
  }

  //#region EventStreams

  public applications(fromBlock: number = 0): Observable<TimestampedEvent<CivilTCR.LogEvents._Application>> {
    return this.tcrInstance._ApplicationStream({ listingAddress: this.listingAddress }, { fromBlock }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._Application>(this.ethApi, e);
    });
  }

  public challenges(fromBlock: number = 0): Observable<TimestampedEvent<CivilTCR.LogEvents._Challenge>> {
    return this.tcrInstance._ChallengeStream({ listingAddress: this.listingAddress }, { fromBlock }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._Challenge>(this.ethApi, e);
    });
  }

  public deposits(fromBlock: number = 0): Observable<TimestampedEvent<CivilTCR.LogEvents._Deposit>> {
    return this.tcrInstance._DepositStream({ listingAddress: this.listingAddress }, { fromBlock }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._Deposit>(this.ethApi, e);
    });
  }

  public withdrawls(fromBlock: number = 0): Observable<TimestampedEvent<CivilTCR.LogEvents._Withdrawal>> {
    return this.tcrInstance._WithdrawalStream({ listingAddress: this.listingAddress }, { fromBlock }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._Withdrawal>(this.ethApi, e);
    });
  }

  public whitelisteds(fromBlock: number = 0): Observable<TimestampedEvent<CivilTCR.LogEvents._ApplicationWhitelisted>> {
    return this.tcrInstance
      ._ApplicationWhitelistedStream({ listingAddress: this.listingAddress }, { fromBlock })
      .map(e => {
        return createTimestampedEvent<CivilTCR.LogEvents._ApplicationWhitelisted>(this.ethApi, e);
      });
  }

  public applicationRemoveds(fromBlock: number = 0): Observable<TimestampedEvent<CivilTCR.LogEvents._ApplicationRemoved>> {
    return this.tcrInstance._ApplicationRemovedStream({ listingAddress: this.listingAddress }, { fromBlock }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._ApplicationRemoved>(this.ethApi, e);
    });
  }

  public listingRemoveds(fromBlock: number = 0): Observable<TimestampedEvent<CivilTCR.LogEvents._ListingRemoved>> {
    return this.tcrInstance._ListingRemovedStream({ listingAddress: this.listingAddress }, { fromBlock }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._ListingRemoved>(this.ethApi, e);
    });
  }

  public failedChallenges(fromBlock: number = 0): Observable<TimestampedEvent<CivilTCR.LogEvents._ChallengeFailed>> {
    return this.tcrInstance._ChallengeFailedStream({ listingAddress: this.listingAddress }, { fromBlock }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._ChallengeFailed>(this.ethApi, e);
    });
  }

  public successfulChallenges(fromBlock: number = 0): Observable<TimestampedEvent<CivilTCR.LogEvents._ChallengeSucceeded>> {
    return this.tcrInstance._ChallengeSucceededStream({ listingAddress: this.listingAddress }, { fromBlock }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._ChallengeSucceeded>(this.ethApi, e);
    });
  }

  public compositeObservables(start: number = 0): Observable<any> {
    const applications = this.applications(start);
    const challenges = this.challenges(start);
    const deposits = this.deposits(start);
    const withdrawls = this.withdrawls(start);
    const whitelisteds = this.whitelisteds(start);
    const applicationRemoveds = this.applicationRemoveds(start);
    const listingRemoveds = this.listingRemoveds(start);
    const failedChallenges = this.failedChallenges(start);
    const successfulChallenges = this.successfulChallenges(start);

    return Observable.merge(
      applications,
      challenges,
      deposits,
      withdrawls,
      whitelisteds,
      applicationRemoveds,
      listingRemoveds,
      failedChallenges,
      successfulChallenges,
    );
  }
  public compositeEventsSubscription(start: number = 0): Subscription {
    return this.compositeObservables(start).subscribe();
  }

  //#endregion
}
