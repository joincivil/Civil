import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { FullScreenModal } from "./FullscreenModal";
import { Heading } from "./Heading";
import { StepProcess, StepProps } from "./StepProcess";
import { SectionHeader } from "./StepProcess/StepHeader";
import { StepDescription, StepStyledFluid } from "./StepProcess/StepStyled";
import { TextareaInput, InputGroup } from "./input";
import { InvertedButton, buttonSizes } from "./Button";
import { TransactionButton } from "./TransactionButton";
import { fonts } from "./styleConstants";

const ModalHeading = Heading.extend`
  font-size: 32px;
  font-weight: bold;
  line-height: 40px;
`;

const ModalSectionHeader = SectionHeader.extend`
  font-size: 22px;
  font-weight: bold;
  margin: 0;
  line-height: 33px;
`;

const SectionFormOuter = styled.div`
  margin: 24px 0 0;
`;

const CopyLarge = styled.p`
  font: normal 18px/33px ${fonts.SANS_SERIF};
  margin: 0 0 24px;
`;

const CopyHelper = styled.p`
  font: normal 16px/19px ${fonts.SANS_SERIF};
  margin: -12px 0 32px;
`;

const SubmitChallengeModalOuter = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  overflow: hidden scroll;
  width: 100vw;
`;

const SubmitChallengeModalContent = styled.div`
  width: 582px;
`;

const PullRight = styled.div`
  float: right;
`;

export interface SubmitChallengeModalProps {
  constitutionURI: string;
  minDeposit: string;
  dispensationPct: string;
  transactions: any[];
}

export class SubmitChallengeModal extends React.Component<StepProps & SubmitChallengeModalProps> {
  public render(): JSX.Element {
    return (
      <FullScreenModal open={true} >
        <SubmitChallengeModalOuter>
          <SubmitChallengeModalContent>
            <ModalHeading>Challenge this Newsroom listing</ModalHeading>
            <CopyLarge>CVL token holders may challenge any newsroom believed to be in breach of the <a href={this.props.constitutionURI}>Civil Constitution</a>. This includes new applications and approved newsrooms. After a challenge is submitted, the CVL token-holder community will have 5 days to vote on whether the newsroom can stay on the Civil Registry.</CopyLarge>
            <CopyLarge> This challenge requires a deposit of <strong>{this.props.minDeposit} CVL tokens</strong>.</CopyLarge>
          <StepProcess>
            {this.renderChallengeReason()}
            {this.renderChallengeForm()}
          </StepProcess>
          </SubmitChallengeModalContent>
        </SubmitChallengeModalOuter>
      </FullScreenModal>
    );
  }

  private renderChallengeReason = (): JSX.Element => {
    return (
      <StepStyledFluid index={this.props.index || 0}>
        <ModalSectionHeader>State reasons for your challenge</ModalSectionHeader>
        <CopyLarge>State reasons why you are challenging this Newsroom. If possible, <a href="#">provide evidence</a> to support your statements.</CopyLarge>
        <SectionFormOuter>
          <TextareaInput name="challenge_reason" />
          <PullRight>
            <InvertedButton size={buttonSizes.MEDIUM}>Post Statement</InvertedButton>
          </PullRight>
        </SectionFormOuter>
      </StepStyledFluid>
    );
  };

  private renderChallengeForm = (): JSX.Element => {
    // TODO(jon): Add DetailTransactionButton with estimate functon
    return (
      <StepStyledFluid index={this.props.index || 0}>
        <ModalSectionHeader>Deposit CVL tokens for your challenge</ModalSectionHeader>
        <CopyLarge>This challenge requires a deposit of 1,000 CVL tokens. If you don’t have enough CVL tokens, <a href="#">buy more here</a>.</CopyLarge>
        <InputGroup
          name="challenge_deposit"
          prepend="CVL"
          disabled={true}
          value={this.props.minDeposit}
        />
        <CopyHelper>Your percentage reward if successful is {this.props.dispensationPct}</CopyHelper>
        <TransactionButton size={buttonSizes.MEDIUM} transactions={this.props.transactions}>
        </TransactionButton>
      </StepStyledFluid>
    );
  };
}
