import * as React from "react";
import { buttonSizes, Button, DarkButton, InvertedButton } from "../Button";
import { CurrencyInputWithButton } from "../input/";
import { CommitVoteProps } from "./types";
import {
  FormQuestion,
  VoteOptionsContainer,
  StyledOrText,
  buttonTheme,
  ProgressBarProgress,
  ProgressBarTotal,
  StyledBalanceRow,
  StyledBalanceRowRight,
  StyledStep,
  StyledStepLabel,
  StyledOneTokenOneVote,
  StyledButtonsContainer,
  StyledAppMessage,
} from "./styledComponents";
import { QuestionToolTip } from "../QuestionToolTip";

import {
  CommitVoteReviewButtonText,
  WhitelistActionText,
  RemoveActionText,
  VoteCallToActionText,
  AvailableTokenBalanceText,
  AvailableTokenBalanceTooltipText,
  VotingTokenBalanceText,
  VotingTokenBalanceTooltipText,
  SelectNumTokensText,
  OneTokenOneVoteText,
  OneTokenOneVoteTooltipText,
  CommitVoteInsufficientTokensText,
  CommitVoteMaxTokensWarningText,
} from "./textComponents";

export interface CommitVoteState {
  voteOption?: number;
  numTokensError?: string;
  saltError?: string;
}

export interface CommitVoteStepState {
  displayStep: number;
}

export class CommitVote extends React.Component<CommitVoteProps, CommitVoteState & CommitVoteStepState> {
  constructor(props: CommitVoteProps) {
    super(props);
    this.state = {
      voteOption: undefined,
      numTokensError: undefined,
      saltError: undefined,
      displayStep: 0,
    };
  }

  public render(): JSX.Element {
    const canReview =
      this.state.voteOption !== undefined &&
      this.props.numTokens &&
      typeof parseInt(this.props.numTokens, 10) === "number";
    return (
      <>
        <StyledStep visible={this.state.displayStep === 0}>
          <StyledStepLabel>Step 1 of 2</StyledStepLabel>

          <FormQuestion>
            {this.props.children || <VoteCallToActionText newsroomName={this.props.newsroomName} />}
          </FormQuestion>

          <VoteOptionsContainer>
            {this.renderVoteButton({ voteOption: 1 })}
            <StyledOrText>or</StyledOrText>
            {this.renderVoteButton({ voteOption: 0 })}
          </VoteOptionsContainer>

          <Button
            disabled={this.state.voteOption === undefined}
            onClick={() => this.setState({ displayStep: 1 })}
            size={buttonSizes.MEDIUM}
            theme={buttonTheme}
          >
            Next
          </Button>
        </StyledStep>

        <StyledStep visible={this.state.displayStep === 1}>
          <StyledStepLabel>Step 2 of 2</StyledStepLabel>

          <FormQuestion>
            <SelectNumTokensText />
          </FormQuestion>

          <StyledOneTokenOneVote>
            <OneTokenOneVoteText />
            <QuestionToolTip explainerText={OneTokenOneVoteTooltipText} positionBottom={true} />
          </StyledOneTokenOneVote>

          {this.renderTokenBalance()}

          {this.renderNumTokensInput()}

          {this.renderAppMessages()}

          <StyledButtonsContainer>
            <InvertedButton
              onClick={() => this.setState({ displayStep: 0 })}
              size={buttonSizes.MEDIUM}
              theme={buttonTheme}
            >
              Back
            </InvertedButton>

            <Button
              disabled={!canReview}
              size={buttonSizes.MEDIUM}
              theme={buttonTheme}
              onClick={this.props.onReviewVote}
            >
              {this.props.buttonText || <CommitVoteReviewButtonText />}
            </Button>
          </StyledButtonsContainer>
        </StyledStep>
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

  private renderTokenBalance = (): JSX.Element => {
    let tokenBalanceLabel: JSX.Element;
    let toolTipText: JSX.Element;
    let displayBalance: string;
    let progress: number;

    if (this.props.votingTokenBalance) {
      tokenBalanceLabel = <VotingTokenBalanceText />;
      toolTipText = <VotingTokenBalanceTooltipText />;
      displayBalance = this.props.votingTokenBalanceDisplay;
      progress = this.props.numTokens ? parseFloat(this.props.numTokens) / this.props.votingTokenBalance : 0;
    } else {
      tokenBalanceLabel = <AvailableTokenBalanceText />;
      toolTipText = <AvailableTokenBalanceTooltipText />;
      displayBalance = this.props.tokenBalanceDisplay;
      progress = this.props.numTokens ? parseFloat(this.props.numTokens) / this.props.tokenBalance : 0;
    }

    if (progress > 1) {
      progress = 1;
    }

    const style = { width: `${(progress * 100).toString()}%` };

    return (
      <>
        <StyledBalanceRow>
          <div>
            {tokenBalanceLabel}
            <QuestionToolTip explainerText={toolTipText} positionBottom={true} />
          </div>

          <StyledBalanceRowRight>{displayBalance}</StyledBalanceRowRight>
        </StyledBalanceRow>

        <ProgressBarTotal>
          <ProgressBarProgress style={style} />
        </ProgressBarTotal>
      </>
    );
  };

  private renderNumTokensInput = (): JSX.Element => {
    return (
      <CurrencyInputWithButton
        placeholder="0.00"
        name="numTokens"
        buttonText="Commit Max"
        icon={<>CVL</>}
        value={this.props.numTokens}
        onButtonClick={() => this.props.onCommitMaxTokens()}
      />
    );
  };

  private renderAppMessages = (): JSX.Element | null => {
    let message;
    const { numTokens, tokenBalance, votingTokenBalance } = this.props;
    if (numTokens && parseFloat(numTokens) > (tokenBalance + votingTokenBalance)) {
      message = <CommitVoteInsufficientTokensText />;
    } else if (numTokens && parseFloat(numTokens) === (tokenBalance + votingTokenBalance)) {
      message = <CommitVoteMaxTokensWarningText />;
    }

    if (message) {
      return <StyledAppMessage>{message}</StyledAppMessage>;
    }

    return null;
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
}
