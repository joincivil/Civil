import * as React from "react";
import * as ReactDOM from "react-dom";
import { TransactionButtonNoModal } from "../TransactionButton";
import { ChallengeResults, ChallengeResultsProps } from "../ChallengeResultsChart";
import {
  StyledCreateProposalOuter,
  StyledChallengeProposalContainer,
  StyledCreateProposalHeaderClose,
  StyledCreateProposalContent,
  StyledSection,
  StyledMetaName,
  StyledMetaValue,
} from "./ParameterizerStyledComponents";
import {
  ResolveChallengeProposalDescriptionText,
  CreateProposalParamNameLabelText,
  CreateProposalParamCurrentValueLabelText,
  ChallengeProposalNewValueLabelText,
} from "./textComponents";

export interface ResolveChallengeProposalProps {
  parameterDisplayName: string | JSX.Element;
  parameterCurrentValue: string;
  parameterNewValue: string;
  transactions?: any[];
  handleClose(): void;
  postExecuteTransactions?(): any;
}

export class ResolveChallengeProposal extends React.Component<ResolveChallengeProposalProps & ChallengeResultsProps> {
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
        <StyledChallengeProposalContainer>
          <StyledCreateProposalHeaderClose onClick={this.props.handleClose}>✖</StyledCreateProposalHeaderClose>

          <StyledCreateProposalContent>
            <StyledSection>
              <ResolveChallengeProposalDescriptionText />
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
              <ChallengeResults
                collapsable={true}
                totalVotes={this.props.totalVotes}
                votesFor={this.props.votesFor}
                votesAgainst={this.props.votesAgainst}
                percentFor={this.props.percentFor}
                percentAgainst={this.props.percentAgainst}
                didChallengeSucceed={this.props.didChallengeSucceed}
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
        </StyledChallengeProposalContainer>
      </StyledCreateProposalOuter>,
      this.bucket,
    );
  }
}
