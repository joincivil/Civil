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

const StyledLi = styled.li`
  font-size: 21px;
  letter-sizing: 25px;
  padding: 0;
  margin: 0 0 17px;
`;

const StyledLiContent = styled.span`
  font-size: 18px;
  letter-sizing: 33px;
`;

const StyledOl = styled.ol`
  margin: 13px 0 21px;
  padding: 0 0 0 39px;
`;

const CopySmall = styled.p`
  font-size: 14px;
  line-height: 20px;
  margin: 0 0 30px;
`;

const CopyHelper = styled.p`
  color: ${colors.primary.CIVIL_GRAY_2};
  font: normal 16px/19px ${fonts.SANS_SERIF};
  margin: 0 0 24px;
`;

const RequestAppealModalOuter = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  overflow: hidden scroll;
  width: 100vw;
`;

const RequestAppealModalContent = styled.div`
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

const StyledLink = styled.a`
  border-bottom: 1px solid transparent;
  color: ${colors.accent.CIVIL_BLUE};
  text-decoration: none;

  &:hover {
    border-bottom-color: ${colors.accent.CIVIL_BLUE};
  }
`;

export interface RequestAppealModalProps {
  open?: boolean;
  constitutionURI: string;
  governanceGuideUrl: string;
  appealFee: string;
  judgeAppealLen: string;
  transactions: any[];
  modalContentComponents?: { [index: string]: JSX.Element };
  updateStatementValue(key: string, value: any): void;
  handleClose?(): void;
  postExecuteTransactions?(): void;
}

export interface RequestAppealModalState {
  summaryValue: string;
  citeConstitutionValue: any;
  detailsValue: any;
}

export class RequestAppealModal extends React.Component<StepProps & RequestAppealModalProps, RequestAppealModalState> {
  constructor(props: RequestAppealModalProps) {
    super(props);
    this.state = {
      summaryValue: "",
      citeConstitutionValue: RichTextEditor.createEmptyValue(),
      detailsValue: RichTextEditor.createEmptyValue(),
    };
  }

  public render(): JSX.Element {
    return (
      <FullScreenModal open={this.props.open || false}>
        <RequestAppealModalOuter>
          <RequestAppealModalContent>
            <CloseModalButton onClick={this.closeModal}>
              <PullRight>Close ✕</PullRight>
            </CloseModalButton>
            <ModalHeading>Request an Appeal</ModalHeading>
            <CopyLarge>
              A deposit of <strong>{this.props.appealFee} tokens</strong> is required to request an appeal. Read our{" "}
              <StyledLink href={this.props.governanceGuideUrl}>governance guide</StyledLink> before you begin.
            </CopyLarge>
            <StyledOl>
              <StyledLi>
                <StyledLiContent>State reasons for your request to appeal</StyledLiContent>
              </StyledLi>
              <StyledLi>
                <StyledLiContent>Deposit CVL tokens to request to appeal</StyledLiContent>
              </StyledLi>
            </StyledOl>
            <CopySmall>
              After a request is submitted, the Civil Council will have {this.props.judgeAppealLen} to rule on the
              appeal.
            </CopySmall>
            <StepProcess>
              {this.renderChallengeReason()}
              {this.renderChallengeForm()}
            </StepProcess>
          </RequestAppealModalContent>
        </RequestAppealModalOuter>
      </FullScreenModal>
    );
  }

  public handleDetailsValueChange = (detailsValue: any) => {
    this.setState({ detailsValue });
    this.props.updateStatementValue("detailsValue", detailsValue);
  };

  public handleCiteConstitutionValueChange = (citeConstitutionValue: any) => {
    this.setState({ citeConstitutionValue });
    this.props.updateStatementValue("citeConstitutionValue", citeConstitutionValue);
  };

  public handleSummaryValueChange = (fieldName: string, summaryValue: string) => {
    this.setState({ summaryValue });
    this.props.updateStatementValue("summaryValue", summaryValue);
  };

  private closeModal = () => {
    if (this.props.handleClose) {
      this.props.handleClose();
    }
  };

  private renderChallengeReason = (): JSX.Element => {
    return (
      <StepStyledFluid index={this.props.index || 0}>
        <div>
          <ModalSectionHeader>State reasons for your request to appeal</ModalSectionHeader>
          <CopyLarge>Write 1-2 sentences about why you’re appealing this challenge (required)</CopyLarge>
          <CopyHelper>Max character limit: 120</CopyHelper>
          <SectionFormOuter>
            <FormInputGroup>
              <TextareaInput
                name="request_appeal_statement_summary"
                value={this.state.summaryValue}
                onChange={this.handleSummaryValueChange}
                maxLength={SUMMARY_MAX_LENGTH.toString()}
              />
            </FormInputGroup>
          </SectionFormOuter>

          <CopyLarge>
            Please cite sections of the Civil Constitution that you believe support your position on why the vote should
            be overturned. (required)
          </CopyLarge>
          <CopyHelper>
            <StyledLink href={this.props.constitutionURI}>See Civil Constitution</StyledLink>
          </CopyHelper>
          <SectionFormOuter>
            <FormInputGroup>
              <RichTextEditor
                value={this.state.citeConstitutionValue}
                onChange={this.handleCiteConstitutionValueChange}
              />
            </FormInputGroup>
          </SectionFormOuter>

          <CopyLarge>Add details and evidence to support your statements. (required)</CopyLarge>
          <CopyHelper>
            Help the Civil Council consider your request by providing as much information as possible to support your
            case.{" "}
          </CopyHelper>
          <SectionFormOuter>
            <FormInputGroup>
              <RichTextEditor value={this.state.detailsValue} onChange={this.handleDetailsValueChange} />
            </FormInputGroup>
          </SectionFormOuter>
        </div>
      </StepStyledFluid>
    );
  };

  private renderChallengeForm = (): JSX.Element => {
    return (
      <StepStyledFluid index={this.props.index || 0}>
        <div>
          <ModalSectionHeader>Deposit CVL tokens for your challenge</ModalSectionHeader>
          <CopyLarge>
            This appeal request requires a deposit of {this.props.appealFee} tokens. If you don’t have enough CVL
            tokens, <a href="#">buy more here</a>.
          </CopyLarge>
          <InputGroup name="request_appeal_fee" prepend="CVL" readOnly={true} value={this.props.appealFee} />
          <PullRight>
            <CancelButtonWithMargin size={buttonSizes.MEDIUM} onClick={this.closeModal}>
              Cancel
            </CancelButtonWithMargin>

            <TransactionButton
              modalContentComponents={this.props.modalContentComponents}
              transactions={this.props.transactions}
              postExecuteTransactions={this.props.postExecuteTransactions}
            >
              Request Appeal
            </TransactionButton>
          </PullRight>
        </div>
      </StepStyledFluid>
    );
  };
}
