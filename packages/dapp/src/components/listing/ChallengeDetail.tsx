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
} from "@joincivil/core";
import {
  ChallengeCommitVoteCard,
  ChallengeRevealVoteCard,
  ChallengeRequestAppealCard,
  ChallengeResolveCard,
  // AppealAwaitingDecisionCard,
  // AppealDecisionCard,
  // AppealChallengeCommitVoteCard,
  // AppealChallengeRevealVoteCard,
  // WhitelistedCard,
  // RejectedCard,
} from "@joincivil/components";
import AppealDetail from "./AppealDetail";
import ChallengeRewardsDetail from "./ChallengeRewardsDetail";
import { appealChallenge, approveForAppeal, commitVote, requestVotingRights, revealVote } from "../../apis/civilTCR";
import BigNumber from "bignumber.js";
import { State } from "../../reducers";
import { fetchAndAddChallengeData } from "../../actionCreators/challenges";
import { getFormattedTokenBalance } from "@joincivil/utils";

export interface ChallengeDetailProps {
  listingAddress: EthAddress;
  challengeID: BigNumber;
  challenge: ChallengeData;
  parameters: any;
  govtParameters: any;
  userChallengeData?: UserChallengeData;
  user?: EthAddress;
}

export interface ChallengeVoteState {
  isVoteTokenAmtValid: boolean;
  voteOption?: string;
  salt?: string;
  numTokens?: string;
}

