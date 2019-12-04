import * as React from "react";
import { compose } from "redux";
import { connect, DispatchProp } from "react-redux";
import { formatRoute } from "react-router-named-routes";
import styled from "styled-components/macro";
import {
  BigNumber,
  ChallengeData,
  EthAddress,
  UserChallengeData,
  NewsroomWrapper,
  WrappedChallengeData,
} from "@joincivil/typescript-types";
import {
  ChallengeRequestAppealCard,
  CompleteChallengeResults as CompleteChallengeResultsComponent,
  ListingDetailPhaseCardComponentProps,
  PhaseWithExpiryProps,
  ChallengePhaseProps,
  ChallengeResultsProps,
  RequestAppealProps,
} from "@joincivil/components";
import {
  urlConstants as links,
  challengeHelpers,
  userChallengeDataHelpers,
  USER_CHALLENGE_DATA_QUERY,
  transformGraphQLDataIntoSpecificUserChallenge,
} from "@joincivil/utils";

import AppealDetail from "./AppealDetail";
import ChallengeCommitVote from "./ChallengeCommitVote";
import ChallengeRevealVote from "./ChallengeRevealVote";
import ChallengeRewardsDetail from "./ChallengeRewardsDetail";

import { routes } from "../../constants";
import { State } from "../../redux/reducers";
import { getIsMemberOfAppellate, getChallengeState } from "../../selectors";
import { fetchAndAddGrantAppealTx } from "../../redux/actionCreators/challenges";
import {
  ChallengeContainerProps,
  connectChallengeResults,
  connectChallengePhase,
  connectParameters,
} from "../utility/HigherOrderComponents";
import { connectCompleteChallengeResults } from "../utility/CompleteChallengeResultsHOC";
import { Query } from "react-apollo";
import { CivilHelperContext, CivilHelper } from "../../apis/CivilHelper";

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
  >(
    connectChallengeResults,
    connectChallengePhase,
  )(WrappedComponent);
};

const StyledChallengeResults = styled.div`
  width: 460px;
`;

export interface ChallengeDetailContainerProps {
  listingAddress: EthAddress;
  newsroom?: NewsroomWrapper;
  challengeData?: WrappedChallengeData;
  challengeID: BigNumber;
  appealChallengeID?: BigNumber;
  showNotFoundMessage?: boolean;
  listingPhaseState?: any;
  onMobileTransactionClick?(): any;
}

export interface ChallengeContainerReduxProps {
  challengeState: any;
  appealChallengeState?: any;
  user: EthAddress;
  balance: BigNumber;
  votingBalance: BigNumber;
  govtParameters: any;
  isMemberOfAppellate: boolean;
  txIdToConfirm?: number;
  grantAppealTxDataFetching?: boolean;
  grantAppealTxData?: any;
}

export interface ChallengeDetailProps {
  listingAddress: EthAddress;
  newsroom?: NewsroomWrapper;
  challengeID: BigNumber;
  challenge: ChallengeData;
  challengeState: any;
  appealChallengeID?: BigNumber;
  appealChallengeState?: any;
  govtParameters?: any;
  userChallengeData?: UserChallengeData;
  userAppealChallengeData?: UserChallengeData;
  user: EthAddress;
  balance?: BigNumber;
  votingBalance?: BigNumber;
  isMemberOfAppellate: boolean;
  txIdToConfirm?: number;
  onMobileTransactionClick?(): any;
}

