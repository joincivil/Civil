import * as React from "react";
import styled from "styled-components";
import TransactionButton from "../utility/TransactionButton";
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

export interface InputElementProps {
  type: string;
  name?: string;
  value?: string;
  readOnly?: boolean;
  onChange?(event: any): void;
  validate?(event: any): boolean;
}

class InputElement extends React.Component<InputElementProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <input
        type={this.props.type}
        name={this.props.name}
        value={this.props.value}
        readOnly={this.props.readOnly}
        onChange={this.onChange.bind(this)}
      />
    );
  }

  private onChange(event: any): void {
    if (this.props.onChange) {
      this.props.onChange(event);
    }

    if (this.props.validate) {
      this.props.validate(event);
    }
  }
}

class CommitVoteDetail extends React.Component<CommitVoteDetailProps, CommitVoteDetailState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isVoteTokenAmtValid: false,
    };

    this.updateCommitVoteParam = this.updateCommitVoteParam.bind(this);
  }

  public render(): JSX.Element {
    return (
      <StyledFormContainer>
        <h3>Vote On Challenge</h3>

        {/* @TODO/jon: Change this to a hidden form field.
            The typical user/voter doesn't need to know about the PollID */}
        <FormGroup>
          <label>Poll ID</label>
          <InputElement type="text" name="" value={this.props.challengeID.toString()} readOnly={true} />
        </FormGroup>

        <FormGroup>
          <label>Support This Challenge (Vote Option)</label>
          <InputElement type="radio" value="1" name="voteOption" onChange={this.updateCommitVoteParam} /> Yes
          <InputElement type="radio" value="0" name="voteOption" onChange={this.updateCommitVoteParam} /> No
        </FormGroup>

        <FormGroup>
          <label>Salt</label>
          <InputElement type="text" name="salt" onChange={this.updateCommitVoteParam} />
        </FormGroup>

        <FormGroup>
          <label>Number of Tokens</label>
          {!this.state.isVoteTokenAmtValid && <FormValidationMessage children="Please enter a valid token amount" />}
          <InputElement
            type="text"
            name="numTokens"
            validate={this.validateVoteCommittedTokens.bind(this)}
            onChange={this.updateCommitVoteParam}
          />
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

  private updateCommitVoteParam(event: any): void {
    const paramName = event.target.getAttribute("name");
    const val = event.target.value;
    const newState = {};
    newState[paramName] = val;
    this.setState(newState);
  }

  // @TODO/jon: Make a nicer validation check than this. But for
  // the meantime, let's do this just to see if this whole thing works.
  private validateVoteCommittedTokens(event: any): void {
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
