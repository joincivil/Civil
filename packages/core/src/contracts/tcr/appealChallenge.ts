import { EthApi } from "@joincivil/ethapi";
import { BigNumber } from "@joincivil/typescript-types";
import * as Debug from "debug";
import { AppealChallengeData } from "../../types";
import { CivilTCRContract } from "../generated/wrappers/civil_t_c_r";
import { Voting } from "./voting";
import { getDefaultFromBlock } from "@joincivil/utils";

const debug = Debug("civil:appeal");

export class AppealChallenge {
  private ethApi: EthApi;
  private tcrInstance: CivilTCRContract;
  private challengeId: BigNumber;
  private voting: Promise<Voting>;

  constructor(ethApi: EthApi, instance: CivilTCRContract, challengeId: BigNumber) {
    this.ethApi = ethApi;
    this.tcrInstance = instance;
    this.challengeId = challengeId;
    this.voting = Voting.singleton(ethApi);
  }

  public async getAppealChallengeData(): Promise<AppealChallengeData> {
    const resolvedVoting = await this.voting;
    const [rewardPool, challenger, resolved, stake, totalTokens] = await this.tcrInstance.challenges.callAsync(
      this.challengeId.toString(),
    );
    const poll = await resolvedVoting.getPoll(this.challengeId);
    const appealChallengeStatementURI = await this.getAppealChallengeURI();

    return {
      rewardPool: new BigNumber(rewardPool),
      challenger,
      resolved,
      stake: new BigNumber(stake),
      totalTokens: new BigNumber(totalTokens),
      poll,
      appealChallengeStatementURI,
    };
  }

  private async getAppealChallengeURI(): Promise<string | undefined> {
    const currentBlock = await this.ethApi.getLatestBlockNumber();

    try {
      const appealChallengeMadeEvent = await this.tcrInstance
        ._GrantedAppealChallengedStream(
          { challengeID: this.challengeId },
          { fromBlock: getDefaultFromBlock(await this.ethApi.network()), toBlock: currentBlock },
        )
        .first()
        .toPromise();
      return appealChallengeMadeEvent.returnValues.data;
    } catch (e) {
      debug(`Getting ChallengeAppealURI failed for ChallengeID: ${this.challengeId}`, e);
      return;
    }
  }
}
