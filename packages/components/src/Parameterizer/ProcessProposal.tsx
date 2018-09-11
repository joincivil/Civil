import * as React from "react";
import { TransactionButton } from "../TransactionButton";
import {
  StyledCreateProposalOuter,
  StyledChallengeProposalContainer,
  StyledCreateProposalHeaderClose,
  StyledCreateProposalContent,
  StyledSection,
  StyledMetaName,
  StyledMetaValue,
} from "./styledComponents";
import {
  ProcessProposalDescriptionText,
  CreateProposalParamNameLabelText,
  CreateProposalParamCurrentValueLabelText,
  ChallengeProposalNewValueLabelText,
} from "./textComponents";

export interface ProcessProposalProps {
  parameterDisplayName: string | JSX.Element;
  parameterCurrentValue: string;
  parameterNewValue: string;
  parameterProposalValue: string;
  transactions?: any[];
  modalContentComponents?: any;
  handleClose(): void;
}

export const ProcessProposal: React.SFC<ProcessProposalProps> = props => {
  return (
    <StyledCreateProposalOuter>
      <StyledChallengeProposalContainer>
        <StyledCreateProposalHeaderClose onClick={props.handleClose}>✖</StyledCreateProposalHeaderClose>

        <StyledCreateProposalContent>
          <StyledSection>
            <ProcessProposalDescriptionText />
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
            <StyledMetaName>
              <ChallengeProposalNewValueLabelText />
            </StyledMetaName>
            <StyledMetaValue>{props.parameterNewValue}</StyledMetaValue>
          </StyledSection>

          <StyledSection>
            <TransactionButton transactions={props.transactions!} modalContentComponents={props.modalContentComponents}>
              Confirm With Metamask
            </TransactionButton>
          </StyledSection>
        </StyledCreateProposalContent>
      </StyledChallengeProposalContainer>
    </StyledCreateProposalOuter>
  );
};
