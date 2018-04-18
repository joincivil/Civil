import BigNumber from "bignumber.js";
import { Observable } from "rxjs";
import * as Debug from "debug";
import "@joincivil/utils";

import { Bytes32, EthAddress, TwoStepEthTransaction, ParamProposalState, ParamProp, PollID } from "../../types";
import { requireAccount, CivilErrors } from "../../utils/errors";
import { Web3Wrapper } from "../../utils/web3wrapper";
import { BaseWrapper } from "../basewrapper";
import { ParameterizerContract } from "../generated/parameterizer";
import { createTwoStepSimple } from "../utils/contracts";
import { Voting } from "./voting";

const debug = Debug("civil:tcr");

export const enum Parameters {
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
  public static singleton(web3Wrapper: Web3Wrapper): Parameterizer {
    const instance = ParameterizerContract.singletonTrusted(web3Wrapper);
    if (!instance) {
      debug("Smart-contract wrapper for Parameterizer returned null, unsupported network");
      throw new Error(CivilErrors.UnsupportedNetwork);
    }
    return new Parameterizer(web3Wrapper, instance);
  }

  public static atUntrusted(web3wrapper: Web3Wrapper, address: EthAddress): Parameterizer {
    const instance = ParameterizerContract.atUntrusted(web3wrapper, address);
    return new Parameterizer(web3wrapper, instance);
  }

  private constructor(web3Wrapper: Web3Wrapper, instance: ParameterizerContract) {
    super(web3Wrapper, instance);
  }

  /**
   * Returns Voting instance associated with this TCR
   */
  public async getVoting(): Promise<Voting> {
    return Voting.atUntrusted(this.web3Wrapper, await this.getVotingAddress());
  }

  /**
   * Get address for voting contract used with this TCR
   */
  public async getVotingAddress(): Promise<EthAddress> {
    return this.instance.voting.callAsync();
  }

  public async getPropState(propID: string): Promise<ParamProposalState> {
    if (!await this.instance.propExists.callAsync(propID)) {
      return ParamProposalState.NOT_FOUND;
    } else if (await this.isPropInUnchallengedApplicationPhase(propID)) {
      return ParamProposalState.APPLYING;
    } else if (await this.isPropInUnchallengedApplicationUpdatePhase(propID)) {
      return ParamProposalState.READY_TO_PROCESS;
    } else if (await this.isPropInChallengeCommitPhase(propID)) {
      return ParamProposalState.CHALLENGED_IN_COMMIT_VOTE_PHASE;
    } else if (await this.isPropInChallengeRevealPhase(propID)) {
      return ParamProposalState.CHALLENGED_IN_REVEAL_VOTE_PHASE;
    } else if (await this.isPropInChallengeResolvePhase(propID)) {
      return ParamProposalState.READY_TO_RESOLVE_CHALLENGE;
    } else {
      return ParamProposalState.NOT_FOUND;
    }
  }

  /**
   * Event Streams
   */

  /**
   * An unending stream of the propIDs of all active Parameterizer proposals
   * @param fromBlock Starting block in history for events. Set to "latest" for only new events.
   * @returns currently active proposals propIDs
   */
  public propIDsInApplicationPhase(fromBlock: number | "latest" = 0): Observable<EthAddress> {
    return this.instance
      .ReparameterizationProposalStream({}, { fromBlock })
      .map(e => e.args.propID)
      .concatFilter(async propID => this.isPropInUnchallengedApplicationPhase(propID));
  }

  /**
   * An unending stream of ParamProps of all active Reparametizations proposed
   * @param fromBlock Starting block in history for events. Set to "latest" for only new events.
   * @returns currently active proposals ParamProps
   */
  public paramPropsInApplicationPhase(fromBlock: number | "latest" = 0): Observable<ParamProp> {
    return this.instance
      .ReparameterizationProposalStream({}, { fromBlock })
      .map(e => {
        return {
          propID: e.args.propID,
          paramName: e.args.name,
          proposedValue: e.args.value,
        };
      })
      .concatFilter(async args => this.isPropInUnchallengedApplicationPhase(args.propID));
  }

  /**
   * An unending stream of the propIDs of all Reparametization proposals currently in
   * Challenge Commit Phase
   * @param fromBlock Starting block in history for events. Set to "latest" for only new events.
   * @returns currently active proposals in Challenge Commit Phase propIDs
   */
  public propIDsInChallengeCommitPhase(fromBlock: number | "latest" = 0): Observable<EthAddress> {
    return this.instance
      .NewChallengeStream({}, { fromBlock })
      .map(e => e.args.propID)
      .concatFilter(async propID => this.isPropInChallengeCommitPhase(propID));
  }

  /**
   * An unending stream of ParamProps of all active Reparametizations Proposals in
   * Challenge Commit Phase
   * @param fromBlock Starting block in history for events. Set to "latest" for only new events.
   * @returns ParamProps for proposals currently in Challenge Commit Phase
   */
  public paramPropsInChallengeCommitPhase(fromBlock: number | "latest" = 0): Observable<ParamProp> {
    return this.instance
      .NewChallengeStream({}, { fromBlock })
      .concatFilter(async e => this.isPropInChallengeCommitPhase(e.args.propID))
      .map(e => {
        return {
          propID: e.args.propID,
          paramName: e.args.name,
          proposedValue: e.args.value,
        };
      });
  }

  /**
   * An unending stream of the propIDs of all Reparametization proposals currently in
   * Challenge Reveal Phase
   * @param fromBlock Starting block in history for events. Set to "latest" for only new events
   * @returns currently active proposals in Challenge Reveal Phase propIDs
   */
  public propIDsInChallengeRevealPhase(fromBlock: number | "latest" = 0): Observable<EthAddress> {
    return this.instance
      .NewChallengeStream({}, { fromBlock })
      .map(e => e.args.propID)
      .concatFilter(async propID => this.isPropInChallengeRevealPhase(propID));
  }

  /**
   * An unending stream of ParamProps of all active Reparametizations Proposals in
   * Challenge Reveal Phase
   * @param fromBlock Starting block in history for events. Set to "latest" for only new events.
   * @returns ParamProps for proposals currently in Challenge Reveal Phase
   */
  public paramPropsInChallengeRevealPhase(fromBlock: number | "latest" = 0): Observable<ParamProp> {
    return this.instance
      .NewChallengeStream({}, { fromBlock })
      .concatFilter(async e => this.isPropInChallengeRevealPhase(e.args.propID))
      .map(e => {
        return {
          propID: e.args.propID,
          paramName: e.args.name,
          proposedValue: e.args.value,
        };
      });
  }

  /**
   * An unending stream of the propIDs of all Reparametization proposals that can be
   * processed right now. Includes unchallenged applications that have passed their application
   * expiry time, and proposals with challenges that can be resolved.
   * @param fromBlock Starting block in history for events. Set to "latest" for only new events
   * @returns propIDs for proposals that can be updated
   */
  public propIDsToProcess(fromBlock: number | "latest" = 0): Observable<EthAddress> {
    const applicationsToProcess = this.instance
      .ReparameterizationProposalStream({}, { fromBlock })
      .map(e => e.args.propID)
      .concatFilter(async propID => this.isPropInUnchallengedApplicationUpdatePhase(propID));

    const challengesToResolve = this.instance
      .NewChallengeStream({}, { fromBlock })
      .map(e => e.args.propID)
      .concatFilter(async propID => this.isPropInChallengeResolvePhase(propID));

    return Observable.merge(applicationsToProcess, challengesToResolve).distinct();
  }

  /**
   * An unending stream of the ParamProps of all Reparametization proposals that can be
   * processed right now. Includes unchallenged applications that have passed their application
   * expiry time, and proposals with challenges that can be resolved.
   * @param fromBlock Starting block in history for events. Set to "latest" for only new events
   * @returns ParamProps for proposals that can be updated
   */
  public paramPropsToProcess(fromBlock: number | "latest" = 0): Observable<ParamProp> {
    const challengesToResolve = this.instance
      .NewChallengeStream({}, { fromBlock })
      .concatFilter(async e => {
        return this.isPropInChallengeResolvePhase(e.args.propID);
      })
      .map(e => {
        return {
          propID: e.args.propID,
          paramName: e.args.name,
          proposedValue: e.args.value,
          pollID: e.args.pollID,
        };
      });

    const applicationsToProcess = this.instance
      .ReparameterizationProposalStream({}, { fromBlock })
      .concatFilter(async e => {
        return this.isPropInUnchallengedApplicationUpdatePhase(e.args.propID);
      })
      .map(e => {
        return {
          propID: e.args.propID,
          paramName: e.args.name,
          proposedValue: e.args.value,
          pollID: undefined,
        };
      });

    return Observable.merge(applicationsToProcess, challengesToResolve);
  }

  /**
   * An unending stream of the pollIDs of all Reparametization proposals that have
   * been challenged and had those challenges resolved.
   * @param fromBlock Starting block in history for events. Set to "latest" for only new events
   * @returns pollIDs for proposals that have been challenged and resolved
   */
  public pollIDsForResolvedChallenges(propID: string, fromBlock: number | "latest" = 0): Observable<PollID> {
    return this.instance
      .NewChallengeStream({ propID }, { fromBlock })
      .concatFilter(async e => this.isChallengeResolved(e.args.pollID))
      .map(e => e.args.pollID);
  }

  /**
   * An unending stream of the propIDs of all Reparametization proposals that have
   * been challenged and had those challenges resolved.
   * @param fromBlock Starting block in history for events. Set to "latest" for only new events
   * @returns propIDs for proposals that have been challenged and resolved
   */
  public propIDsForResolvedChallenges(fromBlock: number | "latest" = 0): Observable<EthAddress> {
    return this.instance
      .NewChallengeStream({}, { fromBlock })
      .concatFilter(async e => this.isChallengeResolved(e.args.pollID))
      .map(e => e.args.propID);
  }

  /**
   * An unending stream of the ParamProps of all Reparametization proposals that have
   * been challenged and had those challenges resolved.
   * @param fromBlock Starting block in history for events. Set to "latest" for only new events
   * @returns ParamProps for proposals that have been challenged and resolved
   */
  public paramPropsForResolvedChallenged(fromBlock: number | "latest" = 0): Observable<ParamProp> {
    return this.instance
      .NewChallengeStream({}, { fromBlock })
      .concatFilter(async e => this.isChallengeResolved(e.args.pollID))
      .map(e => {
        return {
          propID: e.args.propID,
          paramName: e.args.name,
          proposedValue: e.args.value,
          pollID: e.args.pollID,
        };
      });
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
    paramName: Parameters | string,
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
  public async challengeReparameterization(propID: Bytes32): Promise<TwoStepEthTransaction> {
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
  public async processProposal(propID: Bytes32): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(this.web3Wrapper, await this.instance.processProposal.sendTransactionAsync(propID));
  }

  /**
   * Claims reward associated with challenge
   * @param challengeID ID of challenge to claim reward of
   * @param salt Salt for user's vote on specified challenge
   */
  public async claimReward(challengeID: BigNumber, salt: BigNumber): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(
      this.web3Wrapper,
      await this.instance.claimReward.sendTransactionAsync(challengeID, salt),
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

  /**
   * Gets the current ChallengeID of the specified parameter
   * @param parameter key of parameter to check
   */
  public async getChallengeID(parameter: string): Promise<PollID> {
    return this.instance.getPropChallengeID.callAsync(parameter);
  }

  /**
   * Returns whether or not a Proposal is in the Unchallenged Applicaton Phase
   * @param propID ID of prop to check
   */
  public async isPropInUnchallengedApplicationPhase(propID: string): Promise<boolean> {
    if (!await this.instance.propExists.callAsync(propID)) {
      return false;
    }
    const pollID = await this.instance.getPropChallengeID.callAsync(propID);
    if (!pollID.isZero()) {
      return false;
    }

    const applicationExpiry = await this.instance.getPropAppExpiry.callAsync(propID);
    const appExpiryDate = new Date(applicationExpiry.toNumber() * 1000);

    if (appExpiryDate < new Date()) {
      return false;
    }

    return true;
  }

  /**
   * Returns whether or not a Proposal Application can be Updated (has passed Application
   * phase without being challenged)
   * @param propID ID of prop to check
   */
  public async isPropInUnchallengedApplicationUpdatePhase(propID: string): Promise<boolean> {
    if (!await this.instance.propExists.callAsync(propID)) {
      return false;
    }
    const pollID = await this.instance.getPropChallengeID.callAsync(propID);
    if (!pollID.isZero()) {
      return false;
    }
    const applicationExpiry = await this.instance.getPropAppExpiry.callAsync(propID);
    const appExpiryDate = new Date(applicationExpiry.toNumber() * 1000);

    if (appExpiryDate > new Date()) {
      return false;
    }

    return true;
  }

  /**
   * Returns whether or not a Proposal is in the Challenge Commit Phase
   * @param propID ID of prop to check
   */
  public async isPropInChallengeCommitPhase(propID: string): Promise<boolean> {
    if (!await this.instance.propExists.callAsync(propID)) {
      return false;
    }
    const pollID = await this.instance.getPropChallengeID.callAsync(propID);
    if (pollID.isZero()) {
      return false;
    }

    const voting = await this.getVoting();
    return voting.isCommitPeriodActive(pollID);
  }

  /**
   * Returns whether or not a Proposal is in the Challenge Reveal Phase
   * @param propID ID of prop to check
   */
  public async isPropInChallengeRevealPhase(propID: string): Promise<boolean> {
    if (!await this.instance.propExists.callAsync(propID)) {
      return false;
    }
    const pollID = await this.instance.getPropChallengeID.callAsync(propID);
    if (pollID.isZero()) {
      return false;
    }

    const voting = await this.getVoting();
    return voting.isRevealPeriodActive(pollID);
  }

  /**
   * Returns whether or not a Proposal is in the Challenge Resolve Phase
   * @param propID ID of prop to check
   */
  public async isPropInChallengeResolvePhase(propID: string): Promise<boolean> {
    if (!await this.instance.propExists.callAsync(propID)) {
      return false;
    }
    const pollID = await this.instance.getPropChallengeID.callAsync(propID);
    if (pollID.isZero()) {
      return false;
    }

    const voting = await this.getVoting();
    return voting.hasPollEnded(pollID);
  }

  /**
   * Returns whether or not a Challenge has been resolved
   * @param propID ID of poll (challenge) to check
   */
  public async isChallengeResolved(pollID: BigNumber): Promise<boolean> {
    return this.instance.getChallengeResolved.callAsync(pollID);
  }

  /**
   * Returns the Application Expiry date for a proposal
   * @param propID ID of prop to check
   */
  public async getPropApplicationExpiry(propID: string): Promise<Date> {
    const expiryTimestamp = await this.getPropApplicationExpiryTimestamp(propID);
    return new Date(expiryTimestamp.toNumber() * 1000);
  }

  /**
   *
   * @param propID id of proposal to check
   * @throws {CivilErrors.NoChallenge}
   */
  public async getPropChallengeCommitExpiry(propID: string): Promise<Date> {
    const challengeID = await this.getChallengeID(propID);
    if (challengeID.isZero()) {
      throw CivilErrors.NoChallenge;
    }
    const voting = await this.getVoting();
    const expiryTimestamp = await voting.getCommitPeriodExpiry(challengeID);
    return new Date(expiryTimestamp.toNumber() * 1000);
  }

  /**
   *
   * @param propID id of proposal to check
   * @throws {CivilErrors.NoChallenge}
   */
  public async getPropChallengeRevealExpiry(propID: string): Promise<Date> {
    const challengeID = await this.getChallengeID(propID);
    if (challengeID.isZero()) {
      throw CivilErrors.NoChallenge;
    }
    const voting = await this.getVoting();
    const expiryTimestamp = await voting.getRevealPeriodExpiry(challengeID);
    return new Date(expiryTimestamp.toNumber() * 1000);
  }

  /**
   * Returns the date by which a proposal must be processed. Successful proposals must
   * be processed within a certain timeframe, to avoid gaming the parameterizer.
   * @param propID ID of prop to check
   */
  public async getPropProcessBy(propID: string): Promise<Date> {
    const expiryTimestamp = await this.instance.getPropProcessBy.callAsync(propID);
    return new Date(expiryTimestamp.toNumber() * 1000);
  }

  /**
   * Returns the timestamp of the Application Expiry
   * @param propID ID of prop to check
   */
  public async getPropApplicationExpiryTimestamp(propID: string): Promise<BigNumber> {
    return this.instance.getPropAppExpiry.callAsync(propID);
  }

  /**
   * Returns the name of the paramater associated with the given proposal
   * @param propID ID of prop to check
   */
  public async getPropName(propID: string): Promise<string> {
    return this.instance.getPropName.callAsync(propID);
  }

  /**
   * Returns the value proposed associated with the given proposal
   * @param propID ID of prop to check
   */
  public async getPropValue(propID: string): Promise<BigNumber> {
    return this.instance.getPropValue.callAsync(propID);
  }
}
