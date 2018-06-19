import * as React from "react";
import { EthAddress } from "@joincivil/core";
import { buttonSizes, DarkButton } from "../Button";
import { InputGroup, TextInput } from "../input/";
import { CommitVoteProps } from "./types";
import {
  FormHeader,
  FormCopy,
  AccentHRule,
  FormQuestion,
  VoteOptionsContainer,
  StyledOrText,
} from "./styledComponents";

export interface CommitVoteState {
  numTokensError: string | undefined;
  saltError: string | undefined;
}

export class CommitVote extends React.Component<CommitVoteProps, CommitVoteState> {
  constructor(props: CommitVoteProps) {
    super(props);
    this.state = {
      numTokensError: undefined,
      saltError: undefined,
    };
  }

  public render(): JSX.Element {
    return (
      <>
        <FormHeader>You’re invited to vote!</FormHeader>
        <FormCopy>Vote with your CVL tokens, and help curate credible, trustworthy journalism on Civil.</FormCopy>
        <AccentHRule />

        <FormQuestion>Should this newsroom remain or be removed from the Civil Registry?</FormQuestion>

        {this.renderNumTokensInput()}

        {this.renderSaltInput()}

        <VoteOptionsContainer>
          <DarkButton size={buttonSizes.MEDIUM} onClick={this.submitRemain}>
            ✔ Remain
          </DarkButton>
          <StyledOrText>or</StyledOrText>
          <DarkButton size={buttonSizes.MEDIUM} onClick={this.submitRemove}>
            ✖ Remove
          </DarkButton>
        </VoteOptionsContainer>
      </>
    );
  }

  private renderNumTokensInput = (): JSX.Element => {
    let label = "Enter amount of tokens to vote";
    let className;

    if (this.state.numTokensError) {
      label = this.state.numTokensError;
      className = "error";
    }
    return (
      <InputGroup
        prepend="CVL"
        label={label}
        className={className}
        placeholder="Enter a value"
        name="numTokens"
        value={!this.props.numTokens ? "" : this.props.numTokens.toString()}
        onChange={this.onChange}
      />
    );
  };

  private renderSaltInput = (): JSX.Element => {
    let label = "Enter your salt phrase";
    let className;

    if (this.state.saltError) {
      label = this.state.saltError;
      className = "error";
    }
    return (
      <TextInput
        label={label}
        className={className}
        placeholder="Salt"
        value={this.props.salt}
        name="salt"
        onChange={this.onChange}
      />
    );
  };

  private onChange = (event: any): void => {
    const paramName = event.target.getAttribute("name");
    const val = event.target.value;
    this.props.onInputChange({ [paramName]: val });
  };

  private submitRemain = (event: any): void => {
    // A "remain" vote is a vote that doesn't support the
    // challenge, so `voteOption === 0`
    this.props.onInputChange({ voteOption: "0" });
    this.submit();
  };

  private submitRemove = (event: any): void => {
    // A "remove" vote is a vote that supports the
    // challenge, so `voteOption === 1`
    this.props.onInputChange({ voteOption: "1" });
    this.submit();
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

  private validateNumTokens = (): boolean => {
    const numTokens = this.props.numTokens;
    let isValid = true;

    if (!numTokens || numTokens === 0) {
      isValid = false;
      this.setState({
        numTokensError: "Please enter a valid token vote amount",
      });
    } else if (numTokens > this.props.tokenBalance) {
      isValid = false;
      this.setState({
        numTokensError: "Token vote amount exceeds your balance",
      });
    } else {
      this.setState({ numTokensError: undefined });
    }

    return isValid;
  };

  private submit = (): void => {
    const isSaltValid = this.validateSalt();
    const isNumTokensValid = this.validateNumTokens();

    if (isSaltValid && isNumTokensValid) {
      this.props.submit();
    }
  };
}
