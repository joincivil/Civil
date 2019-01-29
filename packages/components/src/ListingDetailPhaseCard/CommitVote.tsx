import * as React from "react";
import { buttonSizes, Button, InvertedButton } from "../Button";
import { CurrencyInputWithButton } from "../input/";
import { QuestionToolTip } from "../QuestionToolTip";

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
import {
  CommitVoteReviewButtonText,
  VoteCallToActionText,
  AppealChallengeVoteCallToActionText,
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
import VoteButton from "./VoteButton";

export interface CommitVoteState {
  numTokensError?: string;
}

export interface CommitVoteStepState {
  displayStep: number;
}

export class CommitVote extends React.Component<CommitVoteProps, CommitVoteState & CommitVoteStepState> {
  constructor(props: CommitVoteProps) {
    super(props);
    this.state = {
      numTokensError: undefined,
      displayStep: 0,
    };
  }

  public render(): JSX.Element {
    const canReview =
      this.props.voteOption !== undefined &&
      this.props.numTokens &&
      typeof parseInt(this.props.numTokens, 10) === "number";
    const DefaultCTATextComponent = this.props.isAppealChallenge
      ? AppealChallengeVoteCallToActionText
      : VoteCallToActionText;
    return (
      <>
        <StyledStep visible={this.state.displayStep === 0}>
          <StyledStepLabel>Step 1 of 2</StyledStepLabel>

          <FormQuestion>
            {this.props.children || <DefaultCTATextComponent newsroomName={this.props.newsroomName} />}
          </FormQuestion>

          <VoteOptionsContainer>
            <VoteButton buttonVoteOptionValue="1" {...this.props} />
            <StyledOrText>or</StyledOrText>
            <VoteButton buttonVoteOptionValue="0" {...this.props} />
          </VoteOptionsContainer>

          <Button
            disabled={this.props.voteOption === undefined}
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
            <QuestionToolTip explainerText={<OneTokenOneVoteTooltipText />} positionBottom={true} />
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
        onChange={this.setNumTokens}
        onButtonClick={() => this.props.onCommitMaxTokens()}
      />
    );
  };

  private renderAppMessages = (): JSX.Element | null => {
    let message;
    const { numTokens, tokenBalance, votingTokenBalance } = this.props;
    if (numTokens && parseFloat(numTokens) > tokenBalance + votingTokenBalance) {
      message = <CommitVoteInsufficientTokensText />;
    } else if (numTokens && parseFloat(numTokens) === tokenBalance + votingTokenBalance) {
      message = <CommitVoteMaxTokensWarningText />;
    }

    if (message) {
      return <StyledAppMessage>{message}</StyledAppMessage>;
    }

    return null;
  };

  private setNumTokens = (name: string, value: string | null): void => {
    let cleanValue = value && parseFloat(value);
    if (cleanValue) {
      cleanValue = Math.abs(cleanValue as number);
      this.props.onInputChange({ numTokens: cleanValue });
      return;
    }
    this.props.onInputChange({ numTokens: value });
  };
}
