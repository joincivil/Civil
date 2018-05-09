import { Observable, Subscription } from "rxjs";
import "@joincivil/utils";
import { CivilTCRContract, CivilTCR } from "../generated/wrappers/civil_t_c_r";
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

  public applications(): Observable<TimestampedEvent<CivilTCR.LogEvents._Application>> {
    return this.tcrInstance._ApplicationStream({ listingAddress: this.listingAddress }, { fromBlock: 0 }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._Application>(this.web3Wrapper, e);
    });
  }

  public challenges(): Observable<TimestampedEvent<CivilTCR.LogEvents._Challenge>> {
    return this.tcrInstance._ChallengeStream({ listingAddress: this.listingAddress }, { fromBlock: 0 }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._Challenge>(this.web3Wrapper, e);
    });
  }

  public deposits(): Observable<TimestampedEvent<CivilTCR.LogEvents._Deposit>> {
    return this.tcrInstance._DepositStream({ listingAddress: this.listingAddress }, { fromBlock: 0 }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._Deposit>(this.web3Wrapper, e);
    });
  }

  public withdrawls(): Observable<TimestampedEvent<CivilTCR.LogEvents._Withdrawal>> {
    return this.tcrInstance._WithdrawalStream({ listingAddress: this.listingAddress }, { fromBlock: 0 }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._Withdrawal>(this.web3Wrapper, e);
    });
  }

  public whitelisteds(): Observable<TimestampedEvent<CivilTCR.LogEvents._ApplicationWhitelisted>> {
    return this.tcrInstance
      ._ApplicationWhitelistedStream({ listingAddress: this.listingAddress }, { fromBlock: 0 })
      .map(e => {
        return createTimestampedEvent<CivilTCR.LogEvents._ApplicationWhitelisted>(this.web3Wrapper, e);
      });
  }

  public applicationRemoveds(): Observable<TimestampedEvent<CivilTCR.LogEvents._ApplicationRemoved>> {
    return this.tcrInstance
      ._ApplicationRemovedStream({ listingAddress: this.listingAddress }, { fromBlock: 0 })
      .map(e => {
        return createTimestampedEvent<CivilTCR.LogEvents._ApplicationRemoved>(this.web3Wrapper, e);
      });
  }

  public listingRemoveds(): Observable<TimestampedEvent<CivilTCR.LogEvents._ListingRemoved>> {
    return this.tcrInstance._ListingRemovedStream({ listingAddress: this.listingAddress }, { fromBlock: 0 }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._ListingRemoved>(this.web3Wrapper, e);
    });
  }

  public failedChallenges(): Observable<TimestampedEvent<CivilTCR.LogEvents._ChallengeFailed>> {
    return this.tcrInstance._ChallengeFailedStream({ listingAddress: this.listingAddress }, { fromBlock: 0 }).map(e => {
      return createTimestampedEvent<CivilTCR.LogEvents._ChallengeFailed>(this.web3Wrapper, e);
    });
  }

  public successfulChallenges(): Observable<TimestampedEvent<CivilTCR.LogEvents._ChallengeSucceeded>> {
    return this.tcrInstance
      ._ChallengeSucceededStream({ listingAddress: this.listingAddress }, { fromBlock: 0 })
      .map(e => {
        return createTimestampedEvent<CivilTCR.LogEvents._ChallengeSucceeded>(this.web3Wrapper, e);
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
