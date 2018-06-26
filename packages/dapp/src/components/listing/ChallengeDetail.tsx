import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import {
  isChallengeInCommitStage,
  isChallengeInRevealStage,
  canRequestAppeal,
  // didChallengeSucceed,
  doesChallengeHaveAppeal,
  ChallengeData,
  EthAddress,
  TwoStepEthTransaction,
  UserChallengeData,
  WrappedChallengeData,
  didUserCommit,
} from "@joincivil/core";
import {
  ChallengeCommitVoteCard,
  ChallengeRevealVoteCard,
  ChallengeRequestAppealCard,
  ChallengeResolveCard,
  ChallengeResults,
} from "@joincivil/components";
import AppealDetail from "./AppealDetail";
import ChallengeRewardsDetail from "./ChallengeRewardsDetail";
import { appealChallenge, approveForAppeal, commitVote, requestVotingRights, revealVote } from "../../apis/civilTCR";
import BigNumber from "bignumber.js";
import { State } from "../../reducers";
import { fetchAndAddChallengeData } from "../../actionCreators/challenges";
import { getFormattedTokenBalance } from "@joincivil/utils";
import styled from "styled-components";

const StyledChallengeResults = styled.div`
  width: 460px;
`;

export interface ChallengeContainerProps {
  listingAddress: EthAddress;
  challengeID: BigNumber;
  showNotFoundMessage?: boolean;
}

export interface ChallengeContainerReduxProps {
  challengeData?: WrappedChallengeData | undefined;
  userChallengeData?: UserChallengeData | undefined;
  userAppealChallengeData?: UserChallengeData | undefined;
  challengeDataRequestStatus?: any;
  user: EthAddress;
  balance: BigNumber;
  parameters: any;
  govtParameters: any;
}

export interface ChallengeTransactionsProps {
  transactions: any[];
}

export interface ChallengeDetailProps {
  listingAddress: EthAddress;
  challengeID: BigNumber;
  challenge: ChallengeData;
  parameters?: any;
  govtParameters?: any;
  userChallengeData?: UserChallengeData;
  userAppealChallengeData?: UserChallengeData;
  user?: EthAddress;
  balance?: BigNumber;
}

export interface ChallengeVoteState {
  voteOption?: string;
  salt?: string;
  numTokens?: string;
}

// A container encapsultes the Commit Vote, Reveal Vote and Rewards phases for a Challenge.
// @TODO(jon): Clean this up... by maybe separating into separate containers for each phase card component
class ChallengeDetail extends React.Component<ChallengeDetailProps, ChallengeVoteState> {
  constructor(props: any) {
    super(props);

    this.state = {
      voteOption: undefined,
      salt: undefined,
      numTokens: undefined,
    };
  }

  public render(): JSX.Element {
    const challenge = this.props.challenge;
    const userChallengeData = this.props.userChallengeData;
    const userAppealChallengeData = this.props.userAppealChallengeData;
    console.log("ChallengeDetail render: ", challenge, userChallengeData);
    const appealExists = doesChallengeHaveAppeal(challenge);
    const canShowResult = challenge.resolved;

    const canShowRewardsForm = didUserCommit(userChallengeData) && challenge.resolved;

    const canShowAppealChallengeRewardsFrom =
      didUserCommit(userAppealChallengeData) && challenge.appeal!.appealChallenge!.resolved;

    return (
      <>
        {isChallengeInCommitStage(challenge) && this.renderCommitStage()}
        {isChallengeInRevealStage(challenge) && this.renderRevealStage()}
        {canRequestAppeal(challenge) && this.renderRequestAppealStage()}
        {canShowResult && this.renderVoteResult()}
        {appealExists && this.renderAppeal()}
        {canShowRewardsForm &&
          !isChallengeInCommitStage(challenge) &&
          !isChallengeInRevealStage(challenge) &&
          this.renderRewardsDetail()}
        {canShowAppealChallengeRewardsFrom && this.renderAppealChallengeRewardsDetail()}
      </>
    );
  }

  private renderAppeal(): JSX.Element {
    const challenge = this.props.challenge;
    return (
      <AppealDetail
        listingAddress={this.props.listingAddress}
        appeal={challenge.appeal!}
        challenge={challenge}
        govtParameters={this.props.govtParameters}
        tokenBalance={(this.props.balance && this.props.balance.toNumber()) || 0}
      />
    );
  }

  private renderCommitStage(): JSX.Element | null {
    const endTime = this.props.challenge.poll.commitEndDate.toNumber();
    const phaseLength = this.props.parameters.commitStageLen;
    const challenge = this.props.challenge;
    const tokenBalance = this.props.balance ? this.props.balance.toNumber() : 0;
    const transactions = [{ transaction: this.requestVotingRights }, { transaction: this.commitVoteOnChallenge }];

    if (!challenge) {
      return null;
    }

    return (
      <ChallengeCommitVoteCard
        endTime={endTime}
        phaseLength={phaseLength}
        challenger={challenge!.challenger.toString()}
        rewardPool={getFormattedTokenBalance(challenge!.rewardPool)}
        stake={getFormattedTokenBalance(challenge!.stake)}
        onInputChange={this.updateCommitVoteState}
        tokenBalance={tokenBalance}
        salt={this.state.salt}
        numTokens={this.state.numTokens}
        transactions={transactions}
      />
    );
  }