class ChallengeDetail extends React.Component<ChallengeDetailProps, ChallengeVoteState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isVoteTokenAmtValid: false,
    };
  }

  public render(): JSX.Element {
    const challenge = this.props.challenge;
    const userChallengeData = this.props.userChallengeData;
    // console.log("ChallengeDetail render: ", challenge, userChallengeData);
    const appealExists = doesChallengeHaveAppeal(challenge);
    const canShowRewardsForm = userChallengeData && userChallengeData.didUserCommit;
    const canShowResult = this.props.challenge.resolved;
    return (
      <>
        {isChallengeInCommitStage(challenge) && this.renderCommitStage()}
        {isChallengeInRevealStage(challenge) && this.renderRevealStage()}
        {canRequestAppeal(challenge) && this.renderRequestAppealStage()}
        {appealExists && <AppealDetail listingAddress={this.props.listingAddress} appeal={challenge.appeal!} />}
        {canShowResult && this.renderVoteResult()}
        {canShowRewardsForm && this.renderRewardsDetail()}
      </>
    );
  }

  private renderCommitStage(): JSX.Element | null {
    const endTime = this.props.challenge.poll.commitEndDate.toNumber();
    const phaseLength = this.props.parameters.commitStageLen;
    const challenge = this.props.challenge;
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
        transactions={transactions}
      />
    );
  }
  private renderRequestAppealStage(): JSX.Element {
    const challenge = this.props.challenge;
    const endTime = this.props.challenge.requestAppealExpiry.toNumber();
    const phaseLength = this.props.govtParameters.requestAppealLen;
    const transactions = [{ transaction: approveForAppeal }, { transaction: this.appeal }];
    const totalVotes = challenge.poll.votesAgainst.add(challenge.poll.votesFor);
    const votesFor = challenge.poll.votesFor;
    const votesAgainst = challenge.poll.votesFor;
    const percentFor = challenge.poll.votesFor.div(totalVotes).mul(100);
    const percentAgainst = challenge.poll.votesAgainst.div(totalVotes).mul(100);
    return (
      <ChallengeRequestAppealCard
        endTime={endTime}
        phaseLength={phaseLength}
        transactions={transactions}
        totalVotes={totalVotes.toString()}
        votesFor={votesFor.toString()}
        votesAgainst={votesAgainst.toString()}
        percentFor={percentFor.toString()}
        percentAgainst={percentAgainst.toString()}
      />
    );
  }
  private renderVoteResult(): JSX.Element {
    const totalVotes = this.props.challenge.poll.votesAgainst.add(this.props.challenge.poll.votesFor);
    const percentFor = this.props.challenge.poll.votesFor.div(totalVotes).mul(100);
    const percentAgainst = this.props.challenge.poll.votesAgainst.div(totalVotes).mul(100);
    return (
      <>
        Result:
        <br />
        Reject: {this.props.challenge.poll.votesFor.toString() + " CVL"} - {percentFor.toString() + "%"}
        <br />
        Allow: {this.props.challenge.poll.votesAgainst.toString() + " CVL"} - {percentAgainst.toString() + "%"}
      </>
    );
  }
  private renderRewardsDetail(): JSX.Element {
    return (
      <ChallengeRewardsDetail
        challengeID={this.props.challengeID}
        user={this.props.user}
        userChallengeData={this.props.userChallengeData}
      />
    );
  }

  private appeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return appealChallenge(this.props.listingAddress);
  };

  private requestVotingRights = async (): Promise<TwoStepEthTransaction<any>> => {
    const numTokens: BigNumber = new BigNumber(this.state.numTokens as string);
    return requestVotingRights(numTokens);
  };

  private commitVoteOnChallenge = async (): Promise<TwoStepEthTransaction<any>> => {
    const voteOption: BigNumber = new BigNumber(this.state.voteOption as string);
    const salt: BigNumber = new BigNumber(this.state.salt as string);
    const numTokens: BigNumber = new BigNumber(this.state.numTokens as string);
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
  public componentWillReceiveProps(nextProps: any): void {
    if (!this.props.challengeData && !nextProps.challengeData && !this.props.challengeDataRequestStatus) {
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

export interface ChallengeContainerProps {
  listingAddress: EthAddress;
  challengeID: BigNumber;
  showNotFoundMessage?: boolean;
  parameters: any;
  govtParameters: any;
}

export interface ChallengeContainerReduxProps {
  challengeData?: WrappedChallengeData | undefined;
  userChallengeData?: UserChallengeData | undefined;
  challengeDataRequestStatus?: any;
  user: EthAddress;
}

const mapStateToProps = (
  state: State,
  ownProps: ChallengeContainerProps,
): ChallengeContainerReduxProps & ChallengeContainerProps => {
  const { challenges, challengesFetching, challengeUserData, user, parameters, govtParameters } = state;
  let listingAddress = ownProps.listingAddress;
  let challengeData;
  let userChallengeData;
  const challengeID = ownProps.challengeID;
  if (challengeID) {
    challengeData = challenges.get(challengeID.toString());
  }
  if (!listingAddress && challengeData) {
    listingAddress = challenges.get(challengeID.toString())!.listingAddress;
  }
  const userAcct = user.account;
  if (challengeID && userAcct) {
    const challengeUserDataMap = challengeUserData.get(challengeID!.toString());
    if (challengeUserDataMap) {
      userChallengeData = challengeUserDataMap.get(userAcct.account);
    }
  }
  let challengeDataRequestStatus;
  if (challengeID) {
    challengeDataRequestStatus = challengesFetching.get(challengeID.toString());
  }

  return {
    challengeData,
    userChallengeData,
    challengeDataRequestStatus,
    user: userAcct,
    parameters,
    govtParameters,
    ...ownProps,
  };
};

export interface ChallengeTransactionsProps {
  transactions: any[];
}

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
    const votesFor = challenge.poll.votesFor;
    const votesAgainst = challenge.poll.votesFor;
    const percentFor = challenge.poll.votesFor.div(totalVotes).mul(100);
    const percentAgainst = challenge.poll.votesAgainst.div(totalVotes).mul(100);

    return (
      <ChallengeResolveCard
        challenger={challenge!.challenger.toString()}
        rewardPool={getFormattedTokenBalance(challenge!.rewardPool)}
        stake={getFormattedTokenBalance(challenge!.stake)}
        totalVotes={totalVotes.toString()}
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
