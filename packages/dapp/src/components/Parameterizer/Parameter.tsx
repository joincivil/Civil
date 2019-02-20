import * as React from "react";
import { BigNumber } from "bignumber.js";
import { connect } from "react-redux";
import { Set } from "immutable";
import { Table, Tr, Td, ParameterizerTd, StyledTableAccentText } from "@joincivil/components";
import { getFormattedParameterValue } from "@joincivil/utils";
import { getCivil } from "../../helpers/civilInstance";
import { State } from "../../redux/reducers";
import { makeGetProposalsByParameterName, makeGetGovtProposalsByParameterName } from "../../selectors";
import { Proposal } from "./Proposal";

export interface ParameterProps {
  parameterName: string;
  parameterDisplayName: string | JSX.Element;
  parameterValue: BigNumber;
  canShowCreateProposal: boolean;
  isGovtProposal?: boolean;
  handleCreateProposal(paramName: string, currentValue: string): void;
  handleProposalAction(paramName: string, currentValue: string, newValue: string, proposal: any): void;
}

export interface ParameterReduxProps {
  parameterProposals: Set<any>;
}

class ParameterComponent extends React.Component<ParameterProps & ParameterReduxProps> {
  public render(): JSX.Element {
    return (
      <Tr>
        <ParameterizerTd data-mobile-th="Current Parameter">{this.props.parameterDisplayName}</ParameterizerTd>
        <ParameterizerTd data-mobile-th="Current Value">
          {this.getFormattedValue(this.props.parameterValue)}
        </ParameterizerTd>
        <ParameterizerTd accent padding={0}>
          <Table borderWidth="0" width="100%">
            <tbody>
              {this.props.canShowCreateProposal && this.renderCreateProposalAction()}
              {!!this.props.parameterProposals.count() && this.renderProposals()}
            </tbody>
          </Table>
        </ParameterizerTd>
      </Tr>
    );
  }

  private renderCreateProposalAction(): JSX.Element {
    return (
      <Tr>
        <Td align="right" colSpan={3}>
          <StyledTableAccentText strong>
            <span onClick={this.onCreateProposal}>Propose New Value</span>
          </StyledTableAccentText>
        </Td>
      </Tr>
    );
  }

  private renderProposals(): JSX.Element {
    const { parameterProposals } = this.props;
    const out = parameterProposals.map((proposal, key, iter) => (
      <Proposal
        key={key}
        proposal={proposal}
        handleProposalAction={this.props.handleProposalAction}
        parameterName={this.props.parameterName}
        parameterValue={this.props.parameterValue}
      />
    ));
    return <>{out}</>;
  }

  private onCreateProposal = (event: any) => {
    this.props.handleCreateProposal(this.props.parameterName, this.getFormattedValue(this.props.parameterValue));
  };

  private getFormattedValue = (parameterValue: BigNumber): string => {
    const civil = getCivil();
    return getFormattedParameterValue(this.props.parameterName, civil.toBigNumber(parameterValue.toString()));
  };
}

const makeMapStateToProps = () => {
  const getProposalsByParameterName = makeGetProposalsByParameterName();
  const getGovtProposalsByParameterName = makeGetGovtProposalsByParameterName();
  const mapStateToProps = (state: State, ownProps: ParameterProps): ParameterProps & ParameterReduxProps => {
    let parameterProposals: Set<any> = Set<any>();
    if (!ownProps.isGovtProposal) {
      parameterProposals = getProposalsByParameterName(state, ownProps);
    } else {
      parameterProposals = getGovtProposalsByParameterName(state, ownProps);
    }

    return {
      parameterProposals,
      ...ownProps,
    };
  };
  return mapStateToProps;
};

export const Parameter = connect(makeMapStateToProps)(ParameterComponent);