  private renderRevealStage(): JSX.Element | null {
    const endTime = this.props.challenge.poll.revealEndDate.toNumber();
    const phaseLength = this.props.parameters.revealStageLen;
    const challenge = this.props.challenge;
    const transactions = [{ transaction: this.revealVoteOnChallenge }];

    if (!challenge) {
      return null;
    }

    return (
      <ChallengeRevealVoteCard
        endTime={endTime}
        phaseLength={phaseLength}
        challenger={challenge!.challenger.toString()}
        rewardPool={getFormattedTokenBalance(challenge!.rewardPool)}
        stake={getFormattedTokenBalance(challenge!.stake)}
        salt={this.state.salt}
        onInputChange={this.updateCommitVoteState}
        transactions={transactions}
      />
    );
  }
  private renderRequestAppealStage(): JSX.Element {
    const challenge = this.props.challenge;
    const endTime = this.props.challenge.requestAppealExpiry.toNumber();
    const phaseLength = this.props.govtParameters.requestAppealLen;
    const transactions = [{ transaction: approveForAppeal }, { transaction: this.appeal }];
    const totalVotes = challenge.poll.votesAgainst.add(challenge.poll.votesFor).toString();
    const votesFor = getFormattedTokenBalance(challenge.poll.votesFor);
    const votesAgainst = getFormattedTokenBalance(challenge.poll.votesAgainst);
    const percentFor = challenge.poll.votesFor
      .div(totalVotes)
      .mul(100)
      .toFixed(0);
    const percentAgainst = challenge.poll.votesAgainst
      .div(totalVotes)
      .mul(100)
      .toFixed(0);
    return (
      <ChallengeRequestAppealCard
        endTime={endTime}
        phaseLength={phaseLength}
        transactions={transactions}
        totalVotes={totalVotes}
        votesFor={votesFor}
        votesAgainst={votesAgainst}
        percentFor={percentFor}
        percentAgainst={percentAgainst}
      />
    );
  }
  private renderVoteResult(): JSX.Element {
    const challenge = this.props.challenge;
    const totalVotes = challenge.poll.votesAgainst.add(challenge.poll.votesFor);
    const votesFor = getFormattedTokenBalance(challenge.poll.votesFor);
    const votesAgainst = getFormattedTokenBalance(challenge.poll.votesAgainst);
    const percentFor = challenge.poll.votesFor
      .div(totalVotes)
      .mul(100)
      .toFixed(0);
    const percentAgainst = challenge.poll.votesAgainst
      .div(totalVotes)
      .mul(100)
      .toFixed(0);
    console.log(challenge);
    return (
      <StyledChallengeResults>
        <ChallengeResults
          totalVotes={getFormattedTokenBalance(totalVotes)}
          votesFor={votesFor.toString()}
          votesAgainst={votesAgainst.toString()}
          percentFor={percentFor.toString()}
          percentAgainst={percentAgainst.toString()}
        />
      </StyledChallengeResults>
    );
  }
  private renderRewardsDetail(): JSX.Element {
    return (
      <ChallengeRewardsDetail
        challengeID={this.props.challengeID}
        user={this.props.user}
        userChallengeData={this.props.userChallengeData}
        challenge={this.props.challenge!}
      />
    );
  }
  private renderAppealChallengeRewardsDetail(): JSX.Element {
    return (
      <ChallengeRewardsDetail
        challengeID={this.props.challenge.appeal!.appealChallengeID}
        user={this.props.user}
        userChallengeData={this.props.userAppealChallengeData}
        appealChallenge={this.props.challenge.appeal!.appealChallenge!}
      />
    );
  }

  private updateCommitVoteState = (data: any, callback?: () => void): void => {
    if (callback) {
      this.setState({ ...data }, callback);
    } else {
      this.setState({ ...data });
    }
  };

  private appeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return appealChallenge(this.props.listingAddress);
  };

  private requestVotingRights = async (): Promise<TwoStepEthTransaction<any> | void> => {
    const numTokens: BigNumber = new BigNumber(this.state.numTokens as string).mul(1e18);
    return requestVotingRights(numTokens);
  };

  private commitVoteOnChallenge = async (): Promise<TwoStepEthTransaction<any>> => {
    const voteOption: BigNumber = new BigNumber(this.state.voteOption as string);
    const salt: BigNumber = new BigNumber(this.state.salt as string);
    const numTokens: BigNumber = new BigNumber(this.state.numTokens as string).mul(1e18);
    return commitVote(this.props.challengeID, voteOption, salt, numTokens);
  };

  private revealVoteOnChallenge = async (): Promise<TwoStepEthTransaction<any>> => {
    const voteOption: BigNumber = new BigNumber(this.state.voteOption as string);
    const salt: BigNumber = new BigNumber(this.state.salt as string);
    return revealVote(this.props.challengeID, voteOption, salt);
  };
}

