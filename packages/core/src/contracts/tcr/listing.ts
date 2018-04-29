import { Observable, Subscription } from "rxjs";
import "@joincivil/utils";
import {
  CivilTCRContract,
  CivilTCRLogEventsApplication,
  CivilTCRLogEventsChallengeInitiated,
  CivilTCRLogEventsDeposit,
  CivilTCRLogEventsWithdrawal,
  CivilTCRLogEventsChallengeSucceeded,
  CivilTCRLogEventsChallengeFailed,
  CivilTCRLogEventsListingRemoved,
  CivilTCRLogEventsApplicationRemoved,
  CivilTCRLogEventsNewListingWhitelisted,
} from "../generated/wrappers/civil_t_c_r";
import { Web3Wrapper } from "../../utils/web3wrapper";
import { EthAddress, ListingWrapper, ListingData, TimestampedEvent } from "../../types";
import { createTimestampedEvent } from "../../utils/events";
import { Challenge } from "./challenge";

export class Listing {
  private web3Wrapper: Web3Wrapper;
  private tcrInstance: CivilTCRContract;
  private listingAddress: EthAddress;

  constructor(web3Wrapper: Web3Wrapper, instance: CivilTCRContract, address: EthAddress) {
    this.web3Wrapper = web3Wrapper;
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
      const c = new Challenge(this.web3Wrapper, this.tcrInstance, challengeID);
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

  public applications(): Observable<TimestampedEvent<CivilTCRLogEventsApplication>> {
    return this.tcrInstance.ApplicationStream({ listingAddress: this.listingAddress }, { fromBlock: 0 }).map(e => {
      return createTimestampedEvent<CivilTCRLogEventsApplication>(this.web3Wrapper, e);
    });
  }

  public challenges(): Observable<TimestampedEvent<CivilTCRLogEventsChallengeInitiated>> {
    return this.tcrInstance
      .ChallengeInitiatedStream({ listingAddress: this.listingAddress }, { fromBlock: 0 })
      .map(e => {
        return createTimestampedEvent<CivilTCRLogEventsChallengeInitiated>(this.web3Wrapper, e);
      });
  }

  public deposits(): Observable<TimestampedEvent<CivilTCRLogEventsDeposit>> {
    return this.tcrInstance.DepositStream({ listingAddress: this.listingAddress }, { fromBlock: 0 }).map(e => {
      return createTimestampedEvent<CivilTCRLogEventsDeposit>(this.web3Wrapper, e);
    });
  }

  public withdrawls(): Observable<TimestampedEvent<CivilTCRLogEventsWithdrawal>> {
    return this.tcrInstance.WithdrawalStream({ listingAddress: this.listingAddress }, { fromBlock: 0 }).map(e => {
      return createTimestampedEvent<CivilTCRLogEventsWithdrawal>(this.web3Wrapper, e);
    });
  }

  public whitelisteds(): Observable<TimestampedEvent<CivilTCRLogEventsNewListingWhitelisted>> {
    return this.tcrInstance
      .NewListingWhitelistedStream({ listingAddress: this.listingAddress }, { fromBlock: 0 })
      .map(e => {
        return createTimestampedEvent<CivilTCRLogEventsNewListingWhitelisted>(this.web3Wrapper, e);
      });
  }

  public applicationRemoveds(): Observable<TimestampedEvent<CivilTCRLogEventsApplicationRemoved>> {
    return this.tcrInstance
      .ApplicationRemovedStream({ listingAddress: this.listingAddress }, { fromBlock: 0 })
      .map(e => {
        return createTimestampedEvent<CivilTCRLogEventsApplicationRemoved>(this.web3Wrapper, e);
      });
  }

  public listingRemoveds(): Observable<TimestampedEvent<CivilTCRLogEventsListingRemoved>> {
    return this.tcrInstance.ListingRemovedStream({ listingAddress: this.listingAddress }, { fromBlock: 0 }).map(e => {
      return createTimestampedEvent<CivilTCRLogEventsListingRemoved>(this.web3Wrapper, e);
    });
  }

  public failedChallenges(): Observable<TimestampedEvent<CivilTCRLogEventsChallengeFailed>> {
    return this.tcrInstance.ChallengeFailedStream({ listingAddress: this.listingAddress }, { fromBlock: 0 }).map(e => {
      return createTimestampedEvent<CivilTCRLogEventsChallengeFailed>(this.web3Wrapper, e);
    });
  }

  public successfulChallenges(): Observable<TimestampedEvent<CivilTCRLogEventsChallengeSucceeded>> {
    return this.tcrInstance
      .ChallengeSucceededStream({ listingAddress: this.listingAddress }, { fromBlock: 0 })
      .map(e => {
        return createTimestampedEvent<CivilTCRLogEventsChallengeSucceeded>(this.web3Wrapper, e);
      });
  }

  public compositeObservables(): Observable<any> {
    const applications = this.applications();
    const challenges = this.challenges();
    const deposits = this.deposits();
    const withdrawls = this.withdrawls();
    const whitelisteds = this.whitelisteds();
    const applicationRemoveds = this.applicationRemoveds();
    const listingRemoveds = this.listingRemoveds();
    const failedChallenges = this.failedChallenges();
    const successfulChallenges = this.successfulChallenges();

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
  public compositeEventsSubscription(): Subscription {
    return this.compositeObservables().subscribe();
  }

  //#endregion
}
