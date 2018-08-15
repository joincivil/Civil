import * as React from "react";
import { compose } from "redux";
import { connect, DispatchProp } from "react-redux";
import styled from "styled-components";
import {
  canRequestAppeal,
  // didChallengeSucceed,
  doesChallengeHaveAppeal,
  ChallengeData,
  EthAddress,
  TwoStepEthTransaction,
  UserChallengeData,
  WrappedChallengeData,
  NewsroomWrapper,
  didUserCommit,
} from "@joincivil/core";
import {
  ChallengeCommitVoteCard,
  ChallengeRevealVoteCard,
  ChallengeRequestAppealCard,
  ChallengeResults as ChallengeResultsComponent,
  LoadingIndicator,
  ModalHeading,
  ModalContent,
  ModalOrderedList,
  ModalListItem,
  ModalListItemTypes,
  ListingDetailPhaseCardComponentProps,
  PhaseWithExpiryProps,
  ChallengePhaseProps,
  ChallengeResultsProps,
  ReviewVote,
  ReviewVoteProps,
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import AppealDetail from "./AppealDetail";
import ChallengeRewardsDetail from "./ChallengeRewardsDetail";
import { appealChallenge, approveForAppeal, commitVote, requestVotingRights, revealVote } from "../../apis/civilTCR";
import BigNumber from "bignumber.js";
import { State } from "../../reducers";
import { makeGetChallengeState, getNewsroom } from "../../selectors";
import { fetchAndAddChallengeData } from "../../actionCreators/challenges";
import { fetchSalt } from "../../helpers/salt";
import { ChallengeContainerProps, connectChallengeResults } from "../utility/HigherOrderComponents";

const withChallengeResults = (
  WrappedComponent: React.ComponentType<
    ListingDetailPhaseCardComponentProps & PhaseWithExpiryProps & ChallengePhaseProps & ChallengeResultsProps
  >,
) => {
  return compose<
    React.ComponentType<
      ListingDetailPhaseCardComponentProps & PhaseWithExpiryProps & ChallengePhaseProps & ChallengeContainerProps
    >
  >(connectChallengeResults)(WrappedComponent);
};

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

export interface ChallengeDetailContainerProps {
  listingAddress: EthAddress;
  challengeID: BigNumber;
  showNotFoundMessage?: boolean;
  listingPhaseState?: any;
}

export interface ChallengeContainerReduxProps {
  newsroom?: NewsroomWrapper;
  challengeData?: WrappedChallengeData;
  userChallengeData?: UserChallengeData;
  userAppealChallengeData?: UserChallengeData;
  challengeDataRequestStatus?: any;
  challengeState: any;
  user: EthAddress;
  balance: BigNumber;
  parameters: any;
  govtParameters: any;
  isMemberOfAppellate: boolean;
}

export interface ChallengeDetailProps {
  listingAddress: EthAddress;
  challengeID: BigNumber;
  challenge: ChallengeData;
  challengeState: any;
  parameters?: any;
  govtParameters?: any;
  userChallengeData?: UserChallengeData;
  userAppealChallengeData?: UserChallengeData;
  user: EthAddress;
  balance?: BigNumber;
  isMemberOfAppellate: boolean;
  newsroom: NewsroomWrapper;
}

export interface ChallengeVoteState {
  isReviewVoteModalOpen: boolean;
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
      isReviewVoteModalOpen: false,
      voteOption: undefined,
      salt: fetchSalt(this.props.challengeID, this.props.user), // TODO(jorgelo): This should probably be in redux.
      numTokens: undefined,
    };
  }

  public render(): JSX.Element {
    const { challenge, userChallengeData, userAppealChallengeData } = this.props;
    const { inChallengePhase, inRevealPhase } = this.props.challengeState;
    const appealExists = doesChallengeHaveAppeal(challenge);
    const canShowResult = challenge.resolved;

    const canShowRewardsForm = didUserCommit(userChallengeData) && challenge.resolved;

    const canShowAppealChallengeRewardsFrom =
      didUserCommit(userAppealChallengeData) && challenge.appeal!.appealChallenge!.resolved;
    return (
      <>
        {inChallengePhase && this.renderCommitStage()}
        {inRevealPhase && this.renderRevealStage()}
        {canRequestAppeal(challenge) && this.renderRequestAppealStage()}
        {canShowResult && this.renderVoteResult()}
        {appealExists && this.renderAppeal()}
        {canShowRewardsForm && !inChallengePhase && !inRevealPhase && this.renderRewardsDetail()}
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
        challengeID={this.props.challengeID}
        challenge={challenge}
        challengeState={this.props.challengeState}
        govtParameters={this.props.govtParameters}
        tokenBalance={(this.props.balance && this.props.balance.toNumber()) || 0}
        user={this.props.user}
        isMemberOfCouncil={this.props.isMemberOfAppellate}
      />
    );
  }

  private renderCommitStage(): JSX.Element | null {
    const endTime = this.props.challenge.poll.commitEndDate.toNumber();
    const phaseLength = this.props.parameters.commitStageLen;
    const challenge = this.props.challenge;
    const tokenBalance = this.props.balance ? this.props.balance.toNumber() : 0;
    const userHasCommittedVote = this.props.userChallengeData && !!this.props.userChallengeData.didUserCommit;

    if (!challenge) {
      return null;
    }

    return (
      <>
        <ChallengeCommitVoteCard
          endTime={endTime}
          phaseLength={phaseLength}
          challenger={challenge!.challenger.toString()}
          challengeID={this.props.challengeID.toString()}
          rewardPool={getFormattedTokenBalance(challenge!.rewardPool)}
          stake={getFormattedTokenBalance(challenge!.stake)}
          userHasCommittedVote={userHasCommittedVote}
          onInputChange={this.updateCommitVoteState}
          onReviewVote={this.handleReviewVote}
          tokenBalance={tokenBalance}
          salt={this.state.salt}
          numTokens={this.state.numTokens}
        />
        {this.renderReviewVoteModal()}
      </>
    );
  }

  private renderRequestVotingRightsProgress(): JSX.Element {
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
  }

  private renderCommitVoteProgress(): JSX.Element {
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
  }

  private renderRevealStage(): JSX.Element | null {
    const endTime = this.props.challenge.poll.revealEndDate.toNumber();
    const phaseLength = this.props.parameters.revealStageLen;
    const challenge = this.props.challenge;
    const userHasRevealedVote = this.props.userChallengeData && !!this.props.userChallengeData.didUserReveal;
    const userHasCommittedVote = this.props.userChallengeData && !!this.props.userChallengeData.didUserCommit;
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
        challengeID={this.props.challengeID.toString()}
        endTime={endTime}
        phaseLength={phaseLength}
        challenger={challenge!.challenger.toString()}
        rewardPool={getFormattedTokenBalance(challenge!.rewardPool)}
        stake={getFormattedTokenBalance(challenge!.stake)}
        salt={this.state.salt}
        onInputChange={this.updateCommitVoteState}
        userHasRevealedVote={userHasRevealedVote}
        userHasCommittedVote={userHasCommittedVote}
        modalContentComponents={modalContentComponents}
        transactions={transactions}
      />
    );
  }

  private renderRevealVoteProgressModal(): JSX.Element {
    return (
      <>
        <LoadingIndicator height={100} />
        <ModalHeading>Transaction in progress</ModalHeading>
        <ModalOrderedList>
          <ModalListItem type={ModalListItemTypes.STRONG}>Revealing Vote</ModalListItem>
        </ModalOrderedList>
        <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
        <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
      </>
    );
  }

  private renderRequestAppealStage(): JSX.Element {
    const challenge = this.props.challenge;
    const endTime = challenge.requestAppealExpiry.toNumber();
    const phaseLength = this.props.govtParameters.requestAppealLen;
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

    const ChallengeRequestAppeal = withChallengeResults(ChallengeRequestAppealCard);

    return (
      <ChallengeRequestAppeal
        challengeID={this.props.challengeID.toString()}
        endTime={endTime}
        phaseLength={phaseLength}
        challenger={challenge!.challenger.toString()}
        rewardPool={getFormattedTokenBalance(challenge!.rewardPool)}
        stake={getFormattedTokenBalance(challenge!.stake)}
        modalContentComponents={modalContentComponents}
        transactions={transactions}
      />
    );
  }

  private renderApproveForAppealProgressModal(): JSX.Element {
    return (
      <>
        <LoadingIndicator height={100} />
        <ModalHeading>Transaction in progress</ModalHeading>
        <ModalOrderedList>
          <ModalListItem type={ModalListItemTypes.STRONG}>Approving for Request Appeal</ModalListItem>
          <ModalListItem type={ModalListItemTypes.FADED}>Requesting Appeal</ModalListItem>
        </ModalOrderedList>
        <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
        <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
      </>
    );
  }

  private renderRequestAppealProgressModal(): JSX.Element {
    return (
      <>
        <LoadingIndicator height={100} />
        <ModalHeading>Transactions in progress</ModalHeading>
        <ModalOrderedList>
          <ModalListItem>Approving for Request Appeal</ModalListItem>
          <ModalListItem type={ModalListItemTypes.STRONG}>Requesting Appeal</ModalListItem>
        </ModalOrderedList>
        <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
        <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
      </>
    );
  }

  private renderVoteResult(): JSX.Element {
    const ChallengeResults = compose<React.ComponentType<ChallengeContainerProps>>(connectChallengeResults)(
      ChallengeResultsComponent,
    );

    return (
      <StyledChallengeResults>
        <ChallengeResults challengeID={this.props.challengeID} />
      </StyledChallengeResults>
    );
  }
  private renderRewardsDetail(): JSX.Element {
    return (
      <ChallengeRewardsDetail
        challengeID={this.props.challengeID}
        challenge={this.props.challenge}
        user={this.props.user}
        userChallengeData={this.props.userChallengeData}
      />
    );
  }
  private renderAppealChallengeRewardsDetail(): JSX.Element {
    return (
      <ChallengeRewardsDetail
        challengeID={this.props.challenge.appeal!.appealChallengeID}
        appealChallenge={this.props.challenge.appeal!.appealChallenge}
        user={this.props.user}
        userChallengeData={this.props.userAppealChallengeData}
      />
    );
  }

  private renderReviewVoteModal(): JSX.Element {
    if (!this.props.parameters) {
      return <></>;
    }

    const { challenge } = this.props;
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

    const listingDetailURL = `/listing/${this.props.listingAddress}`;

    const props: ReviewVoteProps = {
      newsroomName: this.props.newsroom && this.props.newsroom.data.name,
      listingDetailURL,
      challengeID: this.props.challengeID.toString(),
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

  private handleReviewVote = () => {
    this.setState({ isReviewVoteModalOpen: true });
  };

  private closeReviewVoteModal = () => {
    this.setState({ isReviewVoteModalOpen: false });
  };

}

class ChallengeContainer extends React.Component<
  ChallengeDetailContainerProps & ChallengeContainerReduxProps & DispatchProp<any>
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
        newsroom={this.props.newsroom!}
        listingAddress={this.props.listingAddress}
        challengeID={this.props.challengeID}
        challenge={challenge}
        userChallengeData={this.props.userChallengeData}
        userAppealChallengeData={this.props.userAppealChallengeData}
        challengeState={this.props.challengeState}
        user={this.props.user}
        parameters={this.props.parameters}
        govtParameters={this.props.govtParameters}
        isMemberOfAppellate={this.props.isMemberOfAppellate}
      />
    );
  }

  private renderNoChallengeFound = (): JSX.Element => {
    return <>This is not the challenge that you're looking for.</>;
  };
}

