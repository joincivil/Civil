import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { Modal } from "./Modal";
import { Heading } from "./Heading";
import { StepProcess, StepProps } from "./StepProcess";
import { StepHeader } from "./StepProcess/StepHeader";
import { StepDescription, StepStyled } from "./StepProcess/StepStyled";
import { TextareaInput } from "./input";
import { fonts } from "./styleConstants";

const CopyLarge = styled.p`
  font: normal 18px/33px ${fonts.SANS_SERIF};
`;

export class SubmitChallengeModal extends React.Component<StepProps> {
  public render(): JSX.Element {
    return (
      <Modal>
        <Heading>Challenge this Newsroom listing</Heading>
        <CopyLarge>CVL token holders may challenge any newsroom believed to be in breach of the <a href="#">Civil Constitution</a>. This includes new applications and approved newsrooms. After a challenge is submitted, the CVL token-holder community will have 5 days to vote on whether the newsroom can stay on the Civil Registry.</CopyLarge>
        <CopyLarge> This challenge requires a deposit of <strong>1,000 CVL tokens</strong>.</CopyLarge>
        {this.renderChallengeReason()}
        {this.renderChallengeForm()}
      </Modal>
    );
  }

  private renderChallengeReason = (): JSX.Element => {
    return (
      <StepStyled index={this.props.index || 0}>
        <StepHeader>State reasons for your challenge</StepHeader>
        <StepDescription>State reasons why you are challenging this Newsroom. If possible, <a href="#">provide evidence</a> to support your statements.</StepDescription>
        <TextareaInput name="challenge_reason" />
      </StepStyled>
    );
  };

  private renderChallengeForm = (): JSX.Element => {
    return (
      <StepStyled index={this.props.index || 0}>
        <StepHeader>Deposit CVL tokens for your challenge</StepHeader>
        <StepDescription>State reasons for your challenge</StepDescription>
      </StepStyled>
    );
  };
}