export interface ChallengeVoteState {
  isReviewVoteModalOpen?: boolean;
  voteOption?: string;
  numTokens?: string;
  salt?: string;
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
class ChallengeDetail extends React.Component<ChallengeDetailProps> {
  public render(): JSX.Element {
    const { challenge } = this.props;
    const { inCommitPhase, inRevealPhase } = this.props.challengeState;
    const appealExists = challengeHelpers.doesChallengeHaveAppeal(challenge);
    const canShowResult = challenge.resolved;

    const inCanRequestAppeal = challengeHelpers.canRequestAppeal(challenge);

    const renderState = {
      inCommitPhase,
      inRevealPhase,
      inCanRequestAppeal,
      canShowResult,
      appealExists,
    };

    if (!this.props.user) {
      return this.renderAllStages(renderState, {});
    }

    return (
      <Query
        query={USER_CHALLENGE_DATA_QUERY}
        variables={{ userAddr: this.props.user, pollID: this.props.challengeID.toString() }}
        pollInterval={30000}
      >
        {({ loading: userChallengeLoading, error: userChallengeError, data: userChallengeData }: any): JSX.Element => {
          if (userChallengeLoading || userChallengeError) {
            return this.renderAllStages(renderState);
          } else {
            const transformedUserChallengeData = transformGraphQLDataIntoSpecificUserChallenge(userChallengeData);
            if (challenge.appeal && challenge.appeal.appealChallenge) {
              return (
                <Query
                  query={USER_CHALLENGE_DATA_QUERY}
                  variables={{ userAddr: this.props.user, pollID: challenge.appeal.appealChallengeID.toString() }}
                  pollInterval={30000}
                >
                  {({
                    loading: userAppealChallengeLoading,
                    error: userAppealChallengeError,
                    data: userAppealChallengeData,
                  }: any): JSX.Element => {
                    if (userAppealChallengeLoading || userAppealChallengeError) {
                      return this.renderAllStages(renderState, transformedUserChallengeData);
                    } else {
                      const transformedUserAppealChallengeData = transformGraphQLDataIntoSpecificUserChallenge(
                        userAppealChallengeData,
                      );
                      return this.renderAllStages(
                        renderState,
                        transformedUserChallengeData,
                        transformedUserAppealChallengeData,
                      );
                    }
                  }}
                </Query>
              );
            } else {
              return this.renderAllStages(renderState, transformedUserChallengeData);
            }
          }
        }}
      </Query>
    );
  }

  private renderAllStages(
    renderState: any,
    userChallengeData?: UserChallengeData,
    userAppealChallengeData?: UserChallengeData,
  ): JSX.Element {
    const { inCommitPhase, inRevealPhase, inCanRequestAppeal, canShowResult, appealExists } = renderState;

    const canShowRewardsForm =
      userChallengeDataHelpers.didUserCommit(userChallengeData) && this.props.challenge.resolved;
    const canShowAppealChallengeRewardsFrom =
      userChallengeDataHelpers.didUserCommit(userAppealChallengeData) &&
      this.props.challenge.appeal!.appealChallenge!.resolved;

    return (
      <>
        {inCommitPhase && this.renderCommitStage(userChallengeData)}
        {inRevealPhase && this.renderRevealStage(userChallengeData)}
        {inCanRequestAppeal && this.renderRequestAppealStage()}
        {canShowResult && this.renderVoteResult()}
        {appealExists && this.renderAppeal(userAppealChallengeData)}
        {canShowRewardsForm && !inCommitPhase && !inRevealPhase && this.renderRewardsDetail(userChallengeData)}
        {canShowAppealChallengeRewardsFrom && this.renderAppealChallengeRewardsDetail(userAppealChallengeData)}
      </>
    );
  }

  private renderAppeal(userAppealChallengeData?: UserChallengeData): JSX.Element {
    const challenge = this.props.challenge;
    return (
      <AppealDetail
        listingAddress={this.props.listingAddress}
        newsroom={this.props.newsroom}
        appeal={challenge.appeal!}
        challengeID={this.props.challengeID}
        challenge={challenge}
        userAppealChallengeData={userAppealChallengeData}
        challengeState={this.props.challengeState}
        parameters={this.props.parameters}
        govtParameters={this.props.govtParameters}
        balance={this.props.balance || new BigNumber(0)}
        votingBalance={this.props.votingBalance || new BigNumber(0)}
        user={this.props.user}
        isMemberOfAppellate={this.props.isMemberOfAppellate}
        txIdToConfirm={this.props.txIdToConfirm}
        onMobileTransactionClick={this.props.onMobileTransactionClick}
      />
    );
  }

  private renderCommitStage(userChallengeData?: UserChallengeData): JSX.Element | null {
    if (userChallengeData) {
      return <ChallengeCommitVote {...this.props} key={this.props.user} userChallengeData={userChallengeData} />;
    } else {
      return <ChallengeCommitVote {...this.props} key={this.props.user} />;
    }
  }

  private renderRevealStage(userChallengeData?: UserChallengeData): JSX.Element | null {
    if (userChallengeData) {
      return <ChallengeRevealVote {...this.props} key={this.props.user} userChallengeData={userChallengeData} />;
    } else {
      return <ChallengeRevealVote {...this.props} key={this.props.user} />;
    }
  }

  private renderRequestAppealStage(): JSX.Element {
    const challenge = this.props.challenge;
    const endTime = challenge.requestAppealExpiry.toNumber();
    const phaseLength = this.props.govtParameters.requestAppealLen;
    const ChallengeRequestAppeal = withChallengeResults(ChallengeRequestAppealCard);
    const requestAppealURI = formatRoute(routes.REQUEST_APPEAL, { listingAddress: this.props.listingAddress });

    return (
      <>
        <ChallengeRequestAppeal
          challengeID={this.props.challengeID.toString()}
          endTime={endTime}
          phaseLength={phaseLength}
          requestAppealURI={requestAppealURI}
          faqURL={links.FAQ_COMMUNITY_VETTING_PROCESS}
          onMobileTransactionClick={this.props.onMobileTransactionClick}
        />
      </>
    );
  }

