import { BigNumber, AppealData } from "@joincivil/typescript-types";
import * as Debug from "debug";
import { EthApi } from "@joincivil/ethapi";
import { getDefaultFromBlock } from "@joincivil/utils";
import { CivilTCRContract } from "../generated/wrappers/civil_t_c_r";
import { AppealChallenge } from "./appealChallenge";

const debug = Debug("civil:appeal");

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
    ] = await this.tcrInstance.appeals.callAsync(this.challengeId.toString());
    let appealChallenge;
    if (!new BigNumber(appealChallengeID).isZero()) {
      const appealChallengeInstance = new AppealChallenge(
        this.ethApi,
        this.tcrInstance,
        new BigNumber(appealChallengeID),
      );
      appealChallenge = await appealChallengeInstance.getAppealChallengeData();
    }
    let appealStatementURI;
    if (!new BigNumber(appealPhaseExpiry).isZero()) {
      appealStatementURI = await this.getAppealURI();
    }
    let appealGrantedStatementURI;
    if (appealGranted) {
      appealGrantedStatementURI = await this.getAppealGrantedURI();
    }
    return {
      requester,
      appealFeePaid: new BigNumber(appealFeePaid),
      appealPhaseExpiry: new BigNumber(appealPhaseExpiry),
      appealGranted,
      appealOpenToChallengeExpiry: new BigNumber(appealOpenToChallengeExpiry),
      appealChallengeID: new BigNumber(appealChallengeID),
      appealChallenge,
      appealStatementURI,
      appealGrantedStatementURI,
    };
  }

  private async getAppealURI(): Promise<string | undefined> {
    const currentBlock = await this.ethApi.getLatestBlockNumber();

    try {
      const appealRequestedEvent = await this.tcrInstance
        ._AppealRequestedStream(
          { challengeID: this.challengeId },
          { fromBlock: getDefaultFromBlock(await this.ethApi.network()), toBlock: currentBlock },
        )
        .first()
        .toPromise();
      return appealRequestedEvent.returnValues.data;
    } catch (e) {
      debug(`Getting AppealURI failed for ChallengeID: ${this.challengeId}`, e);
      return;
    }
  }

  private async getAppealGrantedURI(): Promise<string | undefined> {
    const currentBlock = await this.ethApi.getLatestBlockNumber();

    try {
      const appealGrantedEvent = await this.tcrInstance
        ._AppealGrantedStream(
          { challengeID: this.challengeId },
          { fromBlock: getDefaultFromBlock(await this.ethApi.network()), toBlock: currentBlock },
        )
        .first()
        .toPromise();
      return appealGrantedEvent.returnValues.data;
    } catch (e) {
      debug(`Getting GrantedAppealURI failed for ChallengeID: ${this.challengeId}`, e);
      return;
    }
  }
}
