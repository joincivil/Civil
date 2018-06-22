import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { RevealVoteProps } from "./types";
import { buttonSizes } from "../Button";
import { TransactionDarkButton } from "../TransactionButton";
import { TextInput } from "../input/";
import { VoteOptionsContainer, StyledOrText, FormHeader, FormCopy } from "./styledComponents";

export class RevealVote extends React.Component<RevealVoteProps> {
  public render(): JSX.Element {
    return (
      <>
        <FormHeader>Verify Your Votes and Make Them Count!</FormHeader>
        <FormCopy>Votes are counted when you verify yours.</FormCopy>
        <FormCopy>
          Please use your pass phrase to verify your votes below. Your pass phrase was created at the time when you
          voted for this challenge.
        </FormCopy>

        <TextInput label="Enter your salt" placeholder="Salt" name="salt" onChange={this.onChange} />

        <VoteOptionsContainer>
          <div onMouseEnter={this.setVoteToRemain}>
            <TransactionDarkButton size={buttonSizes.MEDIUM} transactions={this.props.transactions}>
              ✔ Remain
            </TransactionDarkButton>
          </div>
          <StyledOrText>or</StyledOrText>
          <div onMouseEnter={this.setVoteToRemove}>
            <TransactionDarkButton size={buttonSizes.MEDIUM} transactions={this.props.transactions}>
              ✖ Remove
            </TransactionDarkButton>
          </div>
        </VoteOptionsContainer>
      </>
    );
  }

  private setVoteToRemain = (): void => {
    // A "remain" vote is a vote that doesn't support the
    // challenge, so `voteOption === 0`
    this.props.onInputChange({ voteOption: "0" });
  };

  private setVoteToRemove = (): void => {
    // A "remove" vote is a vote that supports the
    // challenge, so `voteOption === 1`
    this.props.onInputChange({ voteOption: "1" });
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
