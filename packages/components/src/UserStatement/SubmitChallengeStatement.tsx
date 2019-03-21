import * as React from "react";
import RichTextEditor from "react-rte";
import { TextareaInput } from "../input";
import { buttonSizes, SecondaryButton } from "../Button";
import { TransactionButtonNoModal } from "../TransactionButton";
import {
  StyledErrorMessage,
  StyledUserStatementHeaderOuter,
  StyledUserStatementHeader,
  StatementHeaderHeading,
  StatementHeaderNewsroomName,
  StyledUserStatementBodyOuter,
  StyledUserStatementBody,
  CopyLarge,
  StyledLi,
  StyledLiContent,
  StyledOl,
  CopySmall,
  StyledLink,
  BodyHeader,
  BodyCopyHelper,
  SectionForm,
  SectionFormHeader,
  SectionFormCopyHelper,
  StyledTextareaContainer,
  SectionDeposit,
  StyledDepositLabel,
  StyledDepositAmount,
  SectionActions,
  PullRight,
} from "./styledComponents";

export interface SubmitChallengeStatementProps {
  constitutionURI?: string;
  governanceGuideURI?: string;
  listingURI?: string;
  minDeposit?: string;
  commitStageLen?: string;
  revealStageLen?: string;
  newsroomName?: string;
  transactions: any[];
  modalContentComponents?: { [index: string]: JSX.Element };
  updateStatementValue(key: string, value: any): void;
  postExecuteTransactions?(): void;
}

export interface SubmitChallengeStatementState {
  summaryValue: string;
  citeConstitutionValue: any;
  detailsValue: any;
}

const SUMMARY_MAX_LENGTH = 120;

export class SubmitChallengeStatement extends React.Component<
  SubmitChallengeStatementProps,
  SubmitChallengeStatementState
> {
  constructor(props: SubmitChallengeStatementProps) {
    super(props);
    this.state = {
      summaryValue: "",
      citeConstitutionValue: RichTextEditor.createEmptyValue(),
      detailsValue: RichTextEditor.createEmptyValue(),
    };
  }

  public render(): JSX.Element {
    return (
      <>
        <StyledUserStatementHeaderOuter>
          <StyledUserStatementHeader>
            <StatementHeaderHeading>Challenge Newsroom</StatementHeaderHeading>
            <StatementHeaderNewsroomName>{this.props.newsroomName}</StatementHeaderNewsroomName>
            <CopyLarge>
              A deposit of <strong>{this.props.minDeposit} tokens</strong> is required to challenge a newsroom. Read our{" "}
              <StyledLink href={this.props.governanceGuideURI}>governance guide</StyledLink> before you begin.
            </CopyLarge>
            <StyledOl>
              <StyledLi>
                <StyledLiContent>State reasons for your challenge</StyledLiContent>
              </StyledLi>
              <StyledLi>
                <StyledLiContent>Deposit CVL tokens to challenge</StyledLiContent>
              </StyledLi>
            </StyledOl>
            <CopySmall>
              After a challenge is submitted, the CVL token-holding community will have have{" "}
              <strong>{this.props.commitStageLen} to commit their votes</strong>, followed by{" "}
              <strong>{this.props.revealStageLen} to confirm their votes.</strong>
            </CopySmall>
          </StyledUserStatementHeader>
        </StyledUserStatementHeaderOuter>
        <StyledUserStatementBodyOuter>
          <StyledUserStatementBody>
            <BodyHeader>State reasons for your challenge</BodyHeader>
            <BodyCopyHelper>Enter a summary of the reasons for your challenge (Max 120 characters)</BodyCopyHelper>

            <SectionForm>
              <SectionFormHeader>
                Write 1-2 sentences about why you’re challenging this newsroom (required)
              </SectionFormHeader>
              <SectionFormCopyHelper>Max character limit: {SUMMARY_MAX_LENGTH.toString()}</SectionFormCopyHelper>

              <StyledTextareaContainer>
                <TextareaInput
                  name="challenge_statement_summary"
                  value={this.state.summaryValue}
                  onChange={this.handleSummaryValueChange}
                  maxLength={SUMMARY_MAX_LENGTH.toString()}
                />
              </StyledTextareaContainer>
            </SectionForm>

            <SectionForm>
              <SectionFormHeader>
                Please cite the section or principles of the Civil Constitution that you believe the Newsroom has
                violated. (required)
              </SectionFormHeader>
              <SectionFormCopyHelper>
                <StyledLink href={this.props.constitutionURI} target="_blank">
                  See Civil Constitution
                </StyledLink>
              </SectionFormCopyHelper>

              <StyledTextareaContainer>
                <RichTextEditor
                  value={this.state.citeConstitutionValue}
                  onChange={this.handleCiteConstitutionValueChange}
                />
              </StyledTextareaContainer>
            </SectionForm>

            <SectionForm>
              <SectionFormHeader>Add details and evidence to support your statements. (required) </SectionFormHeader>
              <SectionFormCopyHelper>
                Help inform the Civil community to vote accordingly by providing as much information as possible to
                support your case.
              </SectionFormCopyHelper>

              <StyledTextareaContainer>
                <RichTextEditor value={this.state.detailsValue} onChange={this.handleDetailsValueChange} />
              </StyledTextareaContainer>
            </SectionForm>

            <SectionDeposit>
              <StyledDepositLabel>Total Token Deposit</StyledDepositLabel>
              <StyledDepositAmount>{this.props.minDeposit}</StyledDepositAmount>
            </SectionDeposit>

            <SectionActions>
              <div>
                <SecondaryButton size={buttonSizes.MEDIUM} to={this.props.listingURI}>
                  Cancel
                </SecondaryButton>
              </div>

              <PullRight>
                <TransactionButtonNoModal
                  transactions={this.props.transactions}
                  postExecuteTransactions={this.props.postExecuteTransactions}
                  disabled={this.isFormInvalid()}
                >
                  Confirm and Deposit CVL
                </TransactionButtonNoModal>

                <SectionFormCopyHelper>{this.renderHelperMessage()}</SectionFormCopyHelper>
              </PullRight>
            </SectionActions>
          </StyledUserStatementBody>
        </StyledUserStatementBodyOuter>
      </>
    );
  }

  private isFormInvalid = (): boolean => {
    const { summaryValue, citeConstitutionValue, detailsValue } = this.state;
    const citeConstitution = document.createElement("div");
    citeConstitution.innerHTML = citeConstitutionValue.toString("html");
    const details = document.createElement("div");
    details.innerHTML = detailsValue.toString("html");
    return !summaryValue || !summaryValue.length || !citeConstitution.innerText.length || !details.innerText.length;
  };

  private renderHelperMessage = (): JSX.Element => {
    if (this.isFormInvalid()) {
      return <StyledErrorMessage>Please check that all fields have been filled out</StyledErrorMessage>;
    }

    return <>This will pop up a separate MetaMask window to confirm your transactions.</>;
  };

  private handleSummaryValueChange = (name: string, summaryValue: string) => {
    this.setState({ summaryValue });
    this.props.updateStatementValue("summary", summaryValue);
  };

  private handleCiteConstitutionValueChange = (citeConstitutionValue: any) => {
    this.setState({ citeConstitutionValue });
    this.props.updateStatementValue("citeConstitution", citeConstitutionValue);
  };

  private handleDetailsValueChange = (detailsValue: any) => {
    this.setState({ detailsValue });
    this.props.updateStatementValue("details", detailsValue);
  };
}