class ChallengeContainer extends React.Component<
  ChallengeContainerProps & ChallengeContainerReduxProps & DispatchProp<any>
> {
  public componentDidUpdate(): void {
    if (!this.props.challengeData && !this.props.challengeDataRequestStatus) {
      this.props.dispatch!(fetchAndAddChallengeData(this.props.challengeID.toString()));
    }
  }

  public render(): JSX.Element | null {
    const challenge = this.props.challengeData && this.props.challengeData.challenge;
    if (!challenge && this.props.showNotFoundMessage) {
      return this.renderNoChallengeFound();
    } else if (!challenge) {
      return null;
    }
    return (
      <ChallengeDetail
        listingAddress={this.props.listingAddress}
        challengeID={this.props.challengeID}
        challenge={challenge}
        userChallengeData={this.props.userChallengeData}
        userAppealChallengeData={this.props.userAppealChallengeData}
        user={this.props.user}
        parameters={this.props.parameters}
        govtParameters={this.props.govtParameters}
      />
    );
  }

  private renderNoChallengeFound = (): JSX.Element => {
    return <>This is not the challenge that you're looking for.</>;
  };
}

const mapStateToProps = (
  state: State,
  ownProps: ChallengeContainerProps,
): ChallengeContainerReduxProps & ChallengeContainerProps => {
  const {
    challenges,
    challengesFetching,
    challengeUserData,
    appealChallengeUserData,
    user,
    parameters,
    govtParameters,
  } = state.networkDependent;

  let listingAddress = ownProps.listingAddress;
  let challengeData;
  let userChallengeData;
  let userAppealChallengeData;
  const challengeID = ownProps.challengeID;
  if (challengeID) {
    challengeData = challenges.get(challengeID.toString());
  }
  if (!listingAddress && challengeData) {
    listingAddress = challenges.get(challengeID.toString())!.listingAddress;
  }
  const userAcct = user.account;

  // TODO(nickreynolds): clean this up
  if (challengeID && userAcct) {
    const challengeUserDataMap = challengeUserData.get(challengeID!.toString());
    if (challengeUserDataMap) {
      userChallengeData = challengeUserDataMap.get(userAcct.account);
    }
    if (challengeData) {
      const wrappedChallenge = challengeData as WrappedChallengeData;

      // null checks
      if (wrappedChallenge && wrappedChallenge.challenge && wrappedChallenge.challenge.appeal) {
        const appealChallengeID = wrappedChallenge.challenge.appeal.appealChallengeID;
        const appealChallengeUserDataMap = appealChallengeUserData.get(appealChallengeID!.toString());
        if (appealChallengeUserDataMap) {
          userAppealChallengeData = appealChallengeUserDataMap.get(userAcct.account);
        }
      }
    }
  }
  let challengeDataRequestStatus;
  if (challengeID) {
    challengeDataRequestStatus = challengesFetching.get(challengeID.toString());
  }
  return {
    challengeData,
    userChallengeData,
    userAppealChallengeData,
    challengeDataRequestStatus,
    user: userAcct,
    balance: user.account.balance,
    parameters,
    govtParameters,
    ...ownProps,
  };
};

// A container for the Challenge Resolve Card component
class ChallengeResolveContainer extends React.Component<
  ChallengeContainerProps & ChallengeContainerReduxProps & ChallengeTransactionsProps & DispatchProp<any>
> {
  public componentWillReceiveProps(nextProps: any): void {
    if (!this.props.challengeData && !nextProps.challengeData && !this.props.challengeDataRequestStatus) {
      this.props.dispatch!(fetchAndAddChallengeData(this.props.challengeID.toString()));
    }
  }

  public render(): JSX.Element | null {
    const challenge = this.props.challengeData && this.props.challengeData.challenge;

    if (!challenge) {
      return null;
    }

    const totalVotes = challenge.poll.votesAgainst.add(challenge.poll.votesFor);
    const votesFor = getFormattedTokenBalance(challenge.poll.votesFor);
    const votesAgainst = getFormattedTokenBalance(challenge.poll.votesAgainst);
    const percentFor = challenge.poll.votesFor
      .div(totalVotes)
      .mul(100)
      .toFixed(0);
    const percentAgainst = challenge.poll.votesAgainst
      .div(totalVotes)
      .mul(100)
      .toFixed(0);

    return (
      <ChallengeResolveCard
        challenger={challenge!.challenger.toString()}
        rewardPool={getFormattedTokenBalance(challenge!.rewardPool)}
        stake={getFormattedTokenBalance(challenge!.stake)}
        totalVotes={getFormattedTokenBalance(totalVotes)}
        votesFor={votesFor.toString()}
        votesAgainst={votesAgainst.toString()}
        percentFor={percentFor.toString()}
        percentAgainst={percentAgainst.toString()}
        transactions={this.props.transactions}
      />
    );
  }
}

export const ChallengeResolve = connect(mapStateToProps)(ChallengeResolveContainer);

export default connect(mapStateToProps)(ChallengeContainer);
