import { Observable, Subscription } from "rxjs";
import "@joincivil/utils";
import { DecodedLogEntryEvent } from "@joincivil/typescript-types";
import {
  ApplicationArgs,
  CivilTCRContract,
  ChallengeInitiatedArgs,
  DepositArgs,
  NewListingWhitelistedArgs,
  ApplicationRemovedArgs,
  ListingRemovedArgs,
  ChallengeFailedArgs,
  ChallengeSucceededArgs,
  WithdrawalArgs,
} from "../generated/civil_t_c_r";
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

  public applications(): Observable<TimestampedEvent<DecodedLogEntryEvent<ApplicationArgs, string>>> {
    return this.tcrInstance.ApplicationStream({ listingAddress: this.listingAddress }, { fromBlock: 0 }).map(e => {
      return createTimestampedEvent<DecodedLogEntryEvent<ApplicationArgs, string>>(this.web3Wrapper, e);
    });
  }

  public challenges(): Observable<TimestampedEvent<DecodedLogEntryEvent<ChallengeInitiatedArgs, string>>> {
    return this.tcrInstance
      .ChallengeInitiatedStream({ listingAddress: this.listingAddress }, { fromBlock: 0 })
      .map(e => {
        return createTimestampedEvent<DecodedLogEntryEvent<ChallengeInitiatedArgs, string>>(this.web3Wrapper, e);
      });
  }

  public deposits(): Observable<TimestampedEvent<DecodedLogEntryEvent<DepositArgs, string>>> {
    return this.tcrInstance.DepositStream({ listingAddress: this.listingAddress }, { fromBlock: 0 }).map(e => {
      return createTimestampedEvent<DecodedLogEntryEvent<DepositArgs, string>>(this.web3Wrapper, e);
    });
  }

  public withdrawls(): Observable<TimestampedEvent<DecodedLogEntryEvent<WithdrawalArgs, string>>> {
    return this.tcrInstance.WithdrawalStream({ listingAddress: this.listingAddress }, { fromBlock: 0 }).map(e => {
      return createTimestampedEvent<DecodedLogEntryEvent<WithdrawalArgs, string>>(this.web3Wrapper, e);
    });
  }

  public whitelisteds(): Observable<TimestampedEvent<DecodedLogEntryEvent<NewListingWhitelistedArgs, string>>> {
    return this.tcrInstance
      .NewListingWhitelistedStream({ listingAddress: this.listingAddress }, { fromBlock: 0 })
      .map(e => {
        return createTimestampedEvent<DecodedLogEntryEvent<NewListingWhitelistedArgs, string>>(this.web3Wrapper, e);
      });
  }

  public applicationRemoveds(): Observable<TimestampedEvent<DecodedLogEntryEvent<ApplicationRemovedArgs, string>>> {
    return this.tcrInstance
      .ApplicationRemovedStream({ listingAddress: this.listingAddress }, { fromBlock: 0 })
      .map(e => {
        return createTimestampedEvent<DecodedLogEntryEvent<ApplicationRemovedArgs, string>>(this.web3Wrapper, e);
      });
  }

  public listingRemoveds(): Observable<TimestampedEvent<DecodedLogEntryEvent<ListingRemovedArgs, string>>> {
    return this.tcrInstance.ListingRemovedStream({ listingAddress: this.listingAddress }, { fromBlock: 0 }).map(e => {
      return createTimestampedEvent<DecodedLogEntryEvent<ListingRemovedArgs, string>>(this.web3Wrapper, e);
    });
  }

  public failedChallenges(): Observable<TimestampedEvent<DecodedLogEntryEvent<ChallengeFailedArgs, string>>> {
    return this.tcrInstance.ChallengeFailedStream({ listingAddress: this.listingAddress }, { fromBlock: 0 }).map(e => {
      return createTimestampedEvent<DecodedLogEntryEvent<ChallengeFailedArgs, string>>(this.web3Wrapper, e);
    });
  }

  public successfulChallenges(): Observable<TimestampedEvent<DecodedLogEntryEvent<ChallengeSucceededArgs, string>>> {
    return this.tcrInstance
      .ChallengeSucceededStream({ listingAddress: this.listingAddress }, { fromBlock: 0 })
      .map(e => {
        return createTimestampedEvent<DecodedLogEntryEvent<ChallengeSucceededArgs, string>>(this.web3Wrapper, e);
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
