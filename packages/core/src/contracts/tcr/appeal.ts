import BigNumber from "bignumber.js";
import "@joincivil/utils";
import { CivilTCRContract } from "../generated/wrappers/civil_t_c_r";
import { Web3Wrapper } from "../../utils/web3wrapper";
import { AppealData } from "../../types";
import { AppealChallenge } from "./appealChallenge";

export class Appeal {
  private web3Wrapper: Web3Wrapper;
  private tcrInstance: CivilTCRContract;
  private challengeId: BigNumber;

  constructor(web3Wrapper: Web3Wrapper, instance: CivilTCRContract, challengeId: BigNumber) {
    this.web3Wrapper = web3Wrapper;
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
      const appealChallengeInstance = new AppealChallenge(this.web3Wrapper, this.tcrInstance, this.challengeId);
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
