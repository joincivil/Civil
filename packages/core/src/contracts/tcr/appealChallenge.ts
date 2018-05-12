import "@joincivil/utils";
import BigNumber from "bignumber.js";
import { Voting } from "./voting";
import { CivilTCRContract } from "../generated/wrappers/civil_t_c_r";
import { EthApi } from "../../utils/ethapi";
import { AppealChallengeData } from "../../types";

export class AppealChallenge {
  private tcrInstance: CivilTCRContract;
  private challengeId: BigNumber;
  private voting: Voting;

  constructor(ethApi: EthApi, instance: CivilTCRContract, challengeId: BigNumber) {
    this.tcrInstance = instance;
    this.challengeId = challengeId;
    this.voting = Voting.singleton(ethApi);
  }

  public async getAppealChallengeData(): Promise<AppealChallengeData> {
    const [rewardPool, challenger, resolved, stake, totalTokens] = await this.tcrInstance.challenges.callAsync(
      this.challengeId,
    );
    const poll = await this.voting.getPoll(this.challengeId);

    return {
      rewardPool,
      challenger,
      resolved,
      stake,
      totalTokens,
      poll,
    };
  }
}
