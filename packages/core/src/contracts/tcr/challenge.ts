import BigNumber from "bignumber.js";
import "@joincivil/utils";

import { Voting } from "./voting";
import { CivilTCRContract } from "../generated/wrappers/civil_t_c_r";
import { EthApi } from "../../utils/ethapi";
import { ChallengeData } from "../../types";
import { Appeal } from "./appeal";

export class Challenge {
  private ethApi: EthApi;
  private tcrInstance: CivilTCRContract;
  private challengeId: BigNumber;
  private voting: Voting;

  constructor(ethApi: EthApi, instance: CivilTCRContract, challengeId: BigNumber) {
    this.ethApi = ethApi;
    this.tcrInstance = instance;
    this.challengeId = challengeId;
    this.voting = Voting.singleton(ethApi);
  }

  public async getChallengeData(): Promise<ChallengeData> {
    const [rewardPool, challenger, resolved, stake, totalTokens] = await this.tcrInstance.challenges.callAsync(
      this.challengeId,
    );
    const poll = await this.voting.getPoll(this.challengeId);
    const requestAppealExpiry = await this.tcrInstance.challengeRequestAppealExpiries.callAsync(this.challengeId);

    const appealInstance = new Appeal(this.ethApi, this.tcrInstance, this.challengeId);
    const appeal = await appealInstance.getAppealData();

    return {
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
}
