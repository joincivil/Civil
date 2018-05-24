import BigNumber from "bignumber.js";
import "@joincivil/utils";

import { Observable } from "rxjs";
import { Voting } from "./voting";
import { CivilTCRContract } from "../generated/wrappers/civil_t_c_r";
import { EthApi } from "../../utils/ethapi";
import { ChallengeData, EthAddress } from "../../types";
import { Appeal } from "./appeal";

export class Challenge {
  private ethApi: EthApi;
  private tcrInstance: CivilTCRContract;
  private challengeId: BigNumber;
  private voting: Voting;

  constructor(ethApi: EthApi, instance: CivilTCRContract, challengeId: BigNumber) {
    this.ethApi = ethApi;
    this.tcrInstance = instance;
    this.challengeId = challengeId;
    this.voting = Voting.singleton(ethApi);
  }

  public async getChallengeData(user?: EthAddress): Promise<ChallengeData> {
    const [rewardPool, challenger, resolved, stake, totalTokens] = await this.tcrInstance.challenges.callAsync(
      this.challengeId,
    );
    const poll = await this.voting.getPoll(this.challengeId);
    const requestAppealExpiry = await this.tcrInstance.challengeRequestAppealExpiries.callAsync(this.challengeId);

    const appealInstance = new Appeal(this.ethApi, this.tcrInstance, this.challengeId);
    const appeal = await appealInstance.getAppealData();

    let didUserCommit;
    let didUserReveal;
    let didUserCollect;
    let didUserRescue;
    if (user) {
      didUserCommit = await this.voting.didCommitVote(user, this.challengeId);
      if (didUserCommit) {
        didUserReveal = await this.voting.didRevealVote(user, this.challengeId);
        if (resolved) {
          if (didUserReveal) {
            didUserCollect = await this.tcrInstance.hasClaimedTokens.callAsync(this.challengeId, user);
          } else {
            didUserRescue = !(await this.voting.canRescueTokens(user, this.challengeId));
          }
        }
      }
    }

    return {
      rewardPool,
      challenger,
      resolved,
      stake,
      totalTokens,
      poll,
      requestAppealExpiry,
      appeal,
      didUserCommit,
      didUserReveal,
      didUserCollect,
      didUserRescue,
    };
  }

  public async getListingIdForChallenge(): Promise<EthAddress> {
    return new Promise<EthAddress>((res, rej) => {
      this.tcrInstance._ChallengeStream({ challengeID: this.challengeId }, { fromBlock: 0 }).subscribe(e => {
        // TODO: remove this check when indexed event is in
        if (e.args.challengeID.equals(this.challengeId)) {
          res(e.args.listingAddress);
        }
      });
    });
  }
}
