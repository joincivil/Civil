import { EthApi, requireAccount } from "@joincivil/ethapi";
import { CivilErrors } from "@joincivil/utils";
import BigNumber from "bignumber.js";
import * as Debug from "debug";
import { Observable } from "rxjs";
import { Bytes32, EthAddress, PollData, TwoStepEthTransaction } from "../../types";
import { BaseWrapper } from "../basewrapper";
import { CivilPLCRVotingContract } from "../generated/wrappers/civil_p_l_c_r_voting";
import { createTwoStepSimple } from "../utils/contracts";

const debug = Debug("civil:tcr");

/**
 * Voting allows user to interface with polls, either from the
 * Parameterizer or the Registry
 */
export class Voting extends BaseWrapper<CivilPLCRVotingContract> {
  public static async singleton(ethApi: EthApi): Promise<Voting> {
    const instance = await CivilPLCRVotingContract.singletonTrusted(ethApi);
    if (!instance) {
      debug("Smart-contract wrapper for Voting returned null, unsupported network");
      throw new Error(CivilErrors.UnsupportedNetwork);
    }
    return new Voting(ethApi, instance);
  }

  public static atUntrusted(web3wrapper: EthApi, address: EthAddress): Voting {
    const instance = CivilPLCRVotingContract.atUntrusted(web3wrapper, address);
    return new Voting(web3wrapper, instance);
  }

  private constructor(ethApi: EthApi, instance: CivilPLCRVotingContract) {
    super(ethApi, instance);
  }

  /**
   * Event Streams
   */

  /**
   * An unending stream of all IDs of active Polls
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
   * An unending stream of all pollIDs of polls the user has committed votes on
   * @param fromBlock Starting block in history for events concerning new polls
   *                  Set to "latest" for only new events
   * @param user pollIDs of polls the user has committed votes for
   */
  public votesCommitted(fromBlock: number | "latest" = 0, user?: EthAddress): Observable<BigNumber> {
    return this.instance._VoteCommittedStream({ voter: user }, { fromBlock }).map(e => e.args.pollID);
  }

  public balanceUpdate(fromBlock: number | "latest" = 0, user: EthAddress): Observable<BigNumber> {
    return this.instance
      ._VotingRightsGrantedStream({ voter: user }, { fromBlock })
      .merge(this.instance._VotingRightsWithdrawnStream({ voter: user }, { fromBlock }))
      .concatMap(async e => this.getNumVotingRights(user));
  }

  /**
   * Contract Transactions
   */

  /**
   * Withdraw tokens from voting contract (thus withdrawing voting rights)
   * @param numTokens number of tokens to withdraw from voting contract
   */
  public async withdrawVotingRights(numTokens: BigNumber): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(this.ethApi, await this.instance.withdrawVotingRights.sendTransactionAsync(numTokens));
  }

  /**
   * Checks whether or not a user can rescue tokens from a poll by trying to estimate gas cost of the transaction.
   * If estimate succeeds, it should be true. If the estimate fails, it means the transaction would result in an EVM
   * exception and should be false.
   * @param user user to check
   * @param pollID poll to check
   */
  public async canRescueTokens(user: EthAddress, pollID: BigNumber): Promise<boolean> {
    return new Promise<boolean>(async (res, rej) => {
      try {
        await this.instance.rescueTokens.estimateGasAsync(pollID, { from: user });
        console.log("can rescue tokens. pollID: " + pollID);
        res(true);
      } catch (ex) {
        console.log("cannot rescue tokens bud. " + pollID);
        res(false);
      }
    });
  }

  /**
   * Unlocks tokens from unrevealed vote where poll has ended
   * @param pollID ID of poll to unlock unrevealed vote of
   */
  public async rescueTokens(pollID: BigNumber): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(
      this.ethApi,
      await this.instance.rescueTokens.sendTransactionAsync(this.ethApi.toBigNumber(pollID)),
    );
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
    const tokenBalance = await this.instance.voteTokenBalance.callAsync(await requireAccount(this.ethApi).toPromise());
    console.log("tokenBalance: " + tokenBalance);
    return createTwoStepSimple(
      this.ethApi,
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
      this.ethApi,
      await this.instance.revealVote.sendTransactionAsync(pollID, voteOption, salt),
    );
  }

  public async getRevealedVote(pollID: BigNumber, voter: EthAddress): Promise<BigNumber | undefined> {
    if (await this.didRevealVote(voter, pollID)) {
      const reveal = await this.instance
        ._VoteRevealedStream({ pollID }, { fromBlock: 0 })
        .first()
        .toPromise();
      return reveal.args.choice;
    }
    return undefined;
  }

  public async isVoterWinner(pollID: BigNumber, voter: EthAddress): Promise<boolean> {
    const vote = await this.getRevealedVote(pollID, voter);
    if (vote) {
      const isPollPassed = await this.instance.isPassed.callAsync(pollID);
      if (vote.equals("1") && isPollPassed) {
        return true;
      } else if (vote.equals("0") && !isPollPassed) {
        return true;
      }
    }
    return false;
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
      who = await requireAccount(this.ethApi).toPromise();
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
      who = await requireAccount(this.ethApi).toPromise();
    }
    return this.didRevealVote(who, pollID);
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

  public async didCommitVote(user: EthAddress, pollID: BigNumber): Promise<boolean> {
    return this.instance.didCommit.callAsync(user, pollID);
  }
  public async didRevealVote(user: EthAddress, pollID: BigNumber): Promise<boolean> {
    return this.instance.didReveal.callAsync(user, pollID);
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
      who = await requireAccount(this.ethApi).toPromise();
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
      who = await requireAccount(this.ethApi).toPromise();
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
