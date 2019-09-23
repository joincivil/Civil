import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { BigNumber, bigNumberify, formatEther } from "@joincivil/typescript-types";

import { EthAddress, UserChallengeData, ParamPropChallengeData } from "@joincivil/core";
import { Parameters, getFormattedTokenBalance } from "@joincivil/utils";

import { State } from "../../redux/reducers";
import {
  getIsMemberOfAppellate,
} from "../../selectors";

import ChallengeProposalCommitVote from "./ChallengeProposalCommitVote";
import ChallengeProposalRevealVote from "./ChallengeProposalRevealVote";
import ChallengeProposalResolve from "./ChallengeProposalResolve";
import { Query } from "react-apollo";
import { CHALLENGE_QUERY, transformGraphQLDataIntoParamPropChallenge, USER_CHALLENGE_DATA_QUERY, transfromGraphQLDataIntoUserChallengeData } from "../../helpers/queryTransformations";
import { compose } from "redux";
import { connectParameters, ParametersProps } from "../utility/HigherOrderComponents";

export interface ChallengeDetailContainerProps {
  challengeID: BigNumber;
  propID: number;
  parameterDisplayName: string | JSX.Element;
  parameterCurrentValue: string;
  parameterProposalValue: string;
  showNotFoundMessage?: boolean;
  parameterName: string;
  handleClose(): void;
}

export interface ChallengeContainerReduxProps {
  user: EthAddress;
  balance: BigNumber;
  votingBalance: BigNumber;
  govtParameters: any;
  isMemberOfAppellate: boolean;
  isGovtProposal?: boolean;
}

export interface ChallengeDetailProps {
  propID: number;
  parameterDisplayName: string | JSX.Element;
  parameterCurrentValue: string;
  parameterProposalValue: string;
  challengeID: BigNumber;
  challenge: ParamPropChallengeData;
  govtParameters?: any;
  userChallengeData?: UserChallengeData;
  user: EthAddress;
  balance?: BigNumber;
  votingBalance?: BigNumber;
  isMemberOfAppellate: boolean;
  isGovtProposal?: boolean;
  handleClose(): void;
}

export interface ChallengeVoteState {
  isReviewVoteModalOpen: boolean;
  voteOption?: string;
  salt?: string;
  numTokens?: string;
}

// A container encapsultes the Commit Vote, Reveal Vote and Rewards phases for a Challenge.
// @TODO(jon): Clean this up... by maybe separating into separate containers for each phase card component
class ChallengeDetail extends React.Component<ChallengeDetailProps & ParametersProps> {
  public render(): JSX.Element {

    const nowTimestamp = Date.now().valueOf();
    const commitEndTimestamp = new Date(this.props.challenge.poll.commitEndDate.toNumber() * 1000).valueOf()
    const revealEndTimestamp = new Date(this.props.challenge.poll.revealEndDate.toNumber() * 1000).valueOf()

    if (nowTimestamp < commitEndTimestamp) {
      return this.renderCommitStage();
    } else if (nowTimestamp < revealEndTimestamp) {
      return this.renderRevealStage();
    } else {
      return this.renderResolveStage();
    }
  }

  private renderCommitStage(): JSX.Element {
    const {
      handleClose,
      parameterDisplayName,
      parameterCurrentValue,
      parameterProposalValue,
      challenge,
      balance,
      votingBalance,
      userChallengeData,
    } = this.props;
    const endTime = challenge.poll.commitEndDate.toNumber();
    const phaseLength = this.props.parameters.get(Parameters.pCommitStageLen).toNumber();
    const tokenBalance = parseFloat(formatEther(this.props.balance || bigNumberify(0)));
    const votingTokenBalance = parseFloat(formatEther(this.props.votingBalance || bigNumberify(0)));
    const tokenBalanceDisplay = balance ? getFormattedTokenBalance(balance) : "";
    const votingTokenBalanceDisplay = votingBalance ? getFormattedTokenBalance(votingBalance) : "";
    const userHasCommittedVote = userChallengeData && !!userChallengeData.didUserCommit;

    const props = {
      ...this.props,
      endTime,
      phaseLength,
      challenge: challenge!,
      challenger: challenge!.challenger.toString(),
      challengeID: this.props.challengeID,
      user: this.props.user,
      rewardPool: getFormattedTokenBalance(challenge!.rewardPool),
      stake: getFormattedTokenBalance(challenge!.stake),
      userHasCommittedVote,
      tokenBalance,
      votingBalance: this.props.votingBalance,
      votingTokenBalance,
      tokenBalanceDisplay,
      votingTokenBalanceDisplay,
      handleClose,
      propID: this.props.propID,
      parameterDisplayName,
      parameterCurrentValue,
      parameterProposalValue,
      isMemberOfAppellate: this.props.isMemberOfAppellate,
    };

    return <ChallengeProposalCommitVote {...props} />;
  }

