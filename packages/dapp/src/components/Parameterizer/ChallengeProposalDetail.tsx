import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { EthAddress, TwoStepEthTransaction, UserChallengeData, ParamPropChallengeData } from "@joincivil/core";
import {
  ChallengeProposalRevealVote,
  LoadingIndicator,
  ModalHeading,
  ModalContent,
  ModalOrderedList,
  ModalListItem,
  ModalListItemTypes,
  ResolveChallengeProposal,
} from "@joincivil/components";
import { Parameters, getFormattedTokenBalance } from "@joincivil/utils";
import { revealVote, resolveReparameterizationChallenge } from "../../apis/civilTCR";
import BigNumber from "bignumber.js";
import { State } from "../../redux/reducers";
import {
  makeGetParameterProposalChallengeState,
  makeGetParameterProposalChallenge,
  makeGetParameterProposalChallengeRequestStatus,
  getIsMemberOfAppellate,
} from "../../selectors";
import { fetchAndAddParameterProposalChallengeData } from "../../redux/actionCreators/parameterizer";
import { fetchSalt } from "../../helpers/salt";
import { fetchVote } from "../../helpers/vote";
import ChallengeProposalCommitVote from "./ChallengeProposalCommitVote";

enum ModalContentEventNames {
  IN_PROGRESS_APPROVE_VOTING_RIGHTS = "IN_PROGRESS:APPROVE_VOTING_RIGHTS",
  IN_PROGRESS_COMMIT_VOTE = "IN_PROGRESS:COMMIT_VOTE",
  IN_PROGRESS_REVEAL_VOTE = "IN_PROGRESS:REVEAL_VOTE",
  IN_PROGRESS_RESOLVE_CHALLENGE = "IN_PROGRESS:RESOLVE_CHALLENGE",
  IN_PROGRESS_APPROVE_FOR_APPEAL = "IN_PROGRESS:APPROVE_FOR_APPEAL",
  IN_PROGRESS_REQUEST_APPEAL = "IN_PROGRESS:REQUEST_APPEAL",
}

export interface ChallengeDetailContainerProps {
  challengeID: BigNumber;
  propID: number;
  parameterDisplayName: string | JSX.Element;
  parameterCurrentValue: string;
  parameterProposalValue: string;
  showNotFoundMessage?: boolean;
  handleClose(): void;
}

export interface ChallengeContainerReduxProps {
  challengeData?: ParamPropChallengeData;
  userChallengeData?: UserChallengeData;
  challengeDataRequestStatus?: any;
  challengeState: any;
  user: EthAddress;
  balance: BigNumber;
  votingBalance: BigNumber;
  parameters: any;
  govtParameters: any;
  isMemberOfAppellate: boolean;
}

