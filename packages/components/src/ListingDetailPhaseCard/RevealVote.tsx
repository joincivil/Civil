import * as React from "react";
import { buttonSizes, Button, DarkButton } from "../Button";
import { SaltInput } from "../input/";
import { TransactionButtonNoModal } from "../TransactionButton";
import { FormQuestion, StyledOrText, VoteOptionsContainer, buttonTheme } from "./styledComponents";
import { WhitelistActionText, RemoveActionText, VoteCallToActionText, RevealVoteButtonText } from "./textComponents";
import { RevealVoteProps } from "./types";

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
    return (
      <>
        <FormQuestion>
          {this.props.children || <VoteCallToActionText newsroomName={this.props.newsroomName} />}
        </FormQuestion>

        <VoteOptionsContainer>
          {this.renderVoteButton({ voteOption: "1" })}
          <StyledOrText>or</StyledOrText>
          {this.renderVoteButton({ voteOption: "0" })}
        </VoteOptionsContainer>

        <SaltInput
          salt={this.props.salt}
          label="Enter your salt"
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

  private renderVoteButton = (options: any): JSX.Element => {
    let buttonText;
    const { voteOption } = options;
    const ButtonComponent = this.props.voteOption === voteOption ? Button : DarkButton;
    const onClick = () => {
      this.props.onInputChange({ voteOption });
    };
    if (voteOption === "1") {
      buttonText = (
        <>
          ✔ <WhitelistActionText />
        </>
      );
    } else if (voteOption === "0") {
      buttonText = (
        <>
          ✖ <RemoveActionText />
        </>
      );
    }

    return (
      <ButtonComponent onClick={onClick} size={buttonSizes.MEDIUM} theme={buttonTheme}>
        {buttonText}
      </ButtonComponent>
    );
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
