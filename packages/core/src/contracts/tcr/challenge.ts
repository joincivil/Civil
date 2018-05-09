import BigNumber from "bignumber.js";
import "@joincivil/utils";

import { Voting } from "./voting";
import { CivilTCRContract } from "../generated/wrappers/civil_t_c_r";
import { Web3Wrapper } from "../../utils/web3wrapper";
import { ChallengeData } from "../../types";
import { Appeal } from "./appeal";

export class Challenge {
  private web3Wrapper: Web3Wrapper;
  private tcrInstance: CivilTCRContract;
  private challengeId: BigNumber;
  private voting: Voting;

  constructor(web3Wrapper: Web3Wrapper, instance: CivilTCRContract, challengeId: BigNumber) {
    this.web3Wrapper = web3Wrapper;
    this.tcrInstance = instance;
    this.challengeId = challengeId;
    this.voting = Voting.singleton(web3Wrapper);
  }

  public async getChallengeData(): Promise<ChallengeData> {
    const [rewardPool, challenger, resolved, stake, totalTokens] = await this.tcrInstance.challenges.callAsync(
      this.challengeId,
    );
    const poll = await this.voting.getPoll(this.challengeId);
    const requestAppealExpiry = await this.tcrInstance.challengeRequestAppealExpiries.callAsync(this.challengeId);

    const appealInstance = new Appeal(this.web3Wrapper, this.tcrInstance, this.challengeId);
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
