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
  LoadingIndicator,
  ModalHeading,
  ModalContent,
} from "@joincivil/components";
import AppealDetail from "./AppealDetail";
import ChallengeRewardsDetail from "./ChallengeRewardsDetail";
import {
  appealChallenge,
  approveForAppeal,
  commitVote,
  requestVotingRights,
  revealVote,
  updateStatus,
} from "../../apis/civilTCR";
import BigNumber from "bignumber.js";
import { State } from "../../reducers";
import { fetchAndAddChallengeData } from "../../actionCreators/challenges";
import { getFormattedTokenBalance } from "@joincivil/utils";
import styled from "styled-components";

enum ModalContentEventNames {
  IN_PROGRESS_REQUEST_VOTING_RIGHTS = "IN_PROGRESS:REQUEST_VOTING_RIGHTS",
  IN_PROGRESS_COMMIT_VOTE = "IN_PROGRESS:COMMIT_VOTE",
  IN_PROGRESS_REVEAL_VOTE = "IN_PROGRESS:REVEAL_VOTE",
  IN_PROGRESS_RESOLVE_CHALLENGE = "IN_PROGRESS:RESOLVE_CHALLENGE",
  IN_PROGRESS_APPROVE_FOR_APPEAL = "IN_PROGRESS:APPROVE_FOR_APPEAL",
  IN_PROGRESS_REQUEST_APPEAL = "IN_PROGRESS:REQUEST_APPEAL",
}

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
    const userHasCommittedVote = this.props.userChallengeData && !!this.props.userChallengeData.didUserCommit;
    const requestVotingRightsProgressModal = this.renderRequestVotingRightsProgress();
    const commitVoteProgressModal = this.renderCommitVoteProgress();
    const modalContentComponents = {
      [ModalContentEventNames.IN_PROGRESS_REQUEST_VOTING_RIGHTS]: requestVotingRightsProgressModal,
      [ModalContentEventNames.IN_PROGRESS_COMMIT_VOTE]: commitVoteProgressModal,
    };
    const transactions = [
      {
        transaction: this.requestVotingRights,
        progressEventName: ModalContentEventNames.IN_PROGRESS_REQUEST_VOTING_RIGHTS,
      },
      {
        transaction: this.commitVoteOnChallenge,
        progressEventName: ModalContentEventNames.IN_PROGRESS_COMMIT_VOTE,
      },
    ];

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
        userHasCommittedVote={userHasCommittedVote}
        onInputChange={this.updateCommitVoteState}
        tokenBalance={tokenBalance}
        salt={this.state.salt}
        numTokens={this.state.numTokens}
        transactions={transactions}
        modalContentComponents={modalContentComponents}
      />
    );
  }

  private renderRequestVotingRightsProgress(): JSX.Element {
    return (
      <>
        <LoadingIndicator height={100} />
        <ModalHeading>Transaction in progress... Requesting Voting Rights</ModalHeading>
        <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
        <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
      </>
    );
  }

  private renderCommitVoteProgress(): JSX.Element {
    return (
      <>
        <LoadingIndicator height={100} />
        <ModalHeading>Transaction in progress... Committing Vote</ModalHeading>
        <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
        <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
      </>
    );
  }

  private renderRevealStage(): JSX.Element | null {
    const endTime = this.props.challenge.poll.revealEndDate.toNumber();
    const phaseLength = this.props.parameters.revealStageLen;
    const challenge = this.props.challenge;
    const revealVoteProgressModal = this.renderRevealVoteProgressModal();
    const modalContentComponents = {
      [ModalContentEventNames.IN_PROGRESS_REVEAL_VOTE]: revealVoteProgressModal,
    };
    const transactions = [
      { transaction: this.revealVoteOnChallenge, progressEventName: ModalContentEventNames.IN_PROGRESS_REVEAL_VOTE },
    ];

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
        modalContentComponents={modalContentComponents}
        transactions={transactions}
      />
    );
  }

  private renderRevealVoteProgressModal(): JSX.Element {
    return (
      <>
        <LoadingIndicator height={100} />
        <ModalHeading>Transaction in progress... Revealing your vote</ModalHeading>
        <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
        <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
      </>
    );
  }

  private renderRequestAppealStage(): JSX.Element {
    const challenge = this.props.challenge;
    const endTime = this.props.challenge.requestAppealExpiry.toNumber();
    const phaseLength = this.props.govtParameters.requestAppealLen;
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
    const approveForAppealProgressModal = this.renderApproveForAppealProgressModal();
    const requestAppealProgressModal = this.renderRequestAppealProgressModal();
    const modalContentComponents = {
      [ModalContentEventNames.IN_PROGRESS_APPROVE_FOR_APPEAL]: approveForAppealProgressModal,
      [ModalContentEventNames.IN_PROGRESS_REQUEST_APPEAL]: requestAppealProgressModal,
    };
    const transactions = [
      {
        transaction: approveForAppeal,
        progressEventName: ModalContentEventNames.IN_PROGRESS_APPROVE_FOR_APPEAL,
      },
      {
        transaction: this.appeal,
        progressEventName: ModalContentEventNames.IN_PROGRESS_REQUEST_APPEAL,
      },
    ];

    return (
      <ChallengeRequestAppealCard
        endTime={endTime}
        phaseLength={phaseLength}
        totalVotes={totalVotes}
        votesFor={votesFor}
        votesAgainst={votesAgainst}
        percentFor={percentFor}
        percentAgainst={percentAgainst}
        modalContentComponents={modalContentComponents}
        transactions={transactions}
      />
    );
  }

  private renderApproveForAppealProgressModal(): JSX.Element {
    return (
      <>
        <LoadingIndicator height={100} />
        <ModalHeading>Transaction is in progress... Approving for Request</ModalHeading>
        <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
        <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
      </>
    );
  }

  private renderRequestAppealProgressModal(): JSX.Element {
    return (
      <>
        <LoadingIndicator height={100} />
        <ModalHeading>Transaction is in progress... Submitting Appeal</ModalHeading>
        <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
        <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
      </>
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
      />
    );
  }
  private renderAppealChallengeRewardsDetail(): JSX.Element {
    return (
      <ChallengeRewardsDetail
        challengeID={this.props.challenge.appeal!.appealChallengeID}
        user={this.props.user}
        userChallengeData={this.props.userAppealChallengeData}
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
  ChallengeContainerProps & ChallengeContainerReduxProps & DispatchProp<any>
> {
  public componentDidUpdate(nextProps: any): void {
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
    const resolveChallengeProgressModal = this.renderResolveChallengeProgressModal();
    const modalContentComponents = {
      [ModalContentEventNames.IN_PROGRESS_RESOLVE_CHALLENGE]: resolveChallengeProgressModal,
    };
    const transactions = [
      { transaction: this.resolve, progressEventName: ModalContentEventNames.IN_PROGRESS_RESOLVE_CHALLENGE },
    ];

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
        modalContentComponents={modalContentComponents}
        transactions={transactions}
      />
    );
  }

  private renderResolveChallengeProgressModal(): JSX.Element {
    return (
      <>
        <LoadingIndicator height={100} />
        <ModalHeading>Transaction is in progress... Resolving Challenge</ModalHeading>
        <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
        <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
      </>
    );
  }

  private resolve = async (): Promise<TwoStepEthTransaction<any>> => {
    return updateStatus(this.props.listingAddress);
  };
}

export const ChallengeResolve = connect(mapStateToProps)(ChallengeResolveContainer);

export default connect(mapStateToProps)(ChallengeContainer);
