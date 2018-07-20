import { EthApi } from "@joincivil/ethapi";
import BigNumber from "bignumber.js";
import { AppealChallengeData } from "../../types";
import { CivilTCRContract } from "../generated/wrappers/civil_t_c_r";
import { Voting } from "./voting";

export class AppealChallenge {
  private tcrInstance: CivilTCRContract;
  private challengeId: BigNumber;
  private voting: Promise<Voting>;

  constructor(ethApi: EthApi, instance: CivilTCRContract, challengeId: BigNumber) {
    this.tcrInstance = instance;
    this.challengeId = challengeId;
    this.voting = Voting.singleton(ethApi);
  }

  public async getAppealChallengeData(): Promise<AppealChallengeData> {
    const resolvedVoting = await this.voting;
    const [rewardPool, challenger, resolved, stake, totalTokens] = await this.tcrInstance.challenges.callAsync(
      this.challengeId,
    );
    const poll = await resolvedVoting.getPoll(this.challengeId);

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