const makeMapStateToProps = () => {
  const getChallengeState = makeGetChallengeState();

  const mapStateToProps = (
    state: State,
    ownProps: ChallengeDetailContainerProps,
  ): ChallengeContainerReduxProps & ChallengeDetailContainerProps => {
    const {
      challenges,
      challengesFetching,
      challengeUserData,
      appealChallengeUserData,
      user,
      parameters,
      govtParameters,
      appellateMembers,
    } = state.networkDependent;
    let listingAddress = ownProps.listingAddress;
    let challengeData;
    let userChallengeData;
    let userAppealChallengeData;
    const newsroomState = getNewsroom(state, ownProps);
    const challengeID = ownProps.challengeID;
    if (challengeID) {
      challengeData = challenges.get(challengeID.toString());
    }
    if (!listingAddress && challengeData) {
      listingAddress = challenges.get(challengeID.toString())!.listingAddress;
    }
    const userAcct = user.account;

    let newsroomWrapper;
    if (newsroomState) {
      newsroomWrapper = newsroomState.wrapper;
    }

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
    const isMemberOfAppellate = appellateMembers.includes(userAcct.account);
    return {
      newsroom: newsroomWrapper,
      challengeData,
      userChallengeData,
      userAppealChallengeData,
      challengeState: getChallengeState(state, ownProps),
      challengeDataRequestStatus,
      user: userAcct.account,
      balance: user.account.balance,
      parameters,
      govtParameters,
      isMemberOfAppellate,
      ...ownProps,
    };
  };

  return mapStateToProps;
};

export default connect(makeMapStateToProps)(ChallengeContainer);