  private renderVoteResult(): JSX.Element {
    const ChallengeResults = compose<React.ComponentType<ChallengeContainerProps>>(connectCompleteChallengeResults)(
      CompleteChallengeResultsComponent,
    );

    return (
      <StyledChallengeResults>
        <ChallengeResults challengeID={this.props.challengeID} />
      </StyledChallengeResults>
    );
  }

  private renderRewardsDetail(userChallengeData?: UserChallengeData): JSX.Element {
    return (
      <ChallengeRewardsDetail
        challengeID={this.props.challengeID}
        challenge={this.props.challenge}
        user={this.props.user}
        userChallengeData={userChallengeData || this.props.userChallengeData}
      />
    );
  }

  private renderAppealChallengeRewardsDetail(userAppealChallengeData?: UserChallengeData): JSX.Element {
    return (
      <ChallengeRewardsDetail
        challengeID={this.props.challenge.appeal!.appealChallengeID}
        appealChallenge={this.props.challenge.appeal!.appealChallenge}
        user={this.props.user}
        userChallengeData={userAppealChallengeData || this.props.userAppealChallengeData}
      />
    );
  }
}

class ChallengeContainer extends React.Component<
  ChallengeDetailContainerProps & ChallengeContainerReduxProps & DispatchProp<any>
> {
  public static contextType = CivilHelperContext;
  public context: CivilHelper;

  public componentDidUpdate(): void {
    if (!this.props.challengeData) {
      console.error("ChallengeDetail without challenge data. challengeID: ", this.props.challengeID);
    }
    if (!this.props.grantAppealTxData && !this.props.grantAppealTxDataFetching) {
      this.props.dispatch!(fetchAndAddGrantAppealTx(this.context, this.props.listingAddress));
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
        newsroom={this.props.newsroom}
        challengeID={this.props.challengeID}
        challenge={challenge}
        appealChallengeID={this.props.appealChallengeID}
        challengeState={this.props.challengeState}
        appealChallengeState={this.props.appealChallengeState}
        user={this.props.user}
        parameters={this.props.parameters}
        balance={this.props.balance}
        votingBalance={this.props.votingBalance}
        govtParameters={this.props.govtParameters}
        isMemberOfAppellate={this.props.isMemberOfAppellate}
        txIdToConfirm={this.props.txIdToConfirm}
        onMobileTransactionClick={this.props.onMobileTransactionClick}
      />
    );
  }

  private renderNoChallengeFound = (): JSX.Element => {
    return <>This is not the challenge that you're looking for.</>;
  };
}

const makeMapStateToProps = () => {
  const mapStateToProps = (
    state: State,
    ownProps: ChallengeDetailContainerProps,
  ): ChallengeContainerReduxProps & ChallengeDetailContainerProps => {
    const {
      user,
      govtParameters,
      councilMultisigTransactions,
      grantAppealTxs,
      grantAppealTxsFetching,
    } = state.networkDependent;
    let txIdToConfirm;
    const challengeData = ownProps.challengeData;

    const grantAppealTxDataFetching = grantAppealTxsFetching.get(ownProps.listingAddress);
    const grantAppealTx = grantAppealTxs.get(ownProps.listingAddress);
    if (challengeData && challengeData.challenge && challengeData.challenge.appeal && grantAppealTx) {
      const txData = grantAppealTx.data!;
      const key = txData.substring(0, 74);
      if (councilMultisigTransactions.has(key)) {
        txIdToConfirm = councilMultisigTransactions.get(key).id;
      }
    }
    const listingAddress = ownProps.listingAddress;
    if (!listingAddress) {
      console.error("no listing address found!");
    }
    const userAcct = user.account;

    const isMemberOfAppellate = getIsMemberOfAppellate(state);

    return {
      challengeData,
      challengeState: getChallengeState(challengeData!),
      user: userAcct.account,
      balance: user.account.balance,
      votingBalance: user.account.votingBalance,
      govtParameters,
      isMemberOfAppellate,
      txIdToConfirm,
      grantAppealTxDataFetching,
      ...ownProps,
    };
  };

  return mapStateToProps;
};

export default compose(
  connect(makeMapStateToProps),
  connectParameters,
)(ChallengeContainer);
