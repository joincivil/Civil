import BigNumber from "bignumber.js";
import "@joincivil/utils";
import { CivilTCRContract } from "../generated/wrappers/civil_t_c_r";
import { EthApi } from "../../utils/ethapi";
import { AppealData } from "../../types";
import { AppealChallenge } from "./appealChallenge";

export class Appeal {
  private ethApi: EthApi;
  private tcrInstance: CivilTCRContract;
  private challengeId: BigNumber;

  constructor(ethApi: EthApi, instance: CivilTCRContract, challengeId: BigNumber) {
    this.ethApi = ethApi;
    this.tcrInstance = instance;
    this.challengeId = challengeId;
  }

  public async getAppealData(): Promise<AppealData> {
    const [
      requester,
      appealFeePaid,
      appealPhaseExpiry,
      appealGranted,
      appealOpenToChallengeExpiry,
      appealChallengeID,
    ] = await this.tcrInstance.appeals.callAsync(this.challengeId);
    let appealChallenge;
    if (!appealChallengeID.isZero()) {
      const appealChallengeInstance = new AppealChallenge(this.ethApi, this.tcrInstance, this.challengeId);
      appealChallenge = await appealChallengeInstance.getAppealChallengeData();
    }
    return {
      requester,
      appealFeePaid,
      appealPhaseExpiry,
      appealGranted,
      appealOpenToChallengeExpiry,
      appealChallengeID,
      appealChallenge,
    };
  }
}
