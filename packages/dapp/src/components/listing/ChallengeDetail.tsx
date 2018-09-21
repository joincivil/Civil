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
  RequestAppealModal,
  RequestAppealProps,
  RequestAppealModalProps,
} from "@joincivil/components";
import { getFormattedTokenBalance, getReadableDuration } from "@joincivil/utils";
import { getCivil } from "../../helpers/civilInstance";
import AppealDetail from "./AppealDetail";
import ChallengeRewardsDetail from "./ChallengeRewardsDetail";
import { appealChallenge, approveForAppeal, commitVote, approveVotingRights, revealVote } from "../../apis/civilTCR";
import BigNumber from "bignumber.js";
import { State } from "../../reducers";
import {
  makeGetChallenge,
  makeGetChallengeState,
  makeGetAppealChallengeState,
  makeGetListingAddressByChallengeID,
  makeGetUserChallengeData,
  makeGetUserAppealChallengeData,
  getNewsroom,
  getIsMemberOfAppellate,
} from "../../selectors";
import { fetchAndAddChallengeData } from "../../actionCreators/challenges";
import { fetchSalt } from "../../helpers/salt";
import { ChallengeContainerProps, connectChallengeResults } from "../utility/HigherOrderComponents";
import { saveVote, fetchVote } from "../../helpers/vote";

const withChallengeResults = (
  WrappedComponent: React.ComponentType<
    ListingDetailPhaseCardComponentProps & PhaseWithExpiryProps & ChallengePhaseProps & ChallengeResultsProps & RequestAppealProps
  >,
) => {
  return compose<
    React.ComponentType<
      ListingDetailPhaseCardComponentProps & PhaseWithExpiryProps & ChallengePhaseProps & ChallengeContainerProps & RequestAppealProps
    >
  >(connectChallengeResults)(WrappedComponent);
};

enum ModalContentEventNames {
  IN_PROGRESS_APPROVE_VOTING_RIGHTS = "IN_PROGRESS:APPROVE_VOTING_RIGHTS",
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
  appealChallengeID?: BigNumber;
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
  appealChallengeState: any;
  user: EthAddress;
  balance: BigNumber;
  votingBalance: BigNumber;
  parameters: any;
  govtParameters: any;
  isMemberOfAppellate: boolean;
}

export interface ChallengeDetailProps {
  listingAddress: EthAddress;
  challengeID: BigNumber;
  challenge: ChallengeData;
  challengeState: any;
  appealChallengeID?: BigNumber;
  appealChallengeState: any;
  parameters?: any;
  govtParameters?: any;
  userChallengeData?: UserChallengeData;
  userAppealChallengeData?: UserChallengeData;
  user: EthAddress;
  balance?: BigNumber;
  votingBalance?: BigNumber;
  isMemberOfAppellate: boolean;
  newsroom: NewsroomWrapper;
}

export interface ChallengeVoteState {
  isReviewVoteModalOpen?: boolean;
  isRequestAppealModalOpen?: boolean;
  voteOption?: string;
  salt?: string;
  numTokens?: string;
  requestAppealSummaryValue?: string;
  requestAppealCiteConstitutionValue?: string;
  requestAppealDetailsValue?: string;
}

// A container encapsultes the Commit Vote, Reveal Vote and Rewards phases for a Challenge.
// @TODO(jon): Clean this up... by maybe separating into separate containers for each phase card component
class ChallengeDetail extends React.Component<ChallengeDetailProps, ChallengeVoteState> {
  constructor(props: any) {
    super(props);
    const fetchedVote = fetchVote(this.props.challengeID, this.props.user);
    let voteOption;
    if (fetchedVote) {
      voteOption = fetchedVote.toString();
    }
    this.state = {
      isReviewVoteModalOpen: false,
      isRequestAppealModalOpen: false,
      voteOption,
      salt: fetchSalt(this.props.challengeID, this.props.user), // TODO(jorgelo): This should probably be in redux.
      numTokens: undefined,
    };
  }

  public componentDidMount(): void {
    if (!this.state.numTokens && this.props.balance && this.props.votingBalance) {
      this.setInitNumTokens();
    }
  }

  public componentDidUpdate(prevProps: ChallengeDetailProps): void {
    if (!this.state.numTokens && (this.props.balance && this.props.votingBalance)) {
      this.setInitNumTokens();
    }
  }

