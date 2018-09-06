import * as React from "react";
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
  parameterDisplayName: string | JSX.Element;
  parameterCurrentValue: string;
  parameterDisplayUnits: string;
  parameterProposalValue: string;
  proposalDeposit: string;
  transactions?: any[];
  modalContentComponents?: any;
  handleClose(): void;
  handleUpdateProposalValue(name: string, value: string): void;
}

export const CreateProposal: React.SFC<CreateProposalProps> = props => {
  return (
    <StyledCreateProposalOuter>
      <StyledCreateProposalContainer>
        <StyledCreateProposalHeader>
          <CreateProposalHeaderText />
          <StyledCreateProposalHeaderClose onClick={props.handleClose}>✖</StyledCreateProposalHeaderClose>
        </StyledCreateProposalHeader>

        <StyledCreateProposalContent>
          <StyledSection>
            <CreateProposalDescriptionText />
          </StyledSection>

          <StyledSection>
            <StyledMetaName>
              <CreateProposalParamNameLabelText />
            </StyledMetaName>
            <StyledMetaValue>{props.parameterDisplayName}</StyledMetaValue>
          </StyledSection>

          <StyledSection>
            <StyledMetaName>
              <CreateProposalParamCurrentValueLabelText />
            </StyledMetaName>
            <StyledMetaValue>{props.parameterCurrentValue}</StyledMetaValue>
          </StyledSection>

          <StyledSection>
            <InputGroup
              append={props.parameterDisplayUnits}
              label="Enter proposed value"
              placeholder="Enter a proposed value"
              name="proposalValue"
              value={props.parameterProposalValue}
              onChange={props.handleUpdateProposalValue}
              icon={<></>}
            />
          </StyledSection>

          <StyledSection>
            <MetaSingleLine>
              <StyledMetaName>
                <CreateProposalTokenDepositText />
              </StyledMetaName>
              <StyledMetaValue>{props.proposalDeposit}</StyledMetaValue>
            </MetaSingleLine>
            <TransactionButton transactions={props.transactions!} modalContentComponents={props.modalContentComponents}>
              Confirm With Metamask
            </TransactionButton>
          </StyledSection>
        </StyledCreateProposalContent>
      </StyledCreateProposalContainer>
    </StyledCreateProposalOuter>
  );
};
