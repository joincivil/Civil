import * as React from "react";
import * as ReactDOM from "react-dom";
import { TransactionButton } from "../TransactionButton";
import {
  StyledCreateProposalOuter,
  StyledCreateProposalContainer,
  StyledCreateProposalHeader,
  StyledCreateProposalHeaderClose,
  StyledCreateProposalContent,
  StyledSection,
  StyledMetaName,
  StyledMetaValue,
  MetaSingleLine,
} from "./styledComponents";
import {
  ChallengeProposalHeaderText,
  ChallengeProposalDescriptionText,
  CreateProposalParamNameLabelText,
  CreateProposalParamCurrentValueLabelText,
  CreateProposalTokenDepositText,
  ChallengeProposalNewValueLabelText,
} from "./textComponents";

export interface ChallengeProposalProps {
  parameterDisplayName: string | JSX.Element;
  parameterCurrentValue: string;
  parameterNewValue: string;
  parameterProposalValue: string;
  proposalDeposit: string;
  transactions?: any[];
  modalContentComponents?: any;
  handleClose(): void;
  postExecuteTransactions?(): any;
}

export class ChallengeProposal extends React.Component<ChallengeProposalProps> {
  public bucket: HTMLDivElement = document.createElement("div");

  public componentDidMount(): void {
    document.body.appendChild(this.bucket);
  }

  public componentWillUnmount(): void {
    document.body.removeChild(this.bucket);
  }

  public render(): React.ReactPortal {
    return ReactDOM.createPortal(
      <StyledCreateProposalOuter>
        <StyledCreateProposalContainer>
          <StyledCreateProposalHeader>
            <ChallengeProposalHeaderText />
            <StyledCreateProposalHeaderClose onClick={this.props.handleClose}>✖</StyledCreateProposalHeaderClose>
          </StyledCreateProposalHeader>

          <StyledCreateProposalContent>
            <StyledSection>
              <ChallengeProposalDescriptionText />
            </StyledSection>

            <StyledSection>
              <StyledMetaName>
                <CreateProposalParamNameLabelText />
              </StyledMetaName>
              <StyledMetaValue>{this.props.parameterDisplayName}</StyledMetaValue>
            </StyledSection>

            <StyledSection>
              <StyledMetaName>
                <CreateProposalParamCurrentValueLabelText />
              </StyledMetaName>
              <StyledMetaValue>{this.props.parameterCurrentValue}</StyledMetaValue>
            </StyledSection>

            <StyledSection>
              <StyledMetaName>
                <ChallengeProposalNewValueLabelText />
              </StyledMetaName>
              <StyledMetaValue>{this.props.parameterNewValue}</StyledMetaValue>
            </StyledSection>

            <StyledSection>
              <MetaSingleLine>
                <StyledMetaName>
                  <CreateProposalTokenDepositText />
                </StyledMetaName>
                <StyledMetaValue>{this.props.proposalDeposit}</StyledMetaValue>
              </MetaSingleLine>
              <TransactionButton
                transactions={this.props.transactions!}
                modalContentComponents={this.props.modalContentComponents}
                postExecuteTransactions={this.props.postExecuteTransactions}
              >
                Confirm With Metamask
              </TransactionButton>
            </StyledSection>
          </StyledCreateProposalContent>
        </StyledCreateProposalContainer>
      </StyledCreateProposalOuter>,
      this.bucket,
    );
  }
}