  public render(): JSX.Element {
    const { challenge, userChallengeData, userAppealChallengeData } = this.props;
    const { inCommitPhase, inRevealPhase } = this.props.challengeState;
    const appealExists = doesChallengeHaveAppeal(challenge);
    const canShowResult = challenge.resolved;

    const canShowRewardsForm = didUserCommit(userChallengeData) && challenge.resolved;

    const canShowAppealChallengeRewardsFrom =
      didUserCommit(userAppealChallengeData) && challenge.appeal!.appealChallenge!.resolved;
    return (
      <>
        {inCommitPhase && this.renderCommitStage()}
        {inRevealPhase && this.renderRevealStage()}
        {canRequestAppeal(challenge) && this.renderRequestAppealStage()}
        {canShowResult && this.renderVoteResult()}
        {appealExists && this.renderAppeal()}
        {canShowRewardsForm && !inCommitPhase && !inRevealPhase && this.renderRewardsDetail()}
        {canShowAppealChallengeRewardsFrom && this.renderAppealChallengeRewardsDetail()}
      </>
    );
  }

  private setInitNumTokens(): void {
    let initNumTokens: BigNumber;
    if (!this.props.votingBalance!.isZero()) {
      initNumTokens = this.props.votingBalance!;
    } else {
      initNumTokens = this.props.balance!.add(this.props.votingBalance!);
    }
    const initNumTokensString = initNumTokens
      .div(1e18)
      .toFixed(2)
      .toString();
    this.setState(() => ({ numTokens: initNumTokensString }));
  }

