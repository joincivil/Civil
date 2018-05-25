import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import {
  isChallengeInCommitStage,
  isChallengeInRevealStage,
  canRequestAppeal,
  didChallengeSucceed,
  doesChallengeHaveAppeal,
  ChallengeData,
  EthAddress,
  TwoStepEthTransaction,
  UserChallengeData,
  WrappedChallengeData,
} from "@joincivil/core";
import AppealDetail from "./AppealDetail";
import CommitVoteDetail from "./CommitVoteDetail";
import ChallengeRewardsDetail from "./ChallengeRewardsDetail";
import CountdownTimer from "../utility/CountdownTimer";
import RevealVoteDetail from "./RevealVoteDetail";
import TransactionButton from "../utility/TransactionButton";
import { ViewModule, ViewModuleHeader } from "../utility/ViewModules";
import { appealChallenge, approveForAppeal } from "../../apis/civilTCR";
import BigNumber from "bignumber.js";
import { State } from "../../reducers";
import { fetchAndAddChallengeData } from "../../actionCreators/challenges";

export interface ChallengeDetailProps {
  listingAddress: EthAddress;
  challengeID: BigNumber;
  challenge: ChallengeData;
  userChallengeData?: UserChallengeData;
  user?: EthAddress;
}

class ChallengeDetail extends React.Component<ChallengeDetailProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    const challenge = this.props.challenge;
    const userChallengeData = this.props.userChallengeData;
    console.log(challenge, userChallengeData);
    const appealExists = doesChallengeHaveAppeal(challenge);
    const canShowRewardsForm = userChallengeData && userChallengeData.didUserReveal;
    return (
      <ViewModule>
        <ViewModuleHeader>Challenge Details</ViewModuleHeader>

        <dl>
          <dt>Challenger</dt>
          <dd>{challenge.challenger.toString()}</dd>

          <dt>Reward Pool</dt>
          <dd>{challenge.rewardPool.toString()}</dd>

          <dt>Stake</dt>
          <dd>{challenge.stake.toString()}</dd>

          <dt>Challenge Succeeded</dt>
          <dd>{didChallengeSucceed(challenge).toString()}</dd>
        </dl>

        {isChallengeInCommitStage(challenge) && this.renderCommitStage()}
        {isChallengeInRevealStage(challenge) && this.renderRevealStage()}
        {canRequestAppeal(challenge) && this.renderRequestAppealStage()}
        {appealExists && <AppealDetail listingAddress={this.props.listingAddress} appeal={challenge.appeal!} />}
        {canShowRewardsForm && this.renderRewardsDetail()}
      </ViewModule>
    );
  }

  private renderCommitStage(): JSX.Element {
    return (
      <>
        Commit Vote Phase ends in <CountdownTimer endTime={this.props.challenge.poll.commitEndDate.toNumber()} />
        <br />
        <CommitVoteDetail challengeID={this.props.challengeID} />
      </>
    );
  }
  private renderRevealStage(): JSX.Element {
    return (
      <>
        Reveal Vote Phase ends in <CountdownTimer endTime={this.props.challenge.poll.revealEndDate.toNumber()} />
        <br />
        <RevealVoteDetail challengeID={this.props.challengeID} />
      </>
    );
  }
  private renderRequestAppealStage(): JSX.Element {
    return (
      <>
        Request Appeal Phase Ends in <CountdownTimer endTime={this.props.challenge.requestAppealExpiry.toNumber()} />
        <br />
        <TransactionButton transactions={[{ transaction: approveForAppeal }, { transaction: this.appeal }]}>
          Request Appeal
        </TransactionButton>
      </>
    );
  }
  private renderRewardsDetail(): JSX.Element {
    return <ChallengeRewardsDetail challengeID={this.props.challengeID} user={this.props.user} />;
  }

  private appeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return appealChallenge(this.props.listingAddress);
  };
}

class ChallengeContainer extends React.Component<
  ChallengeContainerProps & ChallengeContainerReduxProps & DispatchProp<any>
> {
  public componentWillReceiveProps(nextProps: any): void {
    if (!this.props.challengeData && !nextProps.challengeData && !this.props.challengeDataRequestStatus) {
      console.log("let's get the challenge data");
      this.props.dispatch!(fetchAndAddChallengeData(this.props.challengeID.toString(), this.props.user));
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
        user={this.props.user}
      />
    );
  }

  private renderNoChallengeFound = (): JSX.Element => {
    return <>This is not the challenge that you're looking for.</>;
  };
}

export interface ChallengeContainerProps {
  listingAddress: EthAddress;
  challengeID: BigNumber;
  showNotFoundMessage?: boolean;
}

export interface ChallengeContainerReduxProps {
  challengeData?: WrappedChallengeData | undefined;
  userChallengeData?: UserChallengeData | undefined;
  challengeDataRequestStatus?: any;
  user: EthAddress;
}

const mapStateToProps = (
  state: State,
  ownProps: ChallengeContainerProps,
): ChallengeContainerReduxProps & ChallengeContainerProps => {
  const { challenges, challengesFetching, challengeUserData, user } = state;
  let listingAddress = ownProps.listingAddress;
  let challengeData;
  let userChallengeData;
  const challengeID = ownProps.challengeID;
  if (challengeID) {
    challengeData = challenges.get(challengeID.toString());
  }
  if (!listingAddress && challengeData) {
    listingAddress = challenges.get(challengeID.toString())!.listingAddress;
  }
  const userAcct = user.account;
  if (challengeID && userAcct) {
    const challengeUserDataMap = challengeUserData.get(challengeID!.toString());
    if (challengeUserDataMap) {
      userChallengeData = challengeUserDataMap.get(userAcct);
    }
  }
  let challengeDataRequestStatus;
  if (challengeID) {
    challengeDataRequestStatus = challengesFetching.get(challengeID.toString());
  }

  return {
    challengeData,
    userChallengeData,
    challengeDataRequestStatus,
    user: userAcct,
    ...ownProps,
  };
};

export default connect(mapStateToProps)(ChallengeContainer);
