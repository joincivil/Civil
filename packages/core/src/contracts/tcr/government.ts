import { EthApi } from "@joincivil/ethapi";
import { CivilErrors, getDefaultFromBlock } from "@joincivil/utils";
import BigNumber from "bignumber.js";
import * as Debug from "debug";
import { Observable } from "rxjs";
import { EthAddress, Param, TwoStepEthTransaction, ParamProposalState } from "../../types";
import { BaseWrapper } from "../basewrapper";
import { GovernmentContract } from "../generated/wrappers/government";
import { Multisig } from "../multisig/multisig";
import { Voting } from "./voting";

const debug = Debug("civil:tcr");

export const enum GovtParameters {
  requestAppealLen = "requestAppealLen",
  judgeAppealLen = "judgeAppealLen",
  appealFee = "appealFee",
  appealVotePercentage = "appealVotePercentage",
  govtPCommitStageLen = "govtPCommitStageLen",
  govtPRevealStageLen = "govtPRevealStageLen",
}

/**
 * The Government contract is where parameters related to appeals are stored and where
 * the controlling entities can update them and update the controlling entities as well
 */
export class Government extends BaseWrapper<GovernmentContract> {
  public static async singleton(ethApi: EthApi, multisigAddress: EthAddress): Promise<Government> {
    const instance = await GovernmentContract.singletonTrusted(ethApi);
    if (!instance) {
      debug("Smart-contract wrapper for Parameterizer returned null, unsupported network");
      throw new Error(CivilErrors.UnsupportedNetwork);
    }
    const multisig = Multisig.atUntrusted(ethApi, multisigAddress);
    return new Government(ethApi, instance, multisig);
  }

  public static async atUntrusted(web3wrapper: EthApi, address: EthAddress): Promise<Government> {
    const instance = GovernmentContract.atUntrusted(web3wrapper, address);
    const appellateAddr = await instance.appellate.callAsync();
    const multisig = Multisig.atUntrusted(web3wrapper, appellateAddr);
    return new Government(web3wrapper, instance, multisig);
  }

  private multisig: Multisig;

  private constructor(ethApi: EthApi, instance: GovernmentContract, multisig: Multisig) {
    super(ethApi, instance);
    this.multisig = multisig;
  }

  /**
   * Returns Voting instance associated with this Government
   */
  public async getVoting(): Promise<Voting> {
    return Voting.atUntrusted(this.ethApi, await this.getVotingAddress());
  }

  /**
   * Get address for voting contract used with this Government
   */
  public async getVotingAddress(): Promise<EthAddress> {
    return this.instance.voting.callAsync();
  }

  /**
   * Gets an unending stream of parameters being set
   */
  public getParameterSet(fromBlock: number | "latest" = getDefaultFromBlock(this.ethApi.network())): Observable<Param> {
    return this.instance._ParameterSetStream({}, { fromBlock }).map(e => {
      return {
        paramName: e.args.name,
        value: e.args.value,
      };
    });
  }

  public async getAppealFee(): Promise<BigNumber> {
    return this.getParameterValue("appealFee");
  }
  /**
   * Gets the current value of the specified parameter
   * @param parameter key of parameter to check
   */
  public async getParameterValue(parameter: string): Promise<BigNumber> {
    return this.instance.get.callAsync(parameter);
  }

  /**
   * Set value of Government Parameter
   * @param paramName name of parameter you intend to change
   * @param newValue value you want parameter to be changed to
   */
  public async set(paramName: GovtParameters | string, newValue: BigNumber): Promise<TwoStepEthTransaction<any>> {
    const txdata = await this.instance.proposeReparameterization.getRaw(paramName, newValue, { gas: 0 });
    return this.multisig.submitTransaction(this.instance.address, this.ethApi.toBigNumber(0), txdata.data!);
  }
  /**
   * Get the URI of the Civil Constitution
   */
  public async getConstitutionURI(): Promise<string> {
    return this.instance.constitutionURI.callAsync();
  }

  /**
   * Get the hash of the Civil Constitution
   */
  public async getConstitutionHash(): Promise<string> {
    return this.instance.constitutionHash.callAsync();
  }

  public async getAppellate(): Promise<EthAddress> {
    return this.instance.getAppellate.callAsync();
  }

  public async getController(): Promise<EthAddress> {
    return this.instance.getGovernmentController.callAsync();
  }

  /**
   * An unending stream of the propIDs of all Reparametization proposals currently in
   * Challenge Commit Phase
   * @param fromBlock Starting block in history for events. Set to "latest" for only new events.
   * @returns currently active proposals in Challenge Commit Phase propIDs
   */
  public propIDsInCommitPhase(
    fromBlock: number | "latest" = getDefaultFromBlock(this.ethApi.network()),
  ): Observable<string> {
    return this.instance
      ._GovtReparameterizationProposalStream({}, { fromBlock })
      .map(e => e.args.propID)
      .concatFilter(async propID => this.isPropInCommitPhase(propID));
  }

  /**
   * An unending stream of the propIDs of all Reparametization proposals currently in
   * Challenge Reveal Phase
   * @param fromBlock Starting block in history for events. Set to "latest" for only new events
   * @returns currently active proposals in Challenge Reveal Phase propIDs
   */
  public propIDsInRevealPhase(
    fromBlock: number | "latest" = getDefaultFromBlock(this.ethApi.network()),
  ): Observable<string> {
    return this.instance
      ._GovtReparameterizationProposalStream({}, { fromBlock })
      .map(e => e.args.propID)
      .concatFilter(async propID => this.isPropInRevealPhase(propID));
  }

