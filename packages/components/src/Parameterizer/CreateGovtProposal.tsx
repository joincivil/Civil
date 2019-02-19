import * as React from "react";
import * as ReactDOM from "react-dom";
import { InputGroup } from "../input";
import { TransactionButtonNoModal } from "../TransactionButton";
import {
  StyledCreateProposalOuter,
  StyledCreateProposalContainer,
  StyledCreateProposalHeader,
  StyledCreateProposalHeaderClose,
  StyledCreateProposalContent,
  StyledSection,
  StyledMetaName,
  StyledMetaValue,
} from "./ParameterizerStyledComponents";
import {
  CreateProposalHeaderText,
  CreateProposalParamNameLabelText,
  CreateProposalParamCurrentValueLabelText,
} from "./textComponents";

export interface CreateGovtProposalProps {
  parameterDisplayName: string | JSX.Element;
  parameterCurrentValue: string;
  parameterDisplayUnits: string;
  parameterProposalValue: string;
  transactions?: any[];
  handleClose(): void;
  handleUpdateProposalValue(name: string, value: string): void;
  postExecuteTransactions?(): any;
}

export interface CreateGovtProposalState {
  parameterProposalValue: string;
}

export class CreateGovtProposal extends React.Component<CreateGovtProposalProps, CreateGovtProposalState> {
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
              <TransactionButtonNoModal
                transactions={this.props.transactions!}
                postExecuteTransactions={this.props.postExecuteTransactions}
              >
                Confirm With Metamask
              </TransactionButtonNoModal>
            </StyledSection>
          </StyledCreateProposalContent>
        </StyledCreateProposalContainer>
      </StyledCreateProposalOuter>,
      this.bucket,
    );
  }
}
