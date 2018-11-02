import * as React from "react";
import { compose } from "redux";
import { connect, DispatchProp } from "react-redux";
import styled from "styled-components";
import {
  canRequestAppeal,
  doesChallengeHaveAppeal,
  ChallengeData,
  EthAddress,
  UserChallengeData,
  WrappedChallengeData,
  NewsroomWrapper,
  didUserCommit,
} from "@joincivil/core";
import {
  ChallengeRequestAppealCard,
  ChallengeResults as ChallengeResultsComponent,
  ListingDetailPhaseCardComponentProps,
  PhaseWithExpiryProps,
  ChallengePhaseProps,
  ChallengeResultsProps,
  RequestAppealProps,
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import AppealDetail from "./AppealDetail";
import ChallengeCommitVote from "./ChallengeCommitVote";
import ChallengeRevealVote from "./ChallengeRevealVote";
import ChallengeRewardsDetail from "./ChallengeRewardsDetail";
import BigNumber from "bignumber.js";
import { State } from "../../redux/reducers";
import {
  makeGetChallengeState,
  makeGetAppealChallengeState,
  makeGetListingAddressByChallengeID,
  makeGetUserChallengeData,
  makeGetUserAppealChallengeData,
  getNewsroom,
  getIsMemberOfAppellate,
} from "../../selectors";
import { fetchAndAddChallengeData } from "../../redux/actionCreators/challenges";
import { fetchSalt } from "../../helpers/salt";
import { ChallengeContainerProps, connectChallengeResults } from "../utility/HigherOrderComponents";
import { fetchVote } from "../../helpers/vote";

const withChallengeResults = (
  WrappedComponent: React.ComponentType<
    ListingDetailPhaseCardComponentProps &
      PhaseWithExpiryProps &
      ChallengePhaseProps &
      ChallengeResultsProps &
      RequestAppealProps
  >,
) => {
  return compose<
    React.ComponentType<
      ListingDetailPhaseCardComponentProps &
        PhaseWithExpiryProps &
        ChallengePhaseProps &
        ChallengeContainerProps &
        RequestAppealProps
    >
  >(connectChallengeResults)(WrappedComponent);
};

const StyledChallengeResults = styled.div`
  width: 460px;
`;

export interface ChallengeDetailContainerProps {
  listingAddress: EthAddress;
  challengeData?: WrappedChallengeData;
  challengeID: BigNumber;
  appealChallengeID?: BigNumber;
  showNotFoundMessage?: boolean;
  listingPhaseState?: any;
}

export interface ChallengeContainerReduxProps {
  newsroom?: NewsroomWrapper;
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
  txIdToConfirm?: number;
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
  txIdToConfirm?: number;
  newsroom: NewsroomWrapper;
}

export interface ChallengeVoteState {
  isReviewVoteModalOpen?: boolean;
  voteOption?: string;
  salt?: string;
  numTokens?: string;
  requestAppealSummaryValue?: string;
  requestAppealCiteConstitutionValue?: any;
  requestAppealDetailsValue?: any;
}

export interface ProgressModalPropsState {
  isWaitingTransactionModalOpen?: boolean;
  isTransactionProgressModalOpen?: boolean;
  isTransactionSuccessModalOpen?: boolean;
  isTransactionErrorModalOpen?: boolean;
  isTransactionRejectionModalOpen?: boolean;
  transactionIndex?: number;
}

// A container encapsultes the Commit Vote, Reveal Vote and Rewards phases for a Challenge.
// @TODO(jon): Clean this up... by maybe separating into separate containers for each phase card component
class ChallengeDetail extends React.Component<ChallengeDetailProps, ChallengeVoteState & ProgressModalPropsState> {
  constructor(props: any) {
    super(props);
    const fetchedVote = fetchVote(this.props.challengeID, this.props.user);
    let voteOption;
    if (fetchedVote) {
      voteOption = fetchedVote.toString();
    }
    this.state = {
      isReviewVoteModalOpen: false,
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
        balance={this.props.balance || new BigNumber(0)}
        votingBalance={this.props.votingBalance || new BigNumber(0)}
        user={this.props.user}
        isMemberOfAppellate={this.props.isMemberOfAppellate}
        txIdToConfirm={this.props.txIdToConfirm}
      />
    );
  }

  private renderCommitStage(): JSX.Element | null {
    return <ChallengeCommitVote {...this.props} />;
  }

  private renderRevealStage(): JSX.Element | null {
    return <ChallengeRevealVote {...this.props} />;
  }

  private renderRequestAppealStage(): JSX.Element {
    const challenge = this.props.challenge;
    const endTime = challenge.requestAppealExpiry.toNumber();
    const phaseLength = this.props.govtParameters.requestAppealLen;
    const ChallengeRequestAppeal = withChallengeResults(ChallengeRequestAppealCard);
    const requestAppealURI = `/listing/${this.props.listingAddress}/request-appeal`;

    return (
      <>
        <ChallengeRequestAppeal
          challengeID={this.props.challengeID.toString()}
          endTime={endTime}
          phaseLength={phaseLength}
          challenger={challenge!.challenger.toString()}
          rewardPool={getFormattedTokenBalance(challenge!.rewardPool)}
          stake={getFormattedTokenBalance(challenge!.stake)}
          requestAppealURI={requestAppealURI}
        />
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
        txIdToConfirm={this.props.txIdToConfirm}
      />
    );
  }

  private renderNoChallengeFound = (): JSX.Element => {
    return <>This is not the challenge that you're looking for.</>;
  };
}

const makeMapStateToProps = () => {
  const getChallengeState = makeGetChallengeState();
  const getAppealChallengeState = makeGetAppealChallengeState();
  const getListingAddressByChallengeID = makeGetListingAddressByChallengeID();
  const getUserChallengeData = makeGetUserChallengeData();
  const getUserAppealChallengeData = makeGetUserAppealChallengeData();

  const mapStateToProps = (
    state: State,
    ownProps: ChallengeDetailContainerProps,
  ): ChallengeContainerReduxProps & ChallengeDetailContainerProps => {
    const {
      challengesFetching,
      user,
      parameters,
      govtParameters,
      councilMultisigTransactions,
    } = state.networkDependent;
    let txIdToConfirm;
    const challengeData = ownProps.challengeData;
    if (
      challengeData &&
      challengeData.challenge &&
      challengeData.challenge.appeal &&
      challengeData.challenge.appeal.appealTxData
    ) {
      const txData = challengeData.challenge.appeal.appealTxData.data!;
      const key = txData.substring(0, 74);
      if (councilMultisigTransactions.has(key)) {
        txIdToConfirm = councilMultisigTransactions.get(key).id;
      }
    }
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
      txIdToConfirm,
      ...ownProps,
    };
  };

  return mapStateToProps;
};

export default connect(makeMapStateToProps)(ChallengeContainer);
