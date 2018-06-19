import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { EthAddress } from "@joincivil/core";
import { colors, fonts } from "../styleConstants";
import { RevealVoteProps } from "./types";
import { buttonSizes } from "../Button";
import { TransactionButton } from "../TransactionButton";
import { InputGroup, TextInput } from "../input/";
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

        <TextInput label="Enter your salt" placeholder="Enter a value" name="salt" onChange={this.onChange} />

        <VoteOptionsContainer>
          <div onMouseEnter={this.setVoteToRemain}>
            <TransactionButton size={buttonSizes.MEDIUM} style="dark" transactions={this.props.transactions}>
              ✔ Remain
            </TransactionButton>
          </div>
          <StyledOrText>or</StyledOrText>
          <div onMouseEnter={this.setVoteToRemove}>
            <TransactionButton size={buttonSizes.MEDIUM} style="dark" transactions={this.props.transactions}>
              ✖ Remove
            </TransactionButton>
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

  private onChange = (name: string, value: string): void => {
    this.props.onInputChange({ [name]: value });
  };
}
