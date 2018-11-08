import { EthApi } from "@joincivil/ethapi";
import { getDefaultFromBlock } from "@joincivil/utils";
import BigNumber from "bignumber.js";
import * as Debug from "debug";
import { ContentProvider } from "../../content/contentprovider";
import { ChallengeData, ContentData, EthAddress, EthContentHeader } from "../../types";
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
  private listingAddress?: EthAddress;

  constructor(
    ethApi: EthApi,
    instance: CivilTCRContract,
    contentProvider: ContentProvider,
    challengeId: BigNumber,
    listingAddress?: EthAddress,
  ) {
    this.ethApi = ethApi;
    this.tcrInstance = instance;
    this.contentProvider = contentProvider;
    this.challengeId = challengeId;
    this.listingAddress = listingAddress;
    this.voting = Voting.singleton(ethApi);
  }

  public async getChallengeData(): Promise<ChallengeData> {
    const resolvedVoting = await this.voting;
    const [rewardPool, challenger, resolved, stake, totalTokens] = await this.tcrInstance.challenges.callAsync(
      this.challengeId,
    );
    const challengeStatementURI = await this.getChallengeStatementURI();

    const poll = await resolvedVoting.getPoll(this.challengeId);
    const requestAppealExpiry = await this.tcrInstance.challengeRequestAppealExpiries.callAsync(this.challengeId);

    let listingAddress = this.listingAddress;
    if (!listingAddress) {
      listingAddress = await this.getListingIdForChallenge();
    }
    const appealInstance = new Appeal(
      this.ethApi,
      this.tcrInstance,
      this.challengeId,
      listingAddress,
      this.contentProvider,
    );
    const appeal = await appealInstance.getAppealData();

    return {
      challengeStatementURI,
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
      ._ChallengeStream({ challengeID: this.challengeId }, { fromBlock: getDefaultFromBlock() })
      .first()
      .toPromise();
    return challengeEvent.args.listingAddress;
  }

  private async getChallengeURI(): Promise<EthAddress> {
    const challengeEvent = await this.tcrInstance
      ._ChallengeStream({ challengeID: this.challengeId }, { fromBlock: getDefaultFromBlock() })
      .first()
      .toPromise();
    return challengeEvent.args.data;
  }

  private async getChallengeStatementURI(): Promise<string | undefined> {
    const uri = await this.getChallengeURI();
    return uri;
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
