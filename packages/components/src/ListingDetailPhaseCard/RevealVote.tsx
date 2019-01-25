import * as React from "react";
import { SaltInput } from "../input/";
import { TransactionButtonNoModal } from "../TransactionButton";
import { FormQuestion, StyledOrText, VoteOptionsContainer } from "./styledComponents";
import { VoteCallToActionText, AppealChallengeVoteCallToActionText, RevealVoteButtonText } from "./textComponents";
import { RevealVoteProps } from "./types";
import VoteButton from "./VoteButton";

export interface RevealVoteState {
  saltError?: string;
}

export class RevealVote extends React.Component<RevealVoteProps, RevealVoteState> {
  constructor(props: RevealVoteProps) {
    super(props);
    this.state = { saltError: undefined };
  }

  public render(): JSX.Element {
    const canReveal = this.props.voteOption !== undefined && !this.state.saltError;
    const DefaultCTATextComponent = this.props.isAppealChallenge
      ? AppealChallengeVoteCallToActionText
      : VoteCallToActionText;
    return (
      <>
        <FormQuestion>
          {this.props.children || <DefaultCTATextComponent newsroomName={this.props.newsroomName} />}
        </FormQuestion>

        <VoteOptionsContainer>
          <VoteButton buttonVoteOptionValue="1" {...this.props} />
          <StyledOrText>or</StyledOrText>
          <VoteButton buttonVoteOptionValue="0" {...this.props} />
        </VoteOptionsContainer>

        <SaltInput
          salt={this.props.salt}
          label="Enter your secret phrase"
          name="salt"
          onChange={this.onChange}
          invalid={!!this.state.saltError}
          invalidMessage={this.state.saltError}
        />

        <TransactionButtonNoModal
          transactions={this.props.transactions}
          disabled={!canReveal}
          postExecuteTransactions={this.props.postExecuteTransactions}
        >
          <RevealVoteButtonText />
        </TransactionButtonNoModal>
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
