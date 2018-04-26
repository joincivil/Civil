import "@joincivil/utils";
import BigNumber from "bignumber.js";
import { Voting } from "./voting";
import { CivilTCRContract } from "../generated/wrappers/civil_t_c_r";
import { Web3Wrapper } from "../../utils/web3wrapper";
import { AppealChallengeData } from "../../types";

export class AppealChallenge {
  private tcrInstance: CivilTCRContract;
  private challengeId: BigNumber;
  private voting: Voting;

  constructor(web3Wrapper: Web3Wrapper, instance: CivilTCRContract, challengeId: BigNumber) {
    this.tcrInstance = instance;
    this.challengeId = challengeId;
    this.voting = Voting.singleton(web3Wrapper);
  }

  public async getAppealChallengeData(): Promise<AppealChallengeData> {
    const [rewardPool, challenger, resolved, stake, totalTokens] = await this.tcrInstance.appealChallenges.callAsync(
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
