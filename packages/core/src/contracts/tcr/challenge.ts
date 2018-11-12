import { EthApi } from "@joincivil/ethapi";
import { getDefaultFromBlock } from "@joincivil/utils";
import BigNumber from "bignumber.js";
import { ChallengeData, EthAddress } from "../../types";
import { CivilTCRContract } from "../generated/wrappers/civil_t_c_r";
import { Appeal } from "./appeal";
import { Voting } from "./voting";

export class Challenge {
  private ethApi: EthApi;
  private tcrInstance: CivilTCRContract;
  private challengeId: BigNumber;
  private voting: Promise<Voting>;
  private listingAddress?: EthAddress;

  constructor(ethApi: EthApi, instance: CivilTCRContract, challengeId: BigNumber, listingAddress?: EthAddress) {
    this.ethApi = ethApi;
    this.tcrInstance = instance;
    this.challengeId = challengeId;
    this.listingAddress = listingAddress;
    this.voting = Voting.singleton(ethApi);
  }

  public async getChallengeData(): Promise<ChallengeData> {
    const resolvedVoting = await this.voting;
    const [rewardPool, challenger, resolved, stake, totalTokens] = await this.tcrInstance.challenges.callAsync(
      this.challengeId,
    );
    const challengeStatementURI = await this.getChallengeURI();

    const poll = await resolvedVoting.getPoll(this.challengeId);
    const requestAppealExpiry = await this.tcrInstance.challengeRequestAppealExpiries.callAsync(this.challengeId);

    let listingAddress = this.listingAddress;
    if (!listingAddress) {
      listingAddress = await this.getListingIdForChallenge();
    }
    const appealInstance = new Appeal(this.ethApi, this.tcrInstance, this.challengeId, listingAddress);
    const appeal = await appealInstance.getAppealData();

    return {
      challengeStatementURI,
      rewardPool,
      challenger,
      resolved,
      stake,
      totalTokens,
      poll,
      requestAppealExpiry,
      appeal,
    };
  }

  public async getListingIdForChallenge(): Promise<EthAddress> {
    const challengeEvent = await this.tcrInstance
      ._ChallengeStream({ challengeID: this.challengeId }, { fromBlock: getDefaultFromBlock() })
      .first()
      .toPromise();
    return challengeEvent.args.listingAddress;
  }

  private async getChallengeURI(): Promise<EthAddress> {
    const challengeEvent = await this.tcrInstance
      ._ChallengeStream({ challengeID: this.challengeId }, { fromBlock: getDefaultFromBlock() })
      .first()
      .toPromise();
    return challengeEvent.args.data;
  }
}
