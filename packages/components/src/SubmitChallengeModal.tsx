import * as React from "react";
import RichTextEditor from "react-rte";
import styled, { StyledComponentClass } from "styled-components";
import { FullScreenModal } from "./FullscreenModal";
import { Heading } from "./Heading";
import { StepProcess, StepProps } from "./StepProcess";
import { SectionHeader } from "./StepProcess/StepHeader";
import { StepStyledFluid } from "./StepProcess/StepStyled";
import { InputGroup, TextareaInput } from "./input";
import { buttonSizes, CancelButton } from "./Button";
import { TransactionButton } from "./TransactionButton";
import { colors, fonts } from "./styleConstants";

const SUMMARY_MAX_LENGTH = 120;

export interface CloseModalButtonProps {
  onClick(): void;
}

const CloseModalButton = styled<CloseModalButtonProps, "div">("div")`
  color: ${colors.accent.CIVIL_GRAY_1}
  cursor: pointer;
  font-size: 16px;
  line-height: 19px;
  margin: 0 0 45px;

  &:hover {
    color: ${colors.primary.CIVIL_BLUE_1};
  }
`;

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
  color: ${colors.primary.CIVIL_GRAY_2};
  font: normal 16px/19px ${fonts.SANS_SERIF};
  margin: 0 0 24px;
`;

const SubmitChallengeModalOuter = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  overflow: hidden scroll;
  width: 100vw;
`;

const SubmitChallengeModalContent = styled.div`
  padding: 32px 0 156px;
  width: 582px;
`;

const FormInputGroup = styled.div`
  margin: 0 0 24px;
`;

const PullRight = styled.div`
  float: right;
`;

const CancelButtonWithMargin = CancelButton.extend`
  margin-right: 10px;
`;

export interface SubmitChallengeModalProps {
  open?: boolean;
  constitutionURI: string;
  minDeposit: string;
  dispensationPct: string;
  transactions: any[];
  modalContentComponents?: { [index: string]: JSX.Element };
  updateStatementValue(value: any): void;
  updateStatementSummaryValue(value: string): void;
  handleClose?(): void;
  postExecuteTransactions?(): void;
}

export interface SubmitChallengeModalState {
  summaryValue: string;
  value: any;
}

export class SubmitChallengeModal extends React.Component<
  StepProps & SubmitChallengeModalProps,
  SubmitChallengeModalState
> {
  constructor(props: SubmitChallengeModalProps) {
    super(props);
    this.state = {
      summaryValue: "",
      value: RichTextEditor.createEmptyValue(),
    };
  }

  public render(): JSX.Element {
    return (
      <FullScreenModal open={this.props.open || false}>
        <SubmitChallengeModalOuter>
          <SubmitChallengeModalContent>
            <CloseModalButton onClick={this.closeModal}>
              <PullRight>Close ✕</PullRight>
            </CloseModalButton>
            <ModalHeading>Challenge this Newsroom listing</ModalHeading>
            <CopyLarge>
              CVL token holders may challenge any newsroom believed to be in breach of the{" "}
              <a href={this.props.constitutionURI} target="_blank">
                Civil Constitution
              </a>. This includes new applications and approved newsrooms. After a challenge is submitted, the CVL
              token-holder community will have 5 days to vote on whether the newsroom can stay on the Civil Registry.
            </CopyLarge>
            <CopyLarge>
              {" "}
              This challenge requires a deposit of <strong>{this.props.minDeposit} CVL tokens</strong>.
            </CopyLarge>
            <StepProcess>
              {this.renderChallengeReason()}
              {this.renderChallengeForm()}
            </StepProcess>
          </SubmitChallengeModalContent>
        </SubmitChallengeModalOuter>
      </FullScreenModal>
    );
  }

  public handleValueChange = (value: any) => {
    this.setState({ value });
    this.props.updateStatementValue(value);
  };

  public handleSummaryValueChange = (fieldName: string, summaryValue: string) => {
    this.setState({ summaryValue });
    this.props.updateStatementSummaryValue(summaryValue);
  };

  private closeModal = () => {
    if (this.props.handleClose) {
      this.props.handleClose();
    }
  };

  private renderChallengeReason = (): JSX.Element => {
    return (
      <StepStyledFluid index={this.props.index || 0}>
        <ModalSectionHeader>State reasons for your challenge</ModalSectionHeader>
        <CopyLarge>Enter a summary of the reasons for your challenge (Max 120 characters)</CopyLarge>
        <SectionFormOuter>
          <FormInputGroup>
            <TextareaInput
              name="challenge_statement_summary"
              value={this.state.summaryValue}
              onChange={this.handleSummaryValueChange}
              maxLength={SUMMARY_MAX_LENGTH.toString()}
            />
          </FormInputGroup>
        </SectionFormOuter>

        <CopyLarge>
          State reasons why you are challenging this Newsroom. Please include as much detail as possible, and{" "}
          <a href={this.props.constitutionURI} target="_blank">
            provide evidence
          </a>{" "}
          to support your statements.
        </CopyLarge>
        <SectionFormOuter>
          <FormInputGroup>
            <RichTextEditor value={this.state.value} onChange={this.handleValueChange} />
          </FormInputGroup>
        </SectionFormOuter>
      </StepStyledFluid>
    );
  };

  private renderChallengeForm = (): JSX.Element => {
    // TODO(jon): Add DetailTransactionButton with estimate functon
    return (
      <StepStyledFluid index={this.props.index || 0}>
        <ModalSectionHeader>Deposit CVL tokens for your challenge</ModalSectionHeader>
        <CopyLarge>
          This challenge requires a deposit of 1,000 CVL tokens. If you don’t have enough CVL tokens,{" "}
          <a href="#">buy more here</a>.
        </CopyLarge>
        <InputGroup name="challenge_deposit" prepend="CVL" readOnly={true} value={this.props.minDeposit} />
        <CopyHelper>Your percentage reward if successful is {this.props.dispensationPct}</CopyHelper>
        <PullRight>
          <CancelButtonWithMargin size={buttonSizes.MEDIUM} onClick={this.closeModal}>
            Cancel
          </CancelButtonWithMargin>

          <TransactionButton
            size={buttonSizes.MEDIUM}
            modalContentComponents={this.props.modalContentComponents}
            transactions={this.props.transactions}
            postExecuteTransactions={this.props.postExecuteTransactions}
          >
            Submit Challenge
          </TransactionButton>
        </PullRight>
      </StepStyledFluid>
    );
  };
}
