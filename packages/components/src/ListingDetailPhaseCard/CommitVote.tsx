import * as React from "react";
import { buttonSizes, Button, DarkButton } from "../Button";
import { InputGroup, CurrencyInputWithButton } from "../input/";
import { CommitVoteProps } from "./types";
import { FormQuestion, VoteOptionsContainer, StyledOrText, buttonTheme } from "./styledComponents";

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
          {this.props.children || <VoteCallToActionText newsroomName={this.props.newsroomName} />}
        </FormQuestion>

        <VoteOptionsContainer>
          {this.renderVoteButton({ voteOption: 1 })}
          <StyledOrText>or</StyledOrText>
          {this.renderVoteButton({ voteOption: 0 })}
        </VoteOptionsContainer>

        {this.renderNumTokensInput()}

        <Button disabled={!canReview} size={buttonSizes.MEDIUM} theme={buttonTheme} onClick={this.props.onReviewVote}>
          {this.props.buttonText || <CommitVoteReviewButtonText />}
        </Button>
      </>
    );
  }

  private renderVoteButton = (options: any): JSX.Element => {
    let buttonText;
    let onClick;
    if (options.voteOption === 1) {
      buttonText = (
        <>
          ✔ <WhitelistActionText />
        </>
      );
      onClick = this.setVoteToRemain;
    } else if (options.voteOption === 0) {
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
      <CurrencyInputWithButton
        placeholder="0.00"
        name="numTokens"
        onChange={this.onChange}
        buttonText="Commit Max"
        icon={<>CVL</>}
        onButtonClick={() => this.props.onCommitMaxTokens()}
      />
    );
  };

  private onChange = (name: string, value: string): void => {
    let validateFn;
    if (name === "numTokens") {
      validateFn = this.validateNumTokens;
    }
    this.props.onInputChange({ [name]: value }, validateFn);
  };

  private setVoteToRemain = (): void => {
    // A "remain" vote is a vote that doesn't support the
    // challenge, so `voteOption === 1`
    this.props.onInputChange({ voteOption: "1" });
    this.setState(() => ({ voteOption: 1 }));
  };

  private setVoteToRemove = (): void => {
    // A "remove" vote is a vote that supports the
    // challenge, so `voteOption === 0`
    this.props.onInputChange({ voteOption: "0" });
    this.setState(() => ({ voteOption: 0 }));
  };

  private validateNumTokens = (): boolean => {
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
