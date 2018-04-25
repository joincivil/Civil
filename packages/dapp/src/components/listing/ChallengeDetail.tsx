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
import { appealChallenge, approveForAppeal, resolveChallenge } from "../../apis/civilTCR";

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%
  color: black;
`;

const FormValidationMessage = styled.div`
  color: #c00;
  font-weight: bold;
`;

export interface ChallengeDetailProps {
  listingAddress: EthAddress;
  challenge: ChallengeData;
}

export interface ChallengeDetailState {
  isVoteTokenAmtValid: boolean;
}

class ChallengeDetail extends React.Component<ChallengeDetailProps, ChallengeDetailState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isVoteTokenAmtValid: false
    };
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
    return (
      <>
        <h3>Vote On Challenge</h3>

        <label>Poll ID</label>
        <input type="text" name="" />

        <label>Vote Option</label>
        <input type="radio" value="0" name="" /> Yes
        <input type="radio" value="1" name="" /> No

        <label>Salt</label>
        <input type="text" name="" />

        <label>Number of Tokens</label>
        {!this.state.isVoteTokenAmtValid && <FormValidationMessage children="Please enter a valid token amount" />}
        <input type="text" name="" onBlur={this.validateVoteCommittedTokens.bind(this)} />

        <TransactionButton firstTransaction={this.commitVoteOnChallenge}>
          Commit Vote
        </TransactionButton>
      </>
    );
  }
  // @TODO/jon: Make a nicer validation check than this. But for
  // the meantime, let's do this just to see if this whole thing works.
  private validateVoteCommittedTokens(event: any): void {
    const val: string = event.target.value;
    const isValidTokenAmt: boolean = !!val.length && parseInt(val, 10) > 0;
    this.setState({ isVoteTokenAmtValid: isValidTokenAmt })
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

  private commitVoteOnChallenge = async (): Promise<TwoStepEthTransaction<any>> => {
    return appealChallenge(this.props.listingAddress);
  };

  private appeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return appealChallenge(this.props.listingAddress);
  };
  private renderCanResolve(): JSX.Element {
    return <TransactionButton firstTransaction={this.resolve}>Resolve Challenge</TransactionButton>;
  }
  private resolve = async (): Promise<TwoStepEthTransaction<any>> => {
    return resolveChallenge(this.props.listingAddress);
  };
}

export default ChallengeDetail;
