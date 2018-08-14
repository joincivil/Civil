import * as React from "react";
import {
  isAppealChallengeInCommitStage,
  isAppealChallengeInRevealStage,
  AppealData,
  AppealChallengeData,
  ChallengeData,
  TwoStepEthTransaction,
  EthAddress,
} from "@joincivil/core";
import BigNumber from "bignumber.js";
import { getFormattedTokenBalance } from "@joincivil/utils";
import {
  AppealChallengeCommitVoteCard,
  AppealChallengeRevealVoteCard,
  AppealChallengeResolveCard,
  LoadingIndicator,
  ModalHeading,
  ModalContent,
  ModalOrderedList,
  ModalListItem,
  ModalListItemTypes,
} from "@joincivil/components";
import { commitVote, requestVotingRights, revealVote, updateStatus } from "../../apis/civilTCR";
import { fetchSalt } from "../../helpers/salt";

export enum ModalContentEventNames {
  REQUEST_VOTING_RIGHTS = "REQUEST_VOTING_RIGHTS",
  COMMIT_VOTE = "COMMIT_VOTE",
  REVEAL_VOTE = "REVEAL_VOTE",
  RESOLVE = "RESOLVE",
}

export interface AppealChallengeDetailProps {
  listingAddress: EthAddress;
  challengeID: BigNumber;
  challenge: ChallengeData;
  appealChallengeID: BigNumber;
  appealChallenge: AppealChallengeData;
  appeal: AppealData;
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
    return (
      <>
        {isAppealChallengeInCommitStage(challenge) && this.renderCommitStage()}
        {isAppealChallengeInRevealStage(challenge) && this.renderRevealStage()}
        {canResolveChallenge && this.renderResolveAppealChallenge()}
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

    const requestVotingRightsProgressModal = this.getRequestVotingRightsProgressModal();
    const commitVoteProgressModal = this.getCommitVoteProgressModal();
    const modalContentComponents = {
      [ModalContentEventNames.REQUEST_VOTING_RIGHTS]: requestVotingRightsProgressModal,
      [ModalContentEventNames.COMMIT_VOTE]: commitVoteProgressModal,
    };
    const transactions = [
      {
        transaction: this.requestVotingRights,
        progressEventName: ModalContentEventNames.REQUEST_VOTING_RIGHTS,
      },
      {
        transaction: this.commitVoteOnChallenge,
        progressEventName: ModalContentEventNames.COMMIT_VOTE,
      },
    ];
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
      <AppealChallengeCommitVoteCard
        endTime={endTime}
        phaseLength={phaseLength}
        challengeID={this.props.challengeID.toString()}
        challenger={challenger}
        rewardPool={rewardPool}
        stake={stake}
        totalVotes={getFormattedTokenBalance(totalVotes)}
        votesFor={votesFor}
        votesAgainst={votesAgainst}
        percentFor={percentFor.toString()}
        percentAgainst={percentAgainst.toString()}
        onInputChange={this.updateCommitVoteState}
        tokenBalance={this.props.tokenBalance}
        salt={this.state.salt}
        numTokens={this.state.numTokens}
        onReviewVote={(): void => {
          console.log("duh");
        }}
        transactions={transactions}
        modalContentComponents={modalContentComponents}
        appealChallengeID={this.props.appealChallengeID.toString()}
        appealGranted={this.props.appeal.appealGranted}
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

    const revealVoteProgressModal = this.getRevealVoteProgressModal();
    const modalContentComponents = {
      [ModalContentEventNames.REVEAL_VOTE]: revealVoteProgressModal,
    };
    const transactions = [
      {
        transaction: this.revealVoteOnChallenge,
        progressEventName: ModalContentEventNames.REVEAL_VOTE,
      },
    ];
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
      <AppealChallengeRevealVoteCard
        endTime={endTime}
        phaseLength={phaseLength}
        challengeID={this.props.challengeID.toString()}
        challenger={challenger}
        rewardPool={rewardPool}
        stake={stake}
        salt={this.state.salt}
        totalVotes={getFormattedTokenBalance(totalVotes)}
        votesFor={votesFor}
        votesAgainst={votesAgainst}
        percentFor={percentFor.toString()}
        percentAgainst={percentAgainst.toString()}
        onInputChange={this.updateCommitVoteState}
        modalContentComponents={modalContentComponents}
        transactions={transactions}
        appealChallengeID={this.props.appealChallengeID.toString()}
        appealGranted={this.props.appeal.appealGranted}
      />
    );
  }

  private renderResolveAppealChallenge(): JSX.Element {
    const appealGranted = this.props.appeal.appealGranted;
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

    const appealChallengeTotalVotes = this.props.appealChallenge.poll.votesAgainst.add(
      this.props.appealChallenge.poll.votesFor,
    );
    const appealChallengeVotesFor = getFormattedTokenBalance(this.props.appealChallenge.poll.votesFor);
    const appealChallengeVotesAgainst = getFormattedTokenBalance(this.props.appealChallenge.poll.votesAgainst);
    const appealChallengePercentFor = this.props.appealChallenge.poll.votesFor
      .div(appealChallengeTotalVotes)
      .mul(100)
      .toFixed(0);
    const appealChallengePercentAgainst = this.props.appealChallenge.poll.votesAgainst
      .div(appealChallengeTotalVotes)
      .mul(100)
      .toFixed(0);
    const challenger = challenge.challenger.toString();
    const rewardPool = getFormattedTokenBalance(challenge.rewardPool);
    const stake = getFormattedTokenBalance(challenge.stake);

    const resolveProgressModal = this.getResolveProgressModal();
    const modalContentComponents = {
      [ModalContentEventNames.RESOLVE]: resolveProgressModal,
    };

    const transactions = [
      {
        transaction: this.resolve,
        progressEventName: ModalContentEventNames.RESOLVE,
      },
    ];

    return (
      <AppealChallengeResolveCard
        challengeID={this.props.challengeID.toString()}
        challenger={challenger}
        rewardPool={rewardPool}
        stake={stake}
        appealChallengeID={this.props.appealChallengeID.toString()}
        appealGranted={appealGranted}
        modalContentComponents={modalContentComponents}
        transactions={transactions}
        totalVotes={getFormattedTokenBalance(totalVotes)}
        votesFor={votesFor}
        votesAgainst={votesAgainst}
        percentFor={percentFor.toString()}
        percentAgainst={percentAgainst.toString()}
        appealChallengeTotalVotes={getFormattedTokenBalance(appealChallengeTotalVotes)}
        appealChallengeVotesFor={appealChallengeVotesFor}
        appealChallengeVotesAgainst={appealChallengeVotesAgainst}
        appealChallengePercentFor={appealChallengePercentFor.toString()}
        appealChallengePercentAgainst={appealChallengePercentAgainst.toString()}
      />
    );
  }

  private getRequestVotingRightsProgressModal = (): JSX.Element => {
    return (
      <>
        <LoadingIndicator height={100} />
        <ModalHeading>Transactions in progress</ModalHeading>
        <ModalOrderedList>
          <ModalListItem type={ModalListItemTypes.STRONG}>Requesting Voting Rights</ModalListItem>
          <ModalListItem type={ModalListItemTypes.FADED}>Committing Vote</ModalListItem>
        </ModalOrderedList>
        <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
        <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
      </>
    );
  };

  private getCommitVoteProgressModal = (): JSX.Element => {
    return (
      <>
        <LoadingIndicator height={100} />
        <ModalHeading>Transactions in progress</ModalHeading>
        <ModalOrderedList>
          <ModalListItem>Requesting Voting Rights</ModalListItem>
          <ModalListItem type={ModalListItemTypes.STRONG}>Committing Vote</ModalListItem>
        </ModalOrderedList>
        <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
        <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
      </>
    );
  };

  private getRevealVoteProgressModal = (): JSX.Element => {
    return (
      <>
        <LoadingIndicator height={100} />
        <ModalHeading>Transactions in progress</ModalHeading>
        <ModalOrderedList>
          <ModalListItem type={ModalListItemTypes.STRONG}>Revealing Vote</ModalListItem>
        </ModalOrderedList>
        <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
        <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
      </>
    );
  };

  private getResolveProgressModal = (): JSX.Element => {
    return (
      <>
        <LoadingIndicator height={100} />
        <ModalHeading>Transactions in progress</ModalHeading>
        <ModalOrderedList>
          <ModalListItem type={ModalListItemTypes.STRONG}>Approving for Challenge</ModalListItem>
          <ModalListItem type={ModalListItemTypes.FADED}>Challenge Granted Appeal</ModalListItem>
        </ModalOrderedList>
        <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
        <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
      </>
    );
  };

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

  private resolve = async (): Promise<TwoStepEthTransaction<any>> => {
    return updateStatus(this.props.listingAddress);
  };
}

export default AppealChallengeDetail;
