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
import TransactionButton from "../utility/TransactionButton";
import { appealChallenge, approveForAppeal, updateListing } from "../../apis/civilTCR";

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%
  color: black;
`;

export interface ChallengeDetailProps {
  listingAddress: EthAddress;
  challenge: ChallengeData;
}

class ChallengeDetail extends React.Component<ChallengeDetailProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    const challenge = this.props.challenge;
    const canResolveChallenge =
      !isChallengeInCommitStage(challenge) &&
      !isChallengeInRevealStage(challenge) &&
      !canRequestAppeal(challenge) &&
      !challenge.appeal;
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
        {canResolveChallenge && this.renderCanResolve()}
      </StyledDiv>
    );
  }

  private renderCommitStage(): JSX.Element {
    return <>COMMIT THINGS</>;
  }
  private renderRevealStage(): JSX.Element {
    return <>REVEAL THINGS</>;
  }
  private renderRequestAppealStage(): JSX.Element {
    return (
      <TransactionButton firstTransaction={approveForAppeal} secondTransaction={this.appeal}>
        Request Appeal
      </TransactionButton>
    );
  }
  private appeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return appealChallenge(this.props.listingAddress);
  };
  private renderCanResolve(): JSX.Element {
    return <TransactionButton firstTransaction={this.resolve}>Resolve Challenge</TransactionButton>;
  }
  private resolve = async (): Promise<TwoStepEthTransaction<any>> => {
    return updateListing(this.props.listingAddress);
  };
}

export default ChallengeDetail;
