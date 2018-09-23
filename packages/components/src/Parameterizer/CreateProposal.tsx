import * as React from "react";
import * as ReactDOM from "react-dom";
import { InputGroup } from "../input";
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
  CreateProposalHeaderText,
  CreateProposalDescriptionText,
  CreateProposalParamNameLabelText,
  CreateProposalParamCurrentValueLabelText,
  CreateProposalTokenDepositText,
} from "./textComponents";

export interface CreateProposalProps {
  pApplyLenText: string | JSX.Element;
  parameterDisplayName: string | JSX.Element;
  parameterCurrentValue: string;
  parameterDisplayUnits: string;
  parameterProposalValue: string;
  proposalDeposit: string;
  transactions?: any[];
  modalContentComponents?: any;
  handleClose(): void;
  handleUpdateProposalValue(name: string, value: string): void;
  postExecuteTransactions?(): any;
}

export class CreateProposal extends React.Component<CreateProposalProps> {
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
            <CreateProposalHeaderText />
            <StyledCreateProposalHeaderClose onClick={this.props.handleClose}>✖</StyledCreateProposalHeaderClose>
          </StyledCreateProposalHeader>

          <StyledCreateProposalContent>
            <StyledSection>
              <CreateProposalDescriptionText applicationLenText={this.props.pApplyLenText} />
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
              <InputGroup
                append={this.props.parameterDisplayUnits}
                label="Enter proposed value"
                placeholder="Enter a proposed value"
                name="proposalValue"
                value={this.props.parameterProposalValue}
                onChange={this.props.handleUpdateProposalValue}
                icon={<></>}
              />
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
