import * as React from "react";
import styled from "styled-components/macro";
import { BigNumber } from "@joincivil/typescript-types";
import {
  CivilContext,
  Table,
  Tr,
  Td,
  ParameterizerTd,
  StyledTableAccentText,
  mediaQueries,
  ICivilContext,
} from "@joincivil/components";
import { getFormattedParameterValue, transformGraphQLDataIntoParamProposal } from "@joincivil/utils";
import { Proposal } from "./Proposal";
import { Query } from "react-apollo";
import gql from "graphql-tag";

export const StyledHiddenOnMobile = styled.div`
  ${mediaQueries.MOBILE} {
    display: none;
  }
`;

const PARAMETER_PROPOSALS_QUERY = gql`
  query ParamProposals($input: String!) {
    paramProposals: paramProposals(paramName: $input) {
      id
      propID
      name
      value
      deposit
      appExpiry
      challengeID
      proposer
      accepted
      expired
    }
  }
`;

export interface ParameterProps {
  parameterName: string;
  parameterDisplayName: string | JSX.Element;
  parameterValue: BigNumber;
  canShowCreateProposal: boolean;
  isGovtProposal?: boolean;
  handleCreateProposal(paramName: string, currentValue: string): void;
  handleProposalAction(
    paramName: string,
    currentValue: string,
    newValue: string,
    proposal: any,
    actionType: string,
  ): void;
}

class ParameterComponent extends React.Component<ParameterProps> {
  public static contextType = CivilContext;
  public context: ICivilContext;

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
              {this.renderProposals()}
            </tbody>
          </Table>
        </ParameterizerTd>
      </Tr>
    );
    return <></>;
  }

  private renderCreateProposalAction(): JSX.Element {
    return (
      <Tr>
        <Td align="right" colSpan={3}>
          <StyledHiddenOnMobile>
            <StyledTableAccentText strong>
              <span onClick={this.onCreateProposal}>Propose New Value</span>
            </StyledTableAccentText>
          </StyledHiddenOnMobile>
        </Td>
      </Tr>
    );
  }

  private renderProposals(): JSX.Element {
    return (
      <Query query={PARAMETER_PROPOSALS_QUERY} variables={{ input: this.props.parameterName }}>
        {({ loading, error, data }) => {
          if (loading || error) {
            return <></>;
          }
          return data.paramProposals.map(prop => {
            const proposal = transformGraphQLDataIntoParamProposal(prop);
            return (
              <Proposal
                key={proposal.propID}
                proposal={proposal}
                handleProposalAction={this.props.handleProposalAction}
                parameterName={this.props.parameterName}
                parameterValue={this.props.parameterValue}
              />
            );
          });
        }}
      </Query>
    );
  }

  private onCreateProposal = (event: any) => {
    this.props.handleCreateProposal(this.props.parameterName, this.getFormattedValue(this.props.parameterValue));
  };

  private getFormattedValue = (parameterValue: BigNumber): string => {
    const { civil } = this.context;
    return getFormattedParameterValue(this.props.parameterName, civil.toBigNumber(parameterValue.toString()));
  };
}

export const Parameter = ParameterComponent;