  private renderAppeal(): JSX.Element {
    const challenge = this.props.challenge;
    return (
      <AppealDetail
        listingAddress={this.props.listingAddress}
        newsroom={this.props.newsroom}
        appeal={challenge.appeal!}
        challengeID={this.props.challengeID}
        challenge={challenge}
        userAppealChallengeData={this.props.userAppealChallengeData}
        challengeState={this.props.challengeState}
        parameters={this.props.parameters}
        govtParameters={this.props.govtParameters}
        tokenBalance={(this.props.balance && this.props.balance.toNumber()) || 0}
        user={this.props.user}
        isMemberOfAppellate={this.props.isMemberOfAppellate}
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

  private renderApproveVotingRightsProgress(): JSX.Element {
    return (
      <>
        <LoadingIndicator height={100} />
        <ModalHeading>Transactions in progress</ModalHeading>
        <ModalOrderedList>
          <ModalListItem type={ModalListItemTypes.STRONG}>Approving Voting Rights</ModalListItem>
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
    const secondaryPhaseLength = this.props.parameters.commitStageLen;
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
        secondaryPhaseLength={secondaryPhaseLength}
        challenger={challenge!.challenger.toString()}
        rewardPool={getFormattedTokenBalance(challenge!.rewardPool)}
        stake={getFormattedTokenBalance(challenge!.stake)}
        voteOption={this.state.voteOption}
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
    const ChallengeRequestAppeal = withChallengeResults(ChallengeRequestAppealCard);

    return (
      <>
        <ChallengeRequestAppeal
          challengeID={this.props.challengeID.toString()}
          endTime={endTime}
          phaseLength={phaseLength}
          challenger={challenge!.challenger.toString()}
          rewardPool={getFormattedTokenBalance(challenge!.rewardPool)}
          stake={getFormattedTokenBalance(challenge!.stake)}
          handleRequestAppeal={this.handleRequestAppeal}
        />
        {this.renderRequestAppealModal()}
      </>
    );
  }

  private renderRequestAppealModal(): JSX.Element {
    if (!this.props.parameters && !this.props.govtParameters) {
      return <></>;
    }

    const civil = getCivil();
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

    const constitutionURI = this.props.parameters.constitutionURI || "#";
    const governanceGuideUrl = "https://civil.co/#governance";
    const judgeAppealLen = getReadableDuration(civil.toBigNumber(this.props.govtParameters.judgeAppealLen));
    const appealFee = getFormattedTokenBalance(civil.toBigNumber(this.props.govtParameters.appealFee), true);
    const props: RequestAppealModalProps = {
      open: this.state.isRequestAppealModalOpen,
      constitutionURI,
      governanceGuideUrl,
      appealFee,
      judgeAppealLen,
      modalContentComponents,
      transactions,
      updateStatementValue: this.updateAppealStatement,
      postExecuteTransactions: this.closeRequestAppealModal,
      handleClose: this.closeRequestAppealModal,
    };
    return <RequestAppealModal {...props} />;

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
    const requestVotingRightsProgressModal = this.renderApproveVotingRightsProgress();
    const commitVoteProgressModal = this.renderCommitVoteProgress();
    const modalContentComponents = {
      [ModalContentEventNames.IN_PROGRESS_APPROVE_VOTING_RIGHTS]: requestVotingRightsProgressModal,
      [ModalContentEventNames.IN_PROGRESS_COMMIT_VOTE]: commitVoteProgressModal,
    };
    const transactions = [
      {
        transaction: this.approveVotingRights,
        progressEventName: ModalContentEventNames.IN_PROGRESS_APPROVE_VOTING_RIGHTS,
      },
      {
        transaction: this.commitVoteOnChallenge,
        progressEventName: ModalContentEventNames.IN_PROGRESS_COMMIT_VOTE,
      },
    ];

    const listingDetailURL = `https://${window.location.hostname}/listing/${this.props.listingAddress}`;

    const props: ReviewVoteProps = {
      newsroomName: this.props.newsroom && this.props.newsroom.data.name,
      listingDetailURL,
      challengeID: this.props.challengeID.toString(),
      open: this.state.isReviewVoteModalOpen!,
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

  private updateAppealStatement = (key: string, value: any): void => {
    const stateKey = `requestAppeal${key.charAt(0).toUpperCase()}${key.substring(1)}`;
    this.setState(() => ({ [stateKey]: value }));
  };

  private appeal = async (): Promise<TwoStepEthTransaction<any>> => {
    const summary = this.state.requestAppealSummaryValue;
    const citeConstitution = this.state.requestAppealCiteConstitutionValue;
    const details = this.state.requestAppealDetailsValue;
    const jsonToSave = { summary, citeConstitution, details };
    return appealChallenge(this.props.listingAddress, JSON.stringify(jsonToSave));
  };

  private approveVotingRights = async (): Promise<TwoStepEthTransaction<any> | void> => {
    const numTokens: BigNumber = new BigNumber(this.state.numTokens as string).mul(1e18);
    return approveVotingRights(numTokens);
  };

  private commitVoteOnChallenge = async (): Promise<TwoStepEthTransaction<any>> => {
    const voteOption: BigNumber = new BigNumber(this.state.voteOption as string);
    const salt: BigNumber = new BigNumber(this.state.salt as string);
    const numTokens: BigNumber = new BigNumber(this.state.numTokens as string).mul(1e18);
    saveVote(this.props.challengeID, this.props.user, voteOption);
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

  private closeRequestAppealModal = () => {
    this.setState({ isRequestAppealModalOpen: false });
  };

  private handleRequestAppeal = () => {
    this.setState({ isRequestAppealModalOpen: true });
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
        appealChallengeID={this.props.appealChallengeID}
        userAppealChallengeData={this.props.userAppealChallengeData}
        challengeState={this.props.challengeState}
        appealChallengeState={this.props.appealChallengeState}
        user={this.props.user}
        parameters={this.props.parameters}
        balance={this.props.balance}
        votingBalance={this.props.votingBalance}
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
  const getChallenge = makeGetChallenge();
  const getChallengeState = makeGetChallengeState();
  const getAppealChallengeState = makeGetAppealChallengeState();
  const getListingAddressByChallengeID = makeGetListingAddressByChallengeID();
  const getUserChallengeData = makeGetUserChallengeData();
  const getUserAppealChallengeData = makeGetUserAppealChallengeData();

  const mapStateToProps = (
    state: State,
    ownProps: ChallengeDetailContainerProps,
  ): ChallengeContainerReduxProps & ChallengeDetailContainerProps => {
    const { challengesFetching, user, parameters, govtParameters } = state.networkDependent;
    const challengeData = getChallenge(state, ownProps);
    const newsroomState = getNewsroom(state, ownProps);
    const challengeID = ownProps.challengeID;
    let listingAddress: string | undefined = ownProps.listingAddress;
    if (!listingAddress) {
      listingAddress = getListingAddressByChallengeID(state, ownProps);
    }
    const userAcct = user.account;

    let newsroomWrapper;
    if (newsroomState) {
      newsroomWrapper = newsroomState.wrapper;
    }

    const userChallengeData = getUserChallengeData(state, ownProps);
    const userAppealChallengeData = getUserAppealChallengeData(state, ownProps);

    let challengeDataRequestStatus;
    if (challengeID) {
      challengeDataRequestStatus = challengesFetching.get(challengeID.toString());
    }
    const isMemberOfAppellate = getIsMemberOfAppellate(state);

    return {
      newsroom: newsroomWrapper,
      challengeData,
      userChallengeData,
      userAppealChallengeData,
      challengeState: getChallengeState(state, ownProps),
      appealChallengeState: getAppealChallengeState(state, ownProps),
      challengeDataRequestStatus,
      user: userAcct.account,
      balance: user.account.balance,
      votingBalance: user.account.votingBalance,
      parameters,
      govtParameters,
      isMemberOfAppellate,
      ...ownProps,
    };
  };

  return mapStateToProps;
};

export default connect(makeMapStateToProps)(ChallengeContainer);
