import * as React from "react";
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
}

export const ChallengeProposal: React.SFC<ChallengeProposalProps> = props => {
  return (
    <StyledCreateProposalOuter>
      <StyledCreateProposalContainer>
        <StyledCreateProposalHeader>
          <ChallengeProposalHeaderText />
          <StyledCreateProposalHeaderClose onClick={props.handleClose}>✖</StyledCreateProposalHeaderClose>
        </StyledCreateProposalHeader>

        <StyledCreateProposalContent>
          <StyledSection>
            <ChallengeProposalDescriptionText />
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
