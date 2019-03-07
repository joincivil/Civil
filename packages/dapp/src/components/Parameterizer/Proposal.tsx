import * as React from "react";
import { BigNumber } from "bignumber.js";
import { ParamProposalState } from "@joincivil/core";
import { getFormattedParameterValue } from "@joincivil/utils";
import { Tr, Td, StyledTableAccentText, TextCountdownTimer } from "@joincivil/components";
import { getCivil } from "../../helpers/civilInstance";

import { StyledHiddenOnMobile } from "./Parameter";

export interface ProposalProps {
  proposal: any;
  parameterName: string;
  parameterValue: BigNumber;
  handleProposalAction(paramName: string, currentValue: string, newValue: string, proposal: any): void;
}

export class Proposal extends React.Component<ProposalProps> {
  public render(): JSX.Element {
    return (
      <Tr>
        <Td>
          <StyledTableAccentText>{this.getFormattedValue(this.props.proposal.propValue)}</StyledTableAccentText>
        </Td>
        {this.renderProposalStageActions()}
      </Tr>
    );
  }

  private renderProposalStageActions = (): JSX.Element => {
    const propState = this.props.proposal.state;
    switch (propState) {
      case ParamProposalState.APPLYING:
        return this.renderCanBeChallenged();
      case ParamProposalState.CHALLENGED_IN_COMMIT_VOTE_PHASE:
        return this.renderCommitState();
      case ParamProposalState.CHALLENGED_IN_REVEAL_VOTE_PHASE:
        return this.renderRevealState();
      case ParamProposalState.READY_TO_PROCESS:
        return this.renderUpdateParam();
      case ParamProposalState.READY_TO_RESOLVE_CHALLENGE:
        return this.renderResolveChallenge();
      default:
        return <></>;
    }
  };

  private renderCanBeChallenged = (): JSX.Element => {
    return (
      <>
        <Td>
          <TextCountdownTimer endTime={this.props.proposal.applicationExpiry.valueOf() / 1000} />
        </Td>
        <Td align="right">
          <StyledHiddenOnMobile>
            <StyledTableAccentText strong>
              <span onClick={this.onProposalAction}>Challenge Proposal</span>
            </StyledTableAccentText>
          </StyledHiddenOnMobile>
        </Td>
      </>
    );
  };

  private renderUpdateParam = (): JSX.Element => {
    return (
      <>
        <Td>
          <TextCountdownTimer endTime={this.props.proposal.propProcessByExpiry.valueOf() / 1000} />
        </Td>
        <Td align="right">
          <StyledHiddenOnMobile>
            <StyledTableAccentText strong>
              <span onClick={this.onProposalAction}>Update Parameter</span>
            </StyledTableAccentText>
          </StyledHiddenOnMobile>
        </Td>
      </>
    );
  };

  private renderResolveChallenge = (): JSX.Element => {
    return (
      <>
        <Td>
          <TextCountdownTimer endTime={this.props.proposal.propProcessByExpiry.valueOf() / 1000} />
        </Td>
        <Td align="right">
          <StyledHiddenOnMobile>
            <StyledTableAccentText strong>
              <span onClick={this.onProposalAction}>Resolve Challenge</span>
            </StyledTableAccentText>
          </StyledHiddenOnMobile>
        </Td>
      </>
    );
  };

  private renderCommitState = (): JSX.Element => {
    return (
      <>
        <Td>
          <TextCountdownTimer endTime={this.props.proposal.challenge.challengeCommitExpiry.valueOf() / 1000} />
        </Td>
        <Td align="right">
          <StyledHiddenOnMobile>
            <StyledTableAccentText strong>
              <span onClick={this.onProposalAction}>Commit Vote</span>
            </StyledTableAccentText>
          </StyledHiddenOnMobile>
        </Td>
      </>
    );
  };

  private renderRevealState = (): JSX.Element => {
    return (
      <>
        <Td>
          <TextCountdownTimer endTime={this.props.proposal.challenge.challengeRevealExpiry.valueOf() / 1000} />
        </Td>
        <Td align="right">
          <StyledHiddenOnMobile>
            <StyledTableAccentText strong>
              <span onClick={this.onProposalAction}>Reveal Vote</span>
            </StyledTableAccentText>
          </StyledHiddenOnMobile>
        </Td>
      </>
    );
  };

  private onProposalAction = (event: any) => {
    this.props.handleProposalAction(
      this.props.parameterName,
      this.getFormattedValue(this.props.parameterValue),
      this.getFormattedValue(this.props.proposal!.propValue),
      this.props.proposal,
    );
  };

  private getFormattedValue = (parameterValue: BigNumber): string => {
    const civil = getCivil();
    return getFormattedParameterValue(this.props.parameterName, civil.toBigNumber(parameterValue.toString()));
  };
}
