import { EthApi } from "@joincivil/ethapi";
import { getDefaultFromBlock } from "@joincivil/utils";
import { BigNumber, ChallengeData, EthAddress } from "@joincivil/typescript-types";
import { CivilTCRContract } from "../generated/wrappers/civil_t_c_r";
import { Appeal } from "./appeal";
import { Voting } from "./voting";

export class Challenge {
  private ethApi: EthApi;
  private tcrInstance: CivilTCRContract;
  private challengeId: BigNumber;
  private voting: Promise<Voting>;
  private listingAddress?: EthAddress;

  constructor(ethApi: EthApi, instance: CivilTCRContract, challengeId: BigNumber, listingAddress?: EthAddress) {
    this.ethApi = ethApi;
    this.tcrInstance = instance;
    this.challengeId = challengeId;
    this.listingAddress = listingAddress;
    this.voting = Voting.singleton(ethApi);
  }

  public async getChallengeData(): Promise<ChallengeData> {
    const resolvedVoting = await this.voting;
    const [rewardPool, challenger, resolved, stake, totalTokens] = await this.tcrInstance.challenges.callAsync(
      this.challengeId.toString(),
    );
    const challengeStatementURI = await this.getChallengeURI();

    const poll = await resolvedVoting.getPoll(this.challengeId);
    const requestAppealExpiry = await this.tcrInstance.challengeRequestAppealExpiries.callAsync(
      this.challengeId.toString(),
    );

    let listingAddress = this.listingAddress;
    if (!listingAddress) {
      listingAddress = await this.getListingIdForChallenge();
    }
    const appealInstance = new Appeal(this.ethApi, this.tcrInstance, this.challengeId);
    const appeal = await appealInstance.getAppealData();

    return {
      challengeStatementURI,
      rewardPool: new BigNumber(rewardPool),
      challenger,
      resolved,
      stake: new BigNumber(stake),
      totalTokens: new BigNumber(totalTokens),
      poll,
      requestAppealExpiry: new BigNumber(requestAppealExpiry),
      appeal,
    };
  }

  public async getListingIdForChallenge(): Promise<EthAddress> {
    const challengeEvent = await this.tcrInstance
      ._ChallengeStream(
        { challengeID: this.challengeId },
        { fromBlock: getDefaultFromBlock(await this.ethApi.network()) },
      )
      .first()
      .toPromise();
    return challengeEvent.returnValues.listingAddress;
  }

  private async getChallengeURI(): Promise<EthAddress> {
    const challengeEvent = await this.tcrInstance
      ._ChallengeStream(
        { challengeID: this.challengeId },
        { fromBlock: getDefaultFromBlock(await this.ethApi.network()) },
      )
      .first()
      .toPromise();
    return challengeEvent.returnValues.data;
  }
}
