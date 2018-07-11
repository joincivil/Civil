import * as React from "react";
import {
  isAppealChallengeInCommitStage,
  isAppealChallengeInRevealStage,
  AppealChallengeData,
  TwoStepEthTransaction,
} from "@joincivil/core";
import BigNumber from "bignumber.js";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { AppealChallengeCommitVoteCard, AppealChallengeRevealVoteCard } from "@joincivil/components";
import { commitVote, requestVotingRights, revealVote } from "../../apis/civilTCR";
import { fetchSalt } from "../../helpers/salt";

export interface AppealChallengeDetailProps {
  appealChallengeID: BigNumber;
  appealChallenge: AppealChallengeData;
  govtParameters: any;
  tokenBalance: number;
  user: any;
}

export interface ChallengeVoteState {
  voteOption?: string;
  salt?: string;
  numTokens?: string;
}

class AppealChallengeDetail extends React.Component<AppealChallengeDetailProps, ChallengeVoteState> {
  constructor(props: AppealChallengeDetailProps) {
    super(props);

    this.state = {
      salt: fetchSalt(this.props.appealChallengeID, this.props.user), // TODO(jorgelo): This should probably be in redux.
    };
  }

  public render(): JSX.Element {
    const challenge = this.props.appealChallenge;
    const canResolveChallenge =
      !isAppealChallengeInCommitStage(challenge) && !isAppealChallengeInRevealStage(challenge) && !challenge.resolved;
    const canShowResult = this.props.appealChallenge.resolved;
    return (
      <>
        {isAppealChallengeInCommitStage(challenge) && this.renderCommitStage()}
        {isAppealChallengeInRevealStage(challenge) && this.renderRevealStage()}
        {canResolveChallenge && this.renderResolveAppealChallenge()}
        {canShowResult && this.renderVoteResult()}
      </>
    );
  }

  private renderVoteResult(): JSX.Element {
    const totalVotes = this.props.appealChallenge.poll.votesAgainst.add(this.props.appealChallenge.poll.votesFor);
    const percentFor = this.props.appealChallenge.poll.votesFor.div(totalVotes).mul(100);
    const percentAgainst = this.props.appealChallenge.poll.votesAgainst.div(totalVotes).mul(100);
    return (
      <>
        Appeal Challenge Result:
        <br />
        Reject: {this.props.appealChallenge.poll.votesFor.toString() + " CVL"} - {percentFor.toString() + "%"}
        <br />
        Allow: {this.props.appealChallenge.poll.votesAgainst.toString() + " CVL"} - {percentAgainst.toString() + "%"}
      </>
    );
  }

  private renderCommitStage(): JSX.Element {
    const challenge = this.props.appealChallenge;

    const endTime = challenge.poll.commitEndDate.toNumber();
    const phaseLength = this.props.govtParameters.challengeAppealCommitLen;

    const challenger = challenge.challenger.toString();
    const rewardPool = getFormattedTokenBalance(challenge.rewardPool);
    const stake = getFormattedTokenBalance(challenge.stake);

    const transactions = [{ transaction: this.requestVotingRights }, { transaction: this.commitVoteOnChallenge }];

    return (
      <AppealChallengeCommitVoteCard
        endTime={endTime}
        phaseLength={phaseLength}
        challenger={challenger}
        rewardPool={rewardPool}
        stake={stake}
        onInputChange={this.updateCommitVoteState}
        tokenBalance={this.props.tokenBalance}
        salt={this.state.salt}
        numTokens={this.state.numTokens}
        transactions={transactions}
      />
    );
  }

  private renderRevealStage(): JSX.Element {
    const challenge = this.props.appealChallenge;

    const endTime = challenge.poll.commitEndDate.toNumber();
    const phaseLength = this.props.govtParameters.challengeAppealCommitLen;

    const challenger = challenge.challenger.toString();
    const rewardPool = getFormattedTokenBalance(challenge.rewardPool);
    const stake = getFormattedTokenBalance(challenge.stake);

    const transactions = [{ transaction: this.revealVoteOnChallenge }];

    return (
      <AppealChallengeRevealVoteCard
        endTime={endTime}
        phaseLength={phaseLength}
        challenger={challenger}
        rewardPool={rewardPool}
        stake={stake}
        salt={this.state.salt}
        onInputChange={this.updateCommitVoteState}
        transactions={transactions}
      />
    );
  }

  private renderResolveAppealChallenge(): JSX.Element {
    return <>RESOLVE APPEAL CHALLENGE</>;
  }

  private updateCommitVoteState = (data: any): void => {
    this.setState({ ...data });
  };

  private requestVotingRights = async (): Promise<TwoStepEthTransaction<any> | void> => {
    const numTokens: BigNumber = new BigNumber(this.state.numTokens as string).mul(1e18);
    return requestVotingRights(numTokens);
  };

  private commitVoteOnChallenge = async (): Promise<TwoStepEthTransaction<any>> => {
    const voteOption: BigNumber = new BigNumber(this.state.voteOption as string);
    const salt: BigNumber = new BigNumber(this.state.salt as string);
    const numTokens: BigNumber = new BigNumber(this.state.numTokens as string).mul(1e18);
    return commitVote(this.props.appealChallengeID, voteOption, salt, numTokens);
  };

  private revealVoteOnChallenge = async (): Promise<TwoStepEthTransaction<any>> => {
    const voteOption: BigNumber = new BigNumber(this.state.voteOption as string);
    const salt: BigNumber = new BigNumber(this.state.salt as string);
    return revealVote(this.props.appealChallengeID, voteOption, salt);
  };
}

export default AppealChallengeDetail;
