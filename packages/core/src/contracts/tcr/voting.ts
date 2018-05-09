import BigNumber from "bignumber.js";
import { Observable } from "rxjs";
import * as Debug from "debug";
import "@joincivil/utils";

import { Bytes32, EthAddress, PollData, TwoStepEthTransaction } from "../../types";
import { CivilErrors, requireAccount } from "../../utils/errors";
import { Web3Wrapper } from "../../utils/web3wrapper";
import { BaseWrapper } from "../basewrapper";
import { PLCRVotingContract } from "../generated/wrappers/p_l_c_r_voting";
import { createTwoStepSimple } from "../utils/contracts";

const debug = Debug("civil:tcr");

/**
 * Voting allows user to interface with polls, either from the
 * Parameterizer or the Registry
 */
export class Voting extends BaseWrapper<PLCRVotingContract> {
  public static singleton(web3Wrapper: Web3Wrapper): Voting {
    const instance = PLCRVotingContract.singletonTrusted(web3Wrapper);
    if (!instance) {
      debug("Smart-contract wrapper for Voting returned null, unsupported network");
      throw new Error(CivilErrors.UnsupportedNetwork);
    }
    return new Voting(web3Wrapper, instance);
  }

  public static atUntrusted(web3wrapper: Web3Wrapper, address: EthAddress): Voting {
    const instance = PLCRVotingContract.atUntrusted(web3wrapper, address);
    return new Voting(web3wrapper, instance);
  }

  private constructor(web3Wrapper: Web3Wrapper, instance: PLCRVotingContract) {
    super(web3Wrapper, instance);
  }

  /**
   * Event Streams
   */

  /**
   * An unending stream of all active Polls
   * @param fromBlock Starting block in history for events concerning new polls
   *                  Set to "latest" for only new events
   * @returns currently active polls (by id)
   */
  public activePolls(fromBlock: number | "latest" = 0): Observable<BigNumber> {
    return this.instance
      ._PollCreatedStream({}, { fromBlock })
      .map(e => e.args.pollID)
      .concatFilter(async pollID => this.instance.pollExists.callAsync(pollID));
  }

  /**
   * Contract Transactions
   */

