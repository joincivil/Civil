import * as React from "react";
import { BigNumber } from "bignumber.js";
import { connect } from "react-redux";
import { Set } from "immutable";
import { ParamProposalState } from "@joincivil/core";
import { Tr, Td, StyledTableAccentText, TextCountdownTimer } from "@joincivil/components";
import { getFormattedTokenBalance, getReadableDuration } from "@joincivil/utils";
import { amountParams, durationParams, percentParams } from "./constants";
import { getCivil } from "../../helpers/civilInstance";
import { State } from "../../reducers";
import { makeGetProposalsByParameterName } from "../../selectors";

export interface ParameterProps {
  parameterName: string;
  parameterDisplayName: string | JSX.Element;
  parameterValue: BigNumber;
  handleCreateProposal(paramName: string, currentValue: string): void;
  handleProposalAction(paramName: string, currentValue: string, proposal: any): void;
}

interface ParameterReduxProps {
  proposal?: any;
}

class ParameterComponent extends React.Component<ParameterProps & ParameterReduxProps> {
  public render(): JSX.Element {
    return (
      <Tr>
        <Td>{this.props.parameterDisplayName}</Td>
        <Td>{this.getFormattedValue(this.props.parameterValue)}</Td>

        {!this.props.proposal && this.renderCreateProposalAction()}
        {this.props.proposal && this.renderProposal()}
      </Tr>
    );
  }

  private renderCreateProposalAction(): JSX.Element {
    return (
      <Td accent align="right" colSpan={3}>
        <StyledTableAccentText strong>
          <span onClick={this.onCreateProposal}>Propose New Value</span>
        </StyledTableAccentText>
      </Td>
    );
  }

  private renderProposal(): JSX.Element {
    const { proposal } = this.props;

    return (
      <>
        <Td accent>
          <StyledTableAccentText>{this.getFormattedValue(proposal.propValue)}</StyledTableAccentText>
        </Td>
        {this.renderProposalStageActions()}
      </>
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
        <Td accent>
          <TextCountdownTimer endTime={this.props.proposal.applicationExpiry.valueOf() / 1000} />
        </Td>
        <Td accent align="right">
          <StyledTableAccentText strong>
            <span onClick={this.onProposalAction}>Challenge Proposal</span>
          </StyledTableAccentText>
        </Td>
      </>
    );
  };

  private renderUpdateParam = (): JSX.Element => {
    return (
      <>
        <Td accent>
          <TextCountdownTimer endTime={this.props.proposal.propProcessByExpiry.valueOf() / 1000} />
        </Td>
        <Td accent align="right">
          <StyledTableAccentText strong>
            <span onClick={this.onProposalAction}>Update Parameter</span>
          </StyledTableAccentText>
        </Td>
      </>
    );
  };

  private renderResolveChallenge = (): JSX.Element => {
    return (
      <>
        <Td accent>
          <TextCountdownTimer endTime={this.props.proposal.propProcessByExpiry.valueOf() / 1000} />
        </Td>
        <Td accent align="right">
          <StyledTableAccentText strong>
            <span onClick={this.onProposalAction}>Resolve Challenge</span>
          </StyledTableAccentText>
        </Td>
      </>
    );
  };

  private renderCommitState = (): JSX.Element => {
    return (
      <>
        <Td accent>
          <TextCountdownTimer endTime={this.props.proposal.challengeCommitExpiry.valueOf() / 1000} />
        </Td>
        <Td accent align="right">
          <StyledTableAccentText strong>
            <span onClick={this.onProposalAction}>Commit Vote</span>
          </StyledTableAccentText>
        </Td>
      </>
    );
  };

  private renderRevealState = (): JSX.Element => {
    return (
      <>
        <Td accent>
          <TextCountdownTimer endTime={this.props.proposal.challengeRevealExpiry.valueOf() / 1000} />
        </Td>
        <Td accent align="right">
          <StyledTableAccentText strong>
            <span onClick={this.onProposalAction}>Commit Vote</span>
          </StyledTableAccentText>
        </Td>
      </>
    );
  };

  private onCreateProposal = (event: any) => {
    this.props.handleCreateProposal(this.props.parameterName, this.getFormattedValue(this.props.parameterValue));
  };

  private onProposalAction = (event: any) => {
    this.props.handleCreateProposal(this.props.parameterName, this.getFormattedValue(this.props.parameterValue));
  };

  private getFormattedValue = (parameterValue: BigNumber): string => {
    const civil = getCivil();
    let value = "";

    if (amountParams.includes(this.props.parameterName)) {
      value = getFormattedTokenBalance(civil.toBigNumber(parameterValue.toString()));
    } else if (durationParams.includes(this.props.parameterName)) {
      value = getReadableDuration(civil.toBigNumber(parameterValue.toString()));
    } else if (percentParams.includes(this.props.parameterName)) {
      value = `${parameterValue.toString()}%`;
    }

    return value;
  };
}

const makeMapStateToProps = () => {
  const getProposalsByParameterName = makeGetProposalsByParameterName();
  const mapStateToProps = (state: State, ownProps: ParameterProps): ParameterProps & ParameterReduxProps => {
    const parameterProposals: Set<any> = getProposalsByParameterName(state, ownProps);
    let proposal;
    if (parameterProposals.count()) {
      proposal = parameterProposals.first();
    }

    return {
      proposal,
      ...ownProps,
    };
  };
  return mapStateToProps;
};

export const Parameter = connect(makeMapStateToProps)(ParameterComponent);
