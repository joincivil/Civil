import * as React from "react";
import styled from "styled-components";
import {
  isChallengeInCommitStage,
  isChallengeInRevealStage,
  canRequestAppeal,
  didChallengeSucceed,
  ChallengeData,
  EthAddress,
  TwoStepEthTransaction,
} from "@joincivil/core";
import AppealDetail from "./AppealDetail";
import CommitVoteDetail from "./CommitVoteDetail";
import CountdownTimer from "../utility/CountdownTimer";
import RevealVoteDetail from "./RevealVoteDetail";
import TransactionButton from "../utility/TransactionButton";
import { appealChallenge, approveForAppeal } from "../../apis/civilTCR";
import BigNumber from "bignumber.js";

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%
  color: black;
`;

export interface ChallengeDetailProps {
  listingAddress: EthAddress;
  challengeID: BigNumber;
  challenge: ChallengeData;
}

class ChallengeDetail extends React.Component<ChallengeDetailProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    const challenge = this.props.challenge;
    return (
      <StyledDiv>
        Challenger: {challenge.challenger.toString()}
        <br />
        Reward Pool: {challenge.rewardPool.toString()}
        <br />
        Stake: {challenge.stake.toString()}
        <br />
        Challenge Succeeded: {didChallengeSucceed(challenge).toString()}
        <br />
        {isChallengeInCommitStage(challenge) && this.renderCommitStage()}
        {isChallengeInRevealStage(challenge) && this.renderRevealStage()}
        {canRequestAppeal(challenge) && this.renderRequestAppealStage()}
        {challenge.appeal && <AppealDetail appeal={challenge.appeal} />}
      </StyledDiv>
    );
  }

  private renderCommitStage(): JSX.Element {
    return (
      <>
        Commit Vote Phase ends in <CountdownTimer endTime={this.props.challenge.poll.commitEndDate.toNumber()} />
        <CommitVoteDetail challengeID={this.props.challengeID} />;
      </>
    );
  }
  private renderRevealStage(): JSX.Element {
    return <RevealVoteDetail challengeID={this.props.challengeID} />;
  }
  private renderRequestAppealStage(): JSX.Element {
    return (
      <TransactionButton transactions={[{ transaction: approveForAppeal }, { transaction: this.appeal }]}>
        Request Appeal
      </TransactionButton>
    );
  }

  private appeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return appealChallenge(this.props.listingAddress);
  };
}

export default ChallengeDetail;
