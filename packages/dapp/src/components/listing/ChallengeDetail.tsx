import * as React from "react";
import { compose } from "redux";
import { connect, DispatchProp } from "react-redux";
import {
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
} from "@joincivil/components";
import AppealDetail from "./AppealDetail";
import ChallengeRewardsDetail from "./ChallengeRewardsDetail";
import { appealChallenge, approveForAppeal, commitVote, requestVotingRights, revealVote } from "../../apis/civilTCR";
import BigNumber from "bignumber.js";
import { State } from "../../reducers";
import { makeGetChallengeState } from "../../selectors";
import { fetchAndAddChallengeData } from "../../actionCreators/challenges";
import { getFormattedTokenBalance } from "@joincivil/utils";
import styled from "styled-components";
import { fetchSalt } from "../../helpers/salt";
import { ChallengeContainerProps, connectChallengeResults } from "../utility/HigherOrderComponents";

const withChallengeResults = (
  WrappedComponent: React.ComponentType<
    ListingDetailPhaseCardComponentProps & PhaseWithExpiryProps & ChallengePhaseProps & ChallengeResultsProps
  >,
) => {
  return compose<
    React.ComponentType<ListingDetailPhaseCardComponentProps & PhaseWithExpiryProps & ChallengeContainerProps>
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
  challengeData?: WrappedChallengeData | undefined;
  userChallengeData?: UserChallengeData | undefined;
  userAppealChallengeData?: UserChallengeData | undefined;
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
      salt: fetchSalt(this.props.challengeID, this.props.user), // TODO(jorgelo): This should probably be in redux.
      numTokens: undefined,
    };
  }

  public render(): JSX.Element {
    const challenge = this.props.challenge;
    const { inChallengePhase, inRevealPhase } = this.props.challengeState;
    const userChallengeData = this.props.userChallengeData;
    const userAppealChallengeData = this.props.userAppealChallengeData;
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
        challengeID={this.props.challengeID.toString()}
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
        challengeID={this.props.challengeID}
        endTime={endTime}
        phaseLength={phaseLength}
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
    const isMemberOfAppellate = appellateMembers.includes(userAcct.account);
    return {
      challengeData,
      userChallengeData,
      userAppealChallengeData,
      challengeState: getChallengeState(state, ownProps),
      challengeDataRequestStatus,
      user: userAcct,
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