  private renderRevealStage(): JSX.Element {
    const endTime = this.props.challenge.poll.revealEndDate.toNumber();
    const phaseLength = this.props.parameters.get(Parameters.pRevealStageLen).toNumber();
    const challenge = this.props.challenge;
    const userHasRevealedVote = this.props.userChallengeData && !!this.props.userChallengeData.didUserReveal;
    const userHasCommittedVote = this.props.userChallengeData && !!this.props.userChallengeData.didUserCommit;

    const props = {
      ...this.props,
      endTime,
      phaseLength,
      userHasRevealedVote,
      userHasCommittedVote,
      challenger: challenge!.challenger.toString(),
      rewardPool: getFormattedTokenBalance(challenge!.rewardPool),
      stake: getFormattedTokenBalance(challenge!.stake),
    };

    return <ChallengeProposalRevealVote {...props} />;
  }

  private renderResolveStage = (): JSX.Element => {
    let totalVotes = "";
    let votesFor = "";
    let votesAgainst = "";
    let percentFor = "";
    let percentAgainst = "";

    const challenge = this.props.challenge;
    const totalVotesBN = challenge.poll.votesAgainst.add(challenge.poll.votesFor);
    totalVotes = getFormattedTokenBalance(totalVotesBN);
    votesFor = getFormattedTokenBalance(challenge.poll.votesFor);
    votesAgainst = getFormattedTokenBalance(challenge.poll.votesAgainst);
    if (totalVotesBN.gt(0)) {
      percentFor = challenge.poll.votesFor
        .mul(100)
        .div(totalVotesBN)
        .toString();
      percentAgainst = challenge.poll.votesAgainst
        .mul(100)
        .div(totalVotesBN)
        .toString();
    }

    return (
      <ChallengeProposalResolve
        {...this.props}
        challengeID={this.props.challengeID.toString()}
        parameterNewValue={this.props.parameterProposalValue.toString()}
        totalVotes={totalVotes}
        votesFor={votesFor}
        votesAgainst={votesAgainst}
        percentFor={percentFor}
        percentAgainst={percentAgainst}
        handleClose={this.props.handleClose}
      />
    );
  };
}

class ChallengeContainer extends React.Component<
  ChallengeDetailContainerProps & ChallengeContainerReduxProps & DispatchProp<any> & ParametersProps
> {
  public render(): JSX.Element | null {
    const { challengeID } = this.props;
    return (<Query query={CHALLENGE_QUERY} variables={{ challengeID: challengeID.toString() }}>
    {({ loading, error, data }) => {
      if (loading) {
        return <></>
      } else if (error) {
        return this.renderNoChallengeFound();
      }

      const challengeData = transformGraphQLDataIntoParamPropChallenge(data.challenge);
      return (
      <Query query={USER_CHALLENGE_DATA_QUERY} variables={{ userAddr: this.props.user, pollID: challengeID.toString()}}>
        {({ loading: loadingUserData, error: errorUserData, data: dataUserData }) => {
          if (loadingUserData) {
            return <></>;
          }
          if (errorUserData) {
            console.error("errorUserData: ", errorUserData)
          }
          let userChallengeData;
          if (dataUserData && dataUserData.userChallengeData && dataUserData.userChallengeData.length > 0) {
            userChallengeData = transfromGraphQLDataIntoUserChallengeData(dataUserData.userChallengeData[0], data.challenge)
          }
          return (
            <ChallengeDetail
              propID={this.props.propID}
              handleClose={this.props.handleClose}
              parameterDisplayName={this.props.parameterDisplayName}
              parameterCurrentValue={this.props.parameterCurrentValue}
              parameterProposalValue={this.props.parameterProposalValue}
              challengeID={challengeID}
              challenge={challengeData!}
              userChallengeData={userChallengeData}
              user={this.props.user}
              balance={this.props.balance}
              votingBalance={this.props.votingBalance}
              govtParameters={this.props.govtParameters}
              isMemberOfAppellate={this.props.isMemberOfAppellate}
              isGovtProposal={this.props.isGovtProposal}
              parameters={this.props.parameters}
            />
          );
        }}
        </Query>)
    }}
  </Query>)

  }

  private renderNoChallengeFound = (): JSX.Element => {
    return <>This is not the challenge that you're looking for.</>;
  };
}

const mapStateToProps = (
    state: State,
    ownProps: ChallengeDetailContainerProps,
  ): ChallengeContainerReduxProps & ChallengeDetailContainerProps => {
    const { user, govtParameters } = state.networkDependent;

    const userAcct = user.account;
    const isMemberOfAppellate = getIsMemberOfAppellate(state);

    const isGovtProposal = govtParameters[ownProps.parameterName] !== undefined;

    return {
      user: userAcct.account,
      balance: user.account.balance,
      votingBalance: user.account.votingBalance,
      govtParameters,
      isMemberOfAppellate,
      isGovtProposal,
      ...ownProps,
    };
  };

export default compose(connectParameters, connect(mapStateToProps))(ChallengeContainer);