  /**
   * Transfer tokens to voting contract (thus getting voting rights)
   * @param numTokens number of tokens to transfer into voting contract
   */
  public async requestVotingRights(numTokens: BigNumber): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(
      this.web3Wrapper,
      await this.instance.requestVotingRights.sendTransactionAsync(numTokens),
    );
  }

  /**
   * Withdraw tokens from voting contract (thus withdrawing voting rights)
   * @param numTokens number of tokens to withdraw from voting contract
   */
  public async withdrawVotingRights(numTokens: BigNumber): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(
      this.web3Wrapper,
      await this.instance.withdrawVotingRights.sendTransactionAsync(numTokens),
    );
  }

  /**
   * Unlocks tokens from unrevealed vote where poll has ended
   * @param pollID ID of poll to unlock unrevealed vote of
   */
  public async rescueTokens(pollID: BigNumber): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(this.web3Wrapper, await this.instance.rescueTokens.sendTransactionAsync(pollID));
  }

  /**
   * Commits user's votes for poll
   * @param pollID ID of poll to commit votes to
   * @param secretHash keccak256 hash of voter's choice and salt (tightly packed in this order)
   * @param numTokens How many tokens to be committed to poll
   * @param prevPollID ID of poll that the user has committed the maximum
   * number of tokens to (less than or equal to numTokens)
   */
  public async commitVote(
    pollID: BigNumber,
    secretHash: Bytes32,
    numTokens: BigNumber,
    prevPollID: BigNumber,
  ): Promise<TwoStepEthTransaction> {
    const commitPeriodActive = await this.isCommitPeriodActive(pollID);
    console.log("pollID: " + pollID);
    console.log("secretHash: " + secretHash);
    console.log("numTokens: " + numTokens);
    console.log("prevPollID: " + prevPollID);
    console.log("commitPeriodAction: " + commitPeriodActive);
    const tokenBalance = await this.instance.voteTokenBalance.callAsync(this.web3Wrapper.account!);
    console.log("tokenBalance: " + tokenBalance);
    return createTwoStepSimple(
      this.web3Wrapper,
      await this.instance.commitVote.sendTransactionAsync(pollID, secretHash, numTokens, prevPollID),
    );
  }

  /**
   * Reveals user's vote for specified poll
   * @param pollID ID of poll to reveal votes in
   * @param voteOption Vote choice used to generate commitHash for poll
   * @param salt Secret number used to generate commitHash for poll
   */
  public async revealVote(pollID: BigNumber, voteOption: BigNumber, salt: BigNumber): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(
      this.web3Wrapper,
      await this.instance.revealVote.sendTransactionAsync(pollID, voteOption, salt),
    );
  }

  /**
   * Contract Getters
   */

  /**
   * Gets number of tokens held as voting rights by the Voting contract
   * Voting contract may hold more tokens than can be withdrawn if some tokens
   * are currently locked in a vote
   * @param tokenOwner Address of token owner to check voting rights of
   */
  public async getNumVotingRights(tokenOwner?: EthAddress): Promise<BigNumber> {
    let who = tokenOwner;
    if (!who) {
      who = requireAccount(this.web3Wrapper);
    }
    return this.instance.voteTokenBalance.callAsync(who);
  }

  /**
   * Has a vote been revealed for given voter in specified poll?
   * @param voterAddress voter to check vote status of
   * @param pollID ID of poll to check
   */
  public async hasVoteBeenRevealed(pollID: BigNumber, voter?: EthAddress): Promise<boolean> {
    let who = voter;
    if (!who) {
      who = requireAccount(this.web3Wrapper);
    }
    return this.instance.didReveal.callAsync(who, pollID);
  }

  /**
   * Is this poll in reveal period?
   * @param pollID ID of poll to check
   */
  public async isRevealPeriodActive(pollID: BigNumber): Promise<boolean> {
    return this.instance.revealPeriodActive.callAsync(pollID);
  }

  /**
   * Is this poll in commit period?
   * @param pollID ID of poll to check
   */
  public async isCommitPeriodActive(pollID: BigNumber): Promise<boolean> {
    return this.instance.commitPeriodActive.callAsync(pollID);
  }

  /**
   * Has this poll ended?
   * @param pollID ID of poll to check
   */
  public async hasPollEnded(pollID: BigNumber): Promise<boolean> {
    return this.instance.pollEnded.callAsync(pollID);
  }

  /**
   * Gets total number of tokens from winning side of poll
   * @param pollID ID of poll to check
   */
  public async getTotalTokensForWinners(pollID: BigNumber): Promise<BigNumber> {
    return this.instance.getTotalNumberOfTokensForWinningOption.callAsync(pollID);
  }

  // TODO(nickreynolds): Refactor getNumPassingTokens to not require user to input whether challenge was overturned
  /**
   * Returns number of tokens this user committed & revealed for given poll
   * @param voterAddress address of voter to check
   * @param pollID ID of poll to check
   * @param salt Salt used by voter for this poll
   */
  public async getNumPassingTokens(pollID: BigNumber, voter?: EthAddress): Promise<BigNumber> {
    let who = voter;
    if (!who) {
      who = requireAccount(this.web3Wrapper);
    }
    return this.instance.getNumTokens.callAsync(who, pollID);
  }

  /**
   * Did this poll pass?
   * @param pollID ID of poll to check
   */
  public async isPollPassed(pollID: BigNumber): Promise<boolean> {
    return this.instance.isPassed.callAsync(pollID);
  }

  /**
   * Gets the pollID of the poll with most tokens less than tokens specified.
   * This is used to insert the new pollID in the correct position of list.
   * @param tokens number of tokens being committed this vote
   * @param account account to check pollID for
   */
  public async getPrevPollID(tokens: BigNumber, pollID: BigNumber, account?: EthAddress): Promise<BigNumber> {
    let who = account;
    if (!who) {
      who = requireAccount(this.web3Wrapper);
    }
    return this.instance.getInsertPointForNumTokens.callAsync(who, tokens, pollID);
  }

  public async getPoll(pollID: BigNumber): Promise<PollData> {
    const [commitEndDate, revealEndDate, voteQuorum, votesFor, votesAgainst] = await this.instance.pollMap.callAsync(
      pollID,
    );
    return {
      commitEndDate,
      revealEndDate,
      voteQuorum,
      votesFor,
      votesAgainst,
    };
  }
}
