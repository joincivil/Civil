import BigNumber from "bignumber.js";
import * as Debug from "debug";
import { EthApi } from "@joincivil/ethapi";
import { getDefaultFromBlock } from "@joincivil/utils";
import { CivilTCRContract } from "../generated/wrappers/civil_t_c_r";
import { AppealData } from "../../types";
import { AppealChallenge } from "./appealChallenge";
import { EthAddress } from "@joincivil/typescript-types";

const debug = Debug("civil:appeal");

export class Appeal {
  private ethApi: EthApi;
  private tcrInstance: CivilTCRContract;
  private challengeId: BigNumber;
  private listingAddress: EthAddress;

  constructor(ethApi: EthApi, instance: CivilTCRContract, challengeId: BigNumber, listingAddress: EthAddress) {
    this.ethApi = ethApi;
    this.tcrInstance = instance;
    this.challengeId = challengeId;
    this.listingAddress = listingAddress;
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
      const appealChallengeInstance = new AppealChallenge(this.ethApi, this.tcrInstance, appealChallengeID);
      appealChallenge = await appealChallengeInstance.getAppealChallengeData();
    }
    let appealStatementURI;
    if (!appealPhaseExpiry.isZero()) {
      appealStatementURI = await this.getAppealURI();
    }
    const appealTxData = await this.tcrInstance.grantAppeal.getRaw(this.listingAddress, "", { gas: 0 });
    return {
      requester,
      appealFeePaid,
      appealPhaseExpiry,
      appealGranted,
      appealOpenToChallengeExpiry,
      appealChallengeID,
      appealTxData,
      appealChallenge,
      appealStatementURI,
    };
  }

  private async getAppealURI(): Promise<string | undefined> {
    const currentBlock = await this.ethApi.getLatestBlockNumber();

    try {
      const appealRequestedEvent = await this.tcrInstance
        ._AppealRequestedStream(
          { challengeID: this.challengeId },
          { fromBlock: getDefaultFromBlock(this.ethApi.network()), toBlock: currentBlock },
        )
        .first()
        .toPromise();
      return appealRequestedEvent.args.data;
    } catch (e) {
      debug(`Getting AppealURI failed for ChallengeID: ${this.challengeId}`, e);
      return;
    }
  }
}