  /**
   * An unending stream of the propIDs of all Reparametization proposals that can be
   * processed right now. Includes unchallenged applications that have passed their application
   * expiry time, and proposals with challenges that can be resolved.
   * @param fromBlock Starting block in history for events. Set to "latest" for only new events
   * @returns propIDs for proposals that can be updated
   */
  public propIDsToProcess(
    fromBlock: number | "latest" = getDefaultFromBlock(this.ethApi.network()),
  ): Observable<string> {
    return this.instance
      ._GovtReparameterizationProposalStream({}, { fromBlock })
      .map(e => e.args.propID)
      .concatFilter(async propID => this.isPropInResolvePhase(propID));
  }

  public async getPropState(propID: string): Promise<ParamProposalState> {
    if (!(await this.instance.propExists.callAsync(propID))) {
      return ParamProposalState.NOT_FOUND;
    } else if (await this.isPropInCommitPhase(propID)) {
      return ParamProposalState.CHALLENGED_IN_COMMIT_VOTE_PHASE;
    } else if (await this.isPropInRevealPhase(propID)) {
      return ParamProposalState.CHALLENGED_IN_REVEAL_VOTE_PHASE;
    } else if (await this.isPropInResolvePhase(propID)) {
      return ParamProposalState.READY_TO_RESOLVE_CHALLENGE;
    } else {
      return ParamProposalState.NOT_FOUND;
    }
  }

  /**
   * Returns whether or not a Proposal is in the Challenge Commit Phase
   * @param propID ID of prop to check
   */
  public async isPropInCommitPhase(propID: string): Promise<boolean> {
    if (!(await this.instance.propExists.callAsync(propID))) {
      return false;
    }
    const [challengeID] = await this.instance.proposals.callAsync(propID);
    if (challengeID.isZero()) {
      return false;
    }

    const voting = await this.getVoting();
    return voting.isCommitPeriodActive(challengeID);
  }

  /**
   * Returns whether or not a Proposal is in the Challenge Reveal Phase
   * @param propID ID of prop to check
   */
  public async isPropInRevealPhase(propID: string): Promise<boolean> {
    if (!(await this.instance.propExists.callAsync(propID))) {
      return false;
    }
    const [challengeID] = await this.instance.proposals.callAsync(propID);
    if (challengeID.isZero()) {
      return false;
    }

    const voting = await this.getVoting();
    return voting.isRevealPeriodActive(challengeID);
  }

  /**
   * Returns whether or not a Proposal is in the Challenge Resolve Phase
   * @param propID ID of prop to check
   */
  public async isPropInResolvePhase(propID: string): Promise<boolean> {
    if (!(await this.instance.propExists.callAsync(propID))) {
      return false;
    }
    const [challengeID] = await this.instance.proposals.callAsync(propID);
    if (challengeID.isZero()) {
      return false;
    }

    const voting = await this.getVoting();
    return voting.hasPollEnded(challengeID);
  }

  /**
   * Gets the current ChallengeID of the specified parameter
   * @param parameter key of parameter to check
   */
  public async getChallengeID(parameter: string): Promise<BigNumber> {
    const [challengeID] = await this.instance.proposals.callAsync(parameter);
    return challengeID;
  }

  /**
   *
   * @param propID id of proposal to check
   * @throws {CivilErrors.NoChallenge}
   */
  public async getPropCommitExpiry(propID: string): Promise<Date> {
    const challengeID = await this.getChallengeID(propID);
    if (challengeID.isZero()) {
      throw CivilErrors.NoChallenge;
    }
    const voting = await this.getVoting();
    const poll = await voting.getPoll(challengeID);
    const expiryTimestamp = poll.commitEndDate;
    return new Date(expiryTimestamp.toNumber() * 1000);
  }

  /**
   *
   * @param propID id of proposal to check
   * @throws {CivilErrors.NoChallenge}
   */
  public async getPropRevealExpiry(propID: string): Promise<Date> {
    const challengeID = await this.getChallengeID(propID);
    if (challengeID.isZero()) {
      throw CivilErrors.NoChallenge;
    }
    const voting = await this.getVoting();
    const poll = await voting.getPoll(challengeID);
    const expiryTimestamp = poll.revealEndDate;
    return new Date(expiryTimestamp.toNumber() * 1000);
  }

  /**
   * Returns the date by which a proposal must be processed. Successful proposals must
   * be processed within a certain timeframe, to avoid gaming the parameterizer.
   * @param propID ID of prop to check
   */
  public async getPropProcessBy(propID: string): Promise<Date> {
    const [, , expiryTimestamp] = await this.instance.proposals.callAsync(propID);
    return new Date(expiryTimestamp.toNumber() * 1000);
  }

  /**
   * Returns the name of the paramater associated with the given proposal
   * @param propID ID of prop to check
   */
  public async getPropName(propID: string): Promise<string> {
    const [, name] = await this.instance.proposals.callAsync(propID);
    return name;
  }

  /**
   * Returns the value proposed associated with the given proposal
   * @param propID ID of prop to check
   */
  public async getPropValue(propID: string): Promise<BigNumber> {
    const [, , , value] = await this.instance.proposals.callAsync(propID);
    return value;
  }
}
