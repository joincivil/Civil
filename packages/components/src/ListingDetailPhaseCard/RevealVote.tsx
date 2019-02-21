import * as React from "react";
import { SaltInput } from "../input/";
import { TransactionButtonNoModal } from "../TransactionButton";
import {
  StyledOrText,
  VoteOptionsContainer,
  StyledButtonsContainer,
  StyledStepCopy,
  StyledStepCopyNum,
} from "./styledComponents";
import { RevealVoteButtonText } from "./textComponents";
import { RevealVoteProps } from "./types";
import VoteButton from "./VoteButton";

export interface RevealVoteState {
  saltError?: string;
}

interface StepCopyProps {
  step: string;
}

const StepCopy: React.SFC<StepCopyProps> = props => {
  return (
    <StyledStepCopy>
      <StyledStepCopyNum>{props.step}</StyledStepCopyNum>
      <div>{props.children}</div>
    </StyledStepCopy>
  );
};

export class RevealVote extends React.Component<RevealVoteProps, RevealVoteState> {
  constructor(props: RevealVoteProps) {
    super(props);
    this.state = { saltError: undefined };
  }

  public render(): JSX.Element {
    const canReveal = this.props.voteOption !== undefined && !this.state.saltError;
    return (
      <>
        <StepCopy step="1">
          {this.props.children || "Reveal the vote option you chose in the submit vote phase"}
        </StepCopy>

        <VoteOptionsContainer>
          <VoteButton buttonVoteOptionValue="1" {...this.props} />
          <StyledOrText>or</StyledOrText>
          <VoteButton buttonVoteOptionValue="0" {...this.props} />
        </VoteOptionsContainer>

        <StepCopy step="2">Enter your 4-word voting code</StepCopy>
        <SaltInput
          salt={this.props.salt}
          name="salt"
          onChange={this.onChange}
          invalid={!!this.state.saltError}
          invalidMessage={this.state.saltError}
        />

        <StyledButtonsContainer>
          <TransactionButtonNoModal
            transactions={this.props.transactions}
            disabled={!canReveal}
            postExecuteTransactions={this.props.postExecuteTransactions}
          >
            <RevealVoteButtonText />
          </TransactionButtonNoModal>
        </StyledButtonsContainer>
      </>
    );
  }

  private validateSalt = (): boolean => {
    let isValid = true;

    if (!this.props.salt || this.props.salt.length === 0) {
      isValid = false;
      this.setState({
        saltError: "Please enter a valid salt phrase",
      });
    } else {
      this.setState({ saltError: undefined });
    }

    return isValid;
  };

  private onChange = (name: string, value: string): void => {
    let validateFn;

    if (name === "salt") {
      validateFn = this.validateSalt;
    }
    this.props.onInputChange({ [name]: value }, validateFn);
  };
}