export interface ChallengeDetailProps {
  propID: number;
  parameterDisplayName: string | JSX.Element;
  parameterCurrentValue: string;
  parameterProposalValue: string;
  challengeID: BigNumber;
  challenge: ParamPropChallengeData;
  challengeState: any;
  parameters?: any;
  govtParameters?: any;
  userChallengeData?: UserChallengeData;
  user: EthAddress;
  balance?: BigNumber;
  votingBalance?: BigNumber;
  isMemberOfAppellate: boolean;
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
      voteOption,
      salt: fetchSalt(this.props.challengeID, this.props.user), // TODO(jorgelo): This should probably be in redux.
      numTokens: undefined,
    };
  }

  public render(): JSX.Element {
    const { inCommitPhase, inRevealPhase } = this.props.challengeState;
    return (
      <>
        {inCommitPhase && this.renderCommitStage()}
        {inRevealPhase && this.renderRevealStage()}
        {!inCommitPhase && !inRevealPhase && this.renderResolveStage()}
      </>
    );
  }

  private renderCommitStage(): JSX.Element | null {
    const {
      handleClose,
      parameterDisplayName,
      parameterCurrentValue,
      parameterProposalValue,
      challenge,
      parameters,
      balance,
      votingBalance,
      userChallengeData,
    } = this.props;
    const endTime = challenge.poll.commitEndDate.toNumber();
    const phaseLength = parameters[Parameters.pCommitStageLen];
    const tokenBalance = this.props.balance ? this.props.balance.div(1e18).toNumber() : 0;
    const votingTokenBalance = this.props.votingBalance ? this.props.votingBalance.div(1e18).toNumber() : 0;
    const tokenBalanceDisplay = balance ? getFormattedTokenBalance(balance) : "";
    const votingTokenBalanceDisplay = votingBalance ? getFormattedTokenBalance(votingBalance) : "";
    const userHasCommittedVote = userChallengeData && !!userChallengeData.didUserCommit;

    if (!challenge) {
      return null;
    }

    const props = {
      endTime,
      phaseLength,
      challenge: challenge!,
      challenger: challenge!.challenger.toString(),
      challengeID: this.props.challengeID,
      challengeState: this.props.challengeState,
      user: this.props.user,
      rewardPool: getFormattedTokenBalance(challenge!.rewardPool),
      stake: getFormattedTokenBalance(challenge!.stake),
      userHasCommittedVote,
      tokenBalance,
      votingBalance: this.props.votingBalance,
      votingTokenBalance,
      tokenBalanceDisplay,
      votingTokenBalanceDisplay,
      salt: this.state.salt,
      numTokens: this.state.numTokens,
      handleClose,
      propID: this.props.propID,
      parameterDisplayName,
      parameterCurrentValue,
      parameterProposalValue,
      isMemberOfAppellate: this.props.isMemberOfAppellate,
    };

    return <ChallengeProposalCommitVote {...props} />;
  }

  private renderRevealStage(): JSX.Element | null {
    const endTime = this.props.challenge.poll.revealEndDate.toNumber();
    const phaseLength = this.props.parameters[Parameters.pRevealStageLen];
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
      <ChallengeProposalRevealVote
        handleClose={this.props.handleClose}
        parameterDisplayName={this.props.parameterDisplayName}
        parameterCurrentValue={this.props.parameterCurrentValue}
        parameterProposalValue={this.props.parameterProposalValue}
        challengeID={this.props.challengeID.toString()}
        endTime={endTime}
        phaseLength={phaseLength}
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
        postExecuteTransactions={this.props.handleClose}
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
    percentFor = challenge.poll.votesFor
      .div(totalVotesBN)
      .mul(100)
      .toFixed(0);
    percentAgainst = challenge.poll.votesAgainst
      .div(totalVotesBN)
      .mul(100)
      .toFixed(0);

    return (
      <ResolveChallengeProposal
        parameterDisplayName={this.props.parameterDisplayName}
        parameterCurrentValue={this.props.parameterCurrentValue}
        parameterNewValue={this.props.parameterProposalValue}
        totalVotes={totalVotes}
        votesFor={votesFor}
        votesAgainst={votesAgainst}
        percentFor={percentFor}
        percentAgainst={percentAgainst}
        transactions={[{ transaction: this.resolveChallenge }]}
        handleClose={this.props.handleClose}
        postExecuteTransactions={this.props.handleClose}
      />
    );
  };

  private updateCommitVoteState = (data: any, callback?: () => void): void => {
    if (callback) {
      this.setState({ ...data }, callback);
    } else {
      this.setState({ ...data });
    }
  };

  private revealVoteOnChallenge = async (): Promise<TwoStepEthTransaction<any>> => {
    const voteOption: BigNumber = new BigNumber(this.state.voteOption as string);
    const salt: BigNumber = new BigNumber(this.state.salt as string);
    return revealVote(this.props.challengeID, voteOption, salt);
  };

  private resolveChallenge = async (): Promise<TwoStepEthTransaction<any> | void> => {
    return resolveReparameterizationChallenge(this.props.propID!.toString());
  };
}

class ChallengeContainer extends React.Component<
  ChallengeDetailContainerProps & ChallengeContainerReduxProps & DispatchProp<any>
> {
  public componentDidMount(): void {
    if (!this.props.challengeData && !this.props.challengeDataRequestStatus) {
      this.props.dispatch!(fetchAndAddParameterProposalChallengeData(this.props.challengeID.toString()));
    }
  }

  public componentDidUpdate(): void {
    if (!this.props.challengeData && !this.props.challengeDataRequestStatus) {
      this.props.dispatch!(fetchAndAddParameterProposalChallengeData(this.props.challengeID.toString()));
    }
  }

  public render(): JSX.Element | null {
    const challenge = this.props.challengeData;
    if (!challenge && this.props.showNotFoundMessage) {
      return this.renderNoChallengeFound();
    } else if (!challenge) {
      return null;
    }
    return (
      <ChallengeDetail
        propID={this.props.propID}
        handleClose={this.props.handleClose}
        parameterDisplayName={this.props.parameterDisplayName}
        parameterCurrentValue={this.props.parameterCurrentValue}
        parameterProposalValue={this.props.parameterProposalValue}
        challengeID={this.props.challengeID}
        challenge={challenge}
        userChallengeData={this.props.userChallengeData}
        challengeState={this.props.challengeState}
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
  const getParameterProposalChallengeState = makeGetParameterProposalChallengeState();
  const getParameterProposalChallenge = makeGetParameterProposalChallenge();
  const getParameterProposalChallengeRequestStatus = makeGetParameterProposalChallengeRequestStatus();

  const mapStateToProps = (
    state: State,
    ownProps: ChallengeDetailContainerProps,
  ): ChallengeContainerReduxProps & ChallengeDetailContainerProps => {
    const { challengeUserData, appealChallengeUserData, user, parameters, govtParameters } = state.networkDependent;
    let userChallengeData;
    const challengeID = ownProps.challengeID;
    const challengeData = getParameterProposalChallenge(state, ownProps);
    const challengeDataRequestStatus = getParameterProposalChallengeRequestStatus(state, ownProps);
    const userAcct = user.account;
    const isMemberOfAppellate = getIsMemberOfAppellate(state);

    if (challengeID && userAcct) {
      let challengeUserDataMap = challengeUserData.get(challengeID!.toString());
      if (!challengeUserDataMap) {
        challengeUserDataMap = appealChallengeUserData.get(challengeID!.toString());
      }
      if (challengeUserDataMap) {
        userChallengeData = challengeUserDataMap.get(userAcct.account);
      }
    }

    return {
      challengeData,
      userChallengeData,
      challengeState: getParameterProposalChallengeState(state, ownProps),
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
