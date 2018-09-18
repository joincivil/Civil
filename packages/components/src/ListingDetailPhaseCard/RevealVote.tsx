import * as React from "react";
import { buttonSizes, Button, DarkButton } from "../Button";
import { SaltInput } from "../input/";
import { TransactionDarkButton } from "../TransactionButton";
import { FormQuestion, StyledOrText, VoteOptionsContainer, buttonTheme } from "./styledComponents";
import { WhitelistActionText, RemoveActionText, VoteCallToActionText, RevealVoteButtonText } from "./textComponents";
import { RevealVoteProps } from "./types";

export interface RevealVoteState {
  voteOption?: number;
  saltError?: string;
}

export class RevealVote extends React.Component<RevealVoteProps, RevealVoteState> {
  constructor(props: RevealVoteProps) {
    super(props);
    this.state = {};
  }

  public render(): JSX.Element {
    const canReveal = this.state.voteOption !== undefined && !this.state.saltError;
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

        <SaltInput salt={this.props.salt} label="Enter your salt" name="salt" onChange={this.onChange} />

        <TransactionDarkButton
          transactions={this.props.transactions}
          modalContentComponents={this.props.modalContentComponents}
          disabled={!canReveal}
          postExecuteTransactions={this.props.postExecuteTransactions}
        >
          <RevealVoteButtonText />
        </TransactionDarkButton>
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
