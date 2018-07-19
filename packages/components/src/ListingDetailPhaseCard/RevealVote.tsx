import * as React from "react";
import { RevealVoteProps } from "./types";
import { buttonSizes, DarkButton } from "../Button";
import { TransactionDarkButton } from "../TransactionButton";
import { SaltInput } from "../input/";
import { VoteOptionsContainer, StyledOrText, FormHeader, FormCopy } from "./styledComponents";

export interface RevealVoteState {
  voteOption?: number;
  saltError?: string;
}

export class RevealVote extends React.Component<RevealVoteProps, RevealVoteState> {
  public render(): JSX.Element {
    return (
      <>
        <FormHeader>Verify Your Votes and Make Them Count!</FormHeader>
        <FormCopy>Votes are counted when you verify yours.</FormCopy>
        <FormCopy>
          Please use your pass phrase to verify your votes below. Your pass phrase was created at the time when you
          voted for this challenge.
        </FormCopy>

        <SaltInput salt={this.props.salt} label="Enter your salt" name="salt" onChange={this.onChange} />

        <VoteOptionsContainer>
          <div onMouseEnter={this.setVoteToRemain}>{this.renderVoteButton({ voteOption: 0 })}</div>
          <StyledOrText>or</StyledOrText>
          <div onMouseEnter={this.setVoteToRemove}>{this.renderVoteButton({ voteOption: 1 })}</div>
        </VoteOptionsContainer>
      </>
    );
  }

  private renderVoteButton = (options: any): JSX.Element => {
    const disableButtons = !!this.state.saltError;
    let buttonText;
    if (options.voteOption === 0) {
      buttonText = "✔ Remain";
    } else if (options.voteOption === 1) {
      buttonText = "✖ Remove";
    }
    if (this.state.voteOption === options.voteOption) {
      return (
        <TransactionDarkButton
          size={buttonSizes.MEDIUM}
          transactions={this.props.transactions}
          modalContentComponents={this.props.modalContentComponents}
          disabled={disableButtons}
        >
          {buttonText}
        </TransactionDarkButton>
      );
    }

    return <DarkButton size={buttonSizes.MEDIUM}>{buttonText}</DarkButton>;
  };

  private setVoteToRemain = (): void => {
    // A "remain" vote is a vote that doesn't support the
    // challenge, so `voteOption === 0`
    this.props.onInputChange({ voteOption: "0" });
    this.setState(() => ({ voteOption: 0 }));
  };

  private setVoteToRemove = (): void => {
    // A "remove" vote is a vote that supports the
    // challenge, so `voteOption === 1`
    this.props.onInputChange({ voteOption: "1" });
    this.setState(() => ({ voteOption: 1 }));
  };

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
