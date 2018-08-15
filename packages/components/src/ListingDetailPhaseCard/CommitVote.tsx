import * as React from "react";
import { buttonSizes, Button, DarkButton } from "../Button";
import { InputGroup } from "../input/";
import { CommitVoteProps } from "./types";
import { FormQuestion, VoteOptionsContainer, StyledOrText, buttonTheme } from "./styledComponents";
import { SaltField } from "./SaltField";

import {
  CommitVoteReviewButtonText,
  WhitelistActionText,
  RemoveActionText,
  VoteCallToActionText,
  CommitVoteNumTokensLabelText,
} from "./textComponents";

export interface CommitVoteState {
  voteOption?: number;
  numTokensError?: string;
  saltError?: string;
}

export class CommitVote extends React.Component<CommitVoteProps, CommitVoteState> {
  constructor(props: CommitVoteProps) {
    super(props);
    this.state = {
      voteOption: undefined,
      numTokensError: undefined,
      saltError: undefined,
    };
  }

  public render(): JSX.Element {
    const canReview =
      this.state.voteOption !== undefined &&
      this.props.numTokens &&
      typeof parseInt(this.props.numTokens, 10) === "number";
    return (
      <>
        <FormQuestion>
          <VoteCallToActionText newsroomName={this.props.newsroomName} />
        </FormQuestion>

        <VoteOptionsContainer>
          {this.renderVoteButton({ voteOption: 0 })}
          <StyledOrText>or</StyledOrText>
          {this.renderVoteButton({ voteOption: 1 })}
        </VoteOptionsContainer>

        {this.renderNumTokensInput()}

        {this.renderSaltInput()}

        <Button disabled={!canReview} size={buttonSizes.MEDIUM} theme={buttonTheme} onClick={this.props.onReviewVote}>
          <CommitVoteReviewButtonText />
        </Button>
      </>
    );
  }

  private renderVoteButton = (options: any): JSX.Element => {
    let buttonText;
    let onClick;
    if (options.voteOption === 0) {
      buttonText = (
        <>
          ✔ <WhitelistActionText />
        </>
      );
      onClick = this.setVoteToRemain;
    } else if (options.voteOption === 1) {
      buttonText = (
        <>
          ✖ <RemoveActionText />
        </>
      );
      onClick = this.setVoteToRemove;
    }
    if (this.state.voteOption === options.voteOption) {
      return (
        <Button onClick={onClick} size={buttonSizes.MEDIUM} theme={buttonTheme}>
          {buttonText}
        </Button>
      );
    }

    return (
      <DarkButton onClick={onClick} size={buttonSizes.MEDIUM} theme={buttonTheme}>
        {buttonText}
      </DarkButton>
    );
  };

  private renderNumTokensInput = (): JSX.Element => {
    let label: string | JSX.Element = <CommitVoteNumTokensLabelText />;
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
    return <SaltField salt={this.props.salt} />;
  };

  private onChange = (name: string, value: string): void => {
    let validateFn;
    if (name === "salt") {
      validateFn = this.validateSalt;
    }
    if (name === "numTokens") {
      validateFn = this.validateNumTokens;
    }
    this.props.onInputChange({ [name]: value }, validateFn);
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
    console.log("validate salt", this.props);
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
    console.log("validate num tokens", this.props);
    const numTokens = !this.props.numTokens ? 0 : parseInt(this.props.numTokens as string, 10);
    let isValid = true;

    if (!numTokens || numTokens === 0) {
      isValid = false;
      this.setState({
        numTokensError: "Please enter a valid token vote amount",
      });

      // @TODO(jon): Add client-side validation that checks that
      // numTokens <= this.props.tokenBalance. Though this may
      // not be needed if we change to a slider UI element or
      // when we implement pre-approving tokens for voting
      // If we do client-side validation, we'd want to do
      // something like:
      // `this.setState({ numTokensError: "Token vote amount exceeds your balance" });`
    } else {
      this.setState({ numTokensError: undefined });
    }

    return isValid;
  };
}
