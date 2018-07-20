import { EthApi } from "@joincivil/ethapi";
import "@joincivil/utils";
import BigNumber from "bignumber.js";
import * as Debug from "debug";
import { ContentProvider } from "../../content/contentprovider";
import { ChallengeData, ContentData, EthAddress } from "../../types";
import { CivilTCRContract } from "../generated/wrappers/civil_t_c_r";
import { Appeal } from "./appeal";
import { Voting } from "./voting";

const debug = Debug("civil:challenge");

export class Challenge {
  private ethApi: EthApi;
  private tcrInstance: CivilTCRContract;
  private contentProvider: ContentProvider;
  private challengeId: BigNumber;
  private voting: Promise<Voting>;

  constructor(ethApi: EthApi, instance: CivilTCRContract, contentProvider: ContentProvider, challengeId: BigNumber) {
    this.ethApi = ethApi;
    this.tcrInstance = instance;
    this.contentProvider = contentProvider;
    this.challengeId = challengeId;
    this.voting = Voting.singleton(ethApi);
  }

  public async getChallengeData(): Promise<ChallengeData> {
    const resolvedVoting = await this.voting;
    const [rewardPool, challenger, resolved, stake, totalTokens] = await this.tcrInstance.challenges.callAsync(
      this.challengeId,
    );
    const statement = await this.getChallengeStatement();

    const poll = await resolvedVoting.getPoll(this.challengeId);
    const requestAppealExpiry = await this.tcrInstance.challengeRequestAppealExpiries.callAsync(this.challengeId);

    const appealInstance = new Appeal(this.ethApi, this.tcrInstance, this.challengeId);
    const appeal = await appealInstance.getAppealData();

    return {
      statement,
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

  public async getListingIdForChallenge(): Promise<EthAddress> {
    const challengeEvent = await this.tcrInstance
      ._ChallengeStream({ challengeID: this.challengeId }, { fromBlock: 0 })
      .first()
      .toPromise();
    return challengeEvent.args.listingAddress;
  }

  private async getChallengeURI(): Promise<EthAddress> {
    const challengeEvent = await this.tcrInstance
      ._ChallengeStream({ challengeID: this.challengeId }, { fromBlock: 0 })
      .first()
      .toPromise();
    return challengeEvent.args.data;
  }

  private async getChallengeStatement(): Promise<ContentData | undefined> {
    const uri = await this.getChallengeURI();
    if (uri) {
      try {
        const challengeStatement = await this.contentProvider.get({ uri, contentHash: "" });
        return challengeStatement;
      } catch (e) {
        debug(`Getting Challenge Statement failed for ChallengeID: ${this.challengeId}`, e);
        return;
      }
    }
  }
}
