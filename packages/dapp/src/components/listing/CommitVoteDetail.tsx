import * as React from "react";
import styled from "styled-components";
import TransactionButton from "../utility/TransactionButton";
import { InputElement } from "../utility/FormElements";
import { TwoStepEthTransaction } from "@joincivil/core";
import { commitVote, requestVotingRights } from "../../apis/civilTCR";
import BigNumber from "bignumber.js";

const StyledFormContainer = styled.div`
  margin: 1em 0;
`;

const FormValidationMessage = styled.div`
  color: #c00;
  font-weight: bold;
`;

const FormGroup = styled.div`
  margin: 0 0 1em;
`;

export interface CommitVoteDetailProps {
  challengeID: BigNumber;
}

export interface CommitVoteDetailState {
  isVoteTokenAmtValid: boolean;
  voteOption?: string;
  salt?: string;
  numTokens?: string;
}

class CommitVoteDetail extends React.Component<CommitVoteDetailProps, CommitVoteDetailState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isVoteTokenAmtValid: false,
    };

  }

  public render(): JSX.Element {
    return (
      <StyledFormContainer>
        <h3>Vote On Challenge</h3>

        {/* @TODO(jon): Change this to a hidden form field.
            The typical user/voter doesn't need to know about the PollID */}
        <FormGroup>
          <label>Poll ID
            <InputElement type="text" name="" value={this.props.challengeID.toString()} readOnly={true} />
          </label>
        </FormGroup>

        <FormGroup>
          <label>Support This Challenge (Vote Option)
            <InputElement type="radio" value="1" name="voteOption" onChange={this.updateCommitVoteParam} /> Yes
            <InputElement type="radio" value="0" name="voteOption" onChange={this.updateCommitVoteParam} /> No
          </label>
        </FormGroup>

        <FormGroup>
          <label>Salt</label>
          <InputElement type="text" name="salt" onChange={this.updateCommitVoteParam} />
        </FormGroup>

        <FormGroup>
          <label>Number of Tokens
            {!this.state.isVoteTokenAmtValid && <FormValidationMessage children="Please enter a valid token amount" />}
            <InputElement
              type="text"
              name="numTokens"
              validate={this.validateVoteCommittedTokens}
              onChange={this.updateCommitVoteParam}
            />
          </label>
        </FormGroup>

        <FormGroup>
          <TransactionButton
            firstTransaction={this.requestVotingRights}
            secondTransaction={this.commitVoteOnChallenge}
          >
            Commit Vote
          </TransactionButton>
        </FormGroup>
      </StyledFormContainer>
    );
  }

  private updateCommitVoteParam = (event: any): void => {
    const paramName = event.target.getAttribute("name");
    const val = event.target.value;
    const newState = {};
    newState[paramName] = val;
    this.setState(newState);
  }

  // @TODO(jon): Make a nicer validation check than this. But for
  // the meantime, let's do this just to see if this whole thing works.
  private validateVoteCommittedTokens = (event: any): void => {
    const val: string = event.target.value;
    const isValidTokenAmt: boolean = !!val.length && parseInt(val, 10) > 0;
    this.setState({ isVoteTokenAmtValid: isValidTokenAmt });
  }

  private requestVotingRights = async (): Promise<TwoStepEthTransaction<any>> => {
    const numTokens: BigNumber = new BigNumber(this.state.numTokens as string);
    return requestVotingRights(numTokens);
  };

  private commitVoteOnChallenge = async (): Promise<TwoStepEthTransaction<any>> => {
    const voteOption: BigNumber = new BigNumber(this.state.voteOption as string);
    const salt: BigNumber = new BigNumber(this.state.salt as string);
    const numTokens: BigNumber = new BigNumber(this.state.numTokens as string);
    return commitVote(this.props.challengeID, voteOption, salt, numTokens);
  };
}

export default CommitVoteDetail;
