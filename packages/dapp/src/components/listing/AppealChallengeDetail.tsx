import * as React from "react";
import {
  isAppealChallengeInCommitStage,
  isAppealChallengeInRevealStage,
  AppealData,
  AppealChallengeData,
  ChallengeData,
  TwoStepEthTransaction,
  EthAddress,
  NewsroomWrapper,
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
  ReviewVote,
  ReviewVoteProps,
} from "@joincivil/components";
import { commitVote, approveVotingRights, revealVote, updateStatus } from "../../apis/civilTCR";
import { fetchSalt } from "../../helpers/salt";
import { fetchVote, saveVote } from "../../helpers/vote";

export enum ModalContentEventNames {
  APPROVE_VOTING_RIGHTS = "APPROVE_VOTING_RIGHTS",
  COMMIT_VOTE = "COMMIT_VOTE",
  REVEAL_VOTE = "REVEAL_VOTE",
  RESOLVE = "RESOLVE",
}

export interface AppealChallengeDetailProps {
  listingAddress: EthAddress;
  newsroom?: NewsroomWrapper;
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
  isReviewVoteModalOpen: boolean;
}

class AppealChallengeDetail extends React.Component<AppealChallengeDetailProps, ChallengeVoteState> {
  constructor(props: AppealChallengeDetailProps) {
    super(props);
    const fetchedVote = fetchVote(this.props.appealChallengeID, this.props.user);
    let voteOption;
    if (fetchedVote) {
      voteOption = fetchedVote.toString();
    }
    this.state = {
      voteOption,
      salt: fetchSalt(this.props.appealChallengeID, this.props.user), // TODO(jorgelo): This should probably be in redux.
      isReviewVoteModalOpen: false,
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
      <>
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
          onReviewVote={this.handleReviewVote}
          appealChallengeID={this.props.appealChallengeID.toString()}
          appealGranted={this.props.appeal.appealGranted}
        />
        {this.renderReviewVoteModal()}
      </>
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
        voteOption={this.state.voteOption}
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

  private renderReviewVoteModal(): JSX.Element {
    const { challenge } = this.props;
    const approveVotingRightsProgressModal = this.getApproveVotingRightsProgressModal();
    const commitVoteProgressModal = this.getCommitVoteProgressModal();
    const modalContentComponents = {
      [ModalContentEventNames.APPROVE_VOTING_RIGHTS]: approveVotingRightsProgressModal,
      [ModalContentEventNames.COMMIT_VOTE]: commitVoteProgressModal,
    };
    const transactions = [
      {
        transaction: this.approveVotingRights,
        progressEventName: ModalContentEventNames.APPROVE_VOTING_RIGHTS,
      },
      {
        transaction: this.commitVoteOnChallenge,
        progressEventName: ModalContentEventNames.COMMIT_VOTE,
      },
    ];

    const listingDetailURL = `https://${window.location.hostname}/listing/${this.props.listingAddress}`;

    const props: ReviewVoteProps = {
      newsroomName: (this.props.newsroom && this.props.newsroom.data.name) || "this newsroom",
      listingDetailURL,
      challengeID: this.props.appealChallengeID.toString(),
      open: this.state.isReviewVoteModalOpen,
      salt: this.state.salt,
      numTokens: this.state.numTokens,
      voteOption: this.state.voteOption,
      userAccount: this.props.user,
      commitEndDate: challenge.poll.commitEndDate.toNumber(),
      revealEndDate: challenge.poll.revealEndDate.toNumber(),
      transactions,
      modalContentComponents,
      postExecuteTransactions: this.closeReviewVoteModal,
      handleClose: this.closeReviewVoteModal,
    };

    return <ReviewVote {...props} />;
  }

  private getApproveVotingRightsProgressModal = (): JSX.Element => {
    return (
      <>
        <LoadingIndicator height={100} />
        <ModalHeading>Transactions in progress</ModalHeading>
        <ModalOrderedList>
          <ModalListItem type={ModalListItemTypes.STRONG}>Approving Voting Contract</ModalListItem>
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
          <ModalListItem>Approving Voting Contract</ModalListItem>
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

  private approveVotingRights = async (): Promise<TwoStepEthTransaction<any> | void> => {
    const numTokens: BigNumber = new BigNumber((this.state.numTokens as string).replace(",", "")).mul(1e18);
    return approveVotingRights(numTokens);
  };

  private commitVoteOnChallenge = async (): Promise<TwoStepEthTransaction<any>> => {
    const voteOption: BigNumber = new BigNumber(this.state.voteOption as string);
    const salt: BigNumber = new BigNumber(this.state.salt as string);
    const numTokens: BigNumber = new BigNumber((this.state.numTokens as string).replace(",", "")).mul(1e18);
    saveVote(this.props.appealChallengeID, this.props.user, voteOption);
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

  private handleReviewVote = () => {
    this.setState({ isReviewVoteModalOpen: true });
  };

  private closeReviewVoteModal = () => {
    this.setState({ isReviewVoteModalOpen: false });
  };
}

export default AppealChallengeDetail;
