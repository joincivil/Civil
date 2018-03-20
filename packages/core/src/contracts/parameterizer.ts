import BigNumber from "bignumber.js";
import { Observable } from "rxjs";
import "rxjs/add/operator/distinctUntilChanged";
import "@joincivil/utils";

import { Bytes32, EthAddress, TwoStepEthTransaction } from "../types";
import { requireAccount } from "../utils/errors";
import { Web3Wrapper } from "../utils/web3wrapper";
import { BaseWrapper } from "./basewrapper";
import { ParameterizerContract } from "./generated/parameterizer";
import { createTwoStepSimple } from "../utils/contractutils";

export enum Parameters {
  minDeposit = "minDepost",
  pMinDeposit = "pMinDeposit",
  applyStageLen = "applyStageLen",
  pApplyStageLen = "pApplyStageLen",
  commitStageLen = "commitStageLen",
  pCommitStageLen = "pCommitStageLen",
  revealStageLen = "revealStageLen",
  pRevealStageLen = "pRevealStageLen",
  dispensationPct = "dispensationPct",
  pDispensationPct = "pDispensationPct",
  voteQuorum = "voteQuorum",
  pVoteQuorum = "pVoteQuorum",
}

/**
 * The Parameterizer is where we store and update values associated with "parameters", variables
 * needed for logic of the Registry.
 * Users can propose new values for parameters, as well as challenge and then vote on those proposals
 */
export class Parameterizer extends BaseWrapper<ParameterizerContract> {
  public static atUntrusted(web3wrapper: Web3Wrapper, address: EthAddress): Parameterizer {
    const instance = ParameterizerContract.atUntrusted(web3wrapper, address);
    return new Parameterizer(web3wrapper, instance);
  }

  private constructor(web3Wrapper: Web3Wrapper, instance: ParameterizerContract) {
    super(web3Wrapper, instance);
  }

  /**
   * Event Streams
   */

  /**
   * An unending stream of all active Reparametizations proposed
   * @param fromBlock Starting block in history for events concerning reparametizations
   *                  Set to "latest" for only new events
   * @returns currently active proposals
   */
  public reparameterizationProposals(fromBlock: number|"latest" = 0): Observable<EthAddress> {
    return this.instance
      .ReparameterizationProposalStream({}, { fromBlock })
      .distinctUntilChanged((a, b) => {
        return a.blockNumber === b.blockNumber && a.logIndex === b.logIndex;
      })
      .map((e) => e.args.propID)
      .concatFilter(async (propID) => this.instance.propExists.callAsync(propID));
  }

  /**
   * An unending stream of all active Reparametization challenges
   * @param fromBlock Starting block in history for events concerning challenges
   *                  Set to "latest" for only new events
   * @returns currently active challenges
   */
  public reparameterizationChallenges(fromBlock: number|"latest" = 0): Observable<EthAddress> {
    return this.instance
      .NewChallengeStream({}, { fromBlock })
      .distinctUntilChanged((a, b) => {
        return a.blockNumber === b.blockNumber && a.logIndex === b.logIndex;
      })
      .map((e) => e.args.propID)
      .concatFilter(async (propID) => this.instance.propExists.callAsync(propID));
  }

  /**
   * Contract Transactions
   */

  /**
   * Propose a "reparameterization" (change the value of a parameter)
   * @param paramName name of parameter you intend to change
   * @param newValue value you want parameter to be changed to
   */
  public async proposeReparameterization(
    paramName: Parameters,
    newValue: BigNumber,
  ): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(
      this.web3Wrapper,
      await this.instance.proposeReparameterization.sendTransactionAsync(paramName, newValue),
    );
  }

  /**
   * Challenge a "reparameterization"
   * @param propID the ID of the proposed reparameterization you wish to challenge
   */
  public async challengeReparameterization(
    propID: Bytes32,
  ): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(
      this.web3Wrapper,
      await this.instance.challengeReparameterization.sendTransactionAsync(propID),
    );
  }

  /**
   * Update state of proposal. Changes value of parameter if proposal passes without
   * challenge or wins challenge. Deletes it if it loses. Distributes tokens correctly.
   * @param propID the ID of the proposed reparameterization to process
   */
  public async processProposal(
    propID: Bytes32,
  ): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(
      this.web3Wrapper,
      await this.instance.processProposal.sendTransactionAsync(propID),
    );
  }

  /**
   * Contract Getters
   */

   /**
    * Gets reward for voter
    * @param challengeID ID of challenge to check
    * @param salt Salt of vote associated with voter for specified challenge
    * @param voter Voter of which to check reward
    */
  public async voterReward(challengeID: BigNumber, salt: BigNumber, voter?: EthAddress): Promise<BigNumber> {
    let who = voter;
    if (!who) {
      who = requireAccount(this.web3Wrapper);
    }
    return this.instance.voterReward.callAsync(who, challengeID, salt);
  }

  /**
   * Gets the current value of the specified parameter
   * @param parameter key of parameter to check
   */
  public async getParameterValue(parameter: string): Promise<BigNumber> {
    return this.instance.get.callAsync(parameter);
  }
}
