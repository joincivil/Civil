import BigNumber from "bignumber.js";
import * as Debug from "debug";
import { EthApi } from "@joincivil/ethapi";
import { getDefaultFromBlock } from "@joincivil/utils";
import { CivilTCRContract } from "../generated/wrappers/civil_t_c_r";
import { ContentProvider } from "../../content/contentprovider";
import { AppealData, ContentData, EthAddress } from "../../types";
import { AppealChallenge } from "./appealChallenge";

const debug = Debug("civil:appeal");

export class Appeal {
  private ethApi: EthApi;
  private tcrInstance: CivilTCRContract;
  private contentProvider: ContentProvider;
  private challengeId: BigNumber;

  constructor(ethApi: EthApi, instance: CivilTCRContract, challengeId: BigNumber, contentProvider: ContentProvider) {
    this.ethApi = ethApi;
    this.tcrInstance = instance;
    this.challengeId = challengeId;
    this.contentProvider = contentProvider;
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
    const statement = await this.getAppealStatement();
    return {
      requester,
      appealFeePaid,
      appealPhaseExpiry,
      appealGranted,
      appealOpenToChallengeExpiry,
      appealChallengeID,
      appealChallenge,
      statement,
    };
  }

  private async getAppealURI(): Promise<EthAddress | undefined> {
    const currentBlock = await this.ethApi.getLatestBlockNumber();

    try {
      const appealRequestedEvent = await this.tcrInstance
        ._AppealRequestedStream(
          { challengeID: this.challengeId },
          { fromBlock: getDefaultFromBlock(), toBlock: currentBlock },
        )
        .first()
        .toPromise();
      return appealRequestedEvent.args.data;
    } catch (e) {
      debug(`Getting AppealURI failed for ChallengeID: ${this.challengeId}`, e);
      return;
    }
  }

  private async getAppealStatement(): Promise<ContentData | undefined> {
    const uri = await this.getAppealURI();
    if (!uri) {
      return;
    }
    try {
      const appealStatement = await this.contentProvider.get({ uri, contentHash: "" });
      return appealStatement;
    } catch (e) {
      debug(`Getting Appeal Statement failed for ChallengeID: ${this.challengeId}`, e);
      return;
    }
  }
}
