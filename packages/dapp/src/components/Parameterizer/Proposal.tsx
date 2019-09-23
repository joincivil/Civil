import * as React from "react";
import { BigNumber } from "@joincivil/typescript-types";
import { getFormattedParameterValue } from "@joincivil/utils";
import { CivilContext, Tr, Td, StyledTableAccentText, TextCountdownTimer, ICivilContext } from "@joincivil/components";

import { StyledHiddenOnMobile } from "./Parameter";
import { POLL_QUERY } from "../../helpers/queryTransformations";
import { Query } from "react-apollo";

export interface ProposalProps {
  proposal: any;
  parameterName: string;
  parameterValue: BigNumber;
  handleProposalAction(paramName: string, currentValue: string, newValue: string, proposal: any): void;
}

export class Proposal extends React.Component<ProposalProps> {
  public static contextType = CivilContext;
  public context: ICivilContext;

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
    const {pollID, applicationExpiry} = this.props.proposal;
    if (!pollID || pollID.eq(0)) {
      if (new Date(applicationExpiry * 1000).valueOf() < Date.now().valueOf()) {
        return this.renderUpdateParam();
      } else {
        return this.renderCanBeChallenged();
      }
    } else {
      return this.renderChallenge();
    }
  };

  private renderCanBeChallenged = (): JSX.Element => {
    return (
      <>
        <Td>
          <TextCountdownTimer endTime={new Date(this.props.proposal.applicationExpiry * 1000).valueOf() / 1000} />
        </Td>
        <Td align="right">
          <StyledHiddenOnMobile>
            <StyledTableAccentText strong>
              <span onClick={() => this.onProposalAction("challenge")}>Challenge Proposal</span>
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
          <TextCountdownTimer endTime={new Date(this.props.proposal.applicationExpiry * 1000).valueOf() / 1000} />
        </Td>
        <Td align="right">
          <StyledHiddenOnMobile>
            <StyledTableAccentText strong>
              <span onClick={() => this.onProposalAction("update")}>Update Parameter</span>
            </StyledTableAccentText>
          </StyledHiddenOnMobile>
        </Td>
      </>
    );
  };

  private renderChallenge = (): JSX.Element => {
    const pollID = this.props.proposal.pollID.toNumber()
    return (
      <Query query={POLL_QUERY} variables={{ input: pollID }}>
        {({ loading, error, data }) => {
          if (loading || error) {
            return <></>
          }
          const nowTimestamp = Date.now().valueOf();
          const commitEndTimestamp = new Date(data.poll.commitEndDate * 1000).valueOf()
          const revealEndTimestamp = new Date(data.poll.revealEndDate * 1000).valueOf()

          if (nowTimestamp < commitEndTimestamp) {
            return this.renderCommitState(commitEndTimestamp);
          } else if (nowTimestamp < revealEndTimestamp) {
            return this.renderRevealState(revealEndTimestamp);
          } else {
            return this.renderResolveChallenge(revealEndTimestamp);
          }
        }}
      </Query>
    )
  }

  private renderResolveChallenge = (endTimestamp: number): JSX.Element => {
    return (
      <>
        <Td>
          <TextCountdownTimer endTime={endTimestamp / 1000} />
        </Td>
        <Td align="right">
          <StyledHiddenOnMobile>
            <StyledTableAccentText strong>
              <span onClick={() => this.onProposalAction("resolve")}>Resolve Challenge</span>
            </StyledTableAccentText>
          </StyledHiddenOnMobile>
        </Td>
      </>
    );
  };

  private renderCommitState = (endTimestamp: number): JSX.Element => {
    return (
      <>
        <Td>
          <TextCountdownTimer endTime={endTimestamp / 1000} />
        </Td>
        <Td align="right">
          <StyledHiddenOnMobile>
            <StyledTableAccentText strong>
              <span onClick={() => this.onProposalAction("commit")}>Commit Vote</span>
            </StyledTableAccentText>
          </StyledHiddenOnMobile>
        </Td>
      </>
    );
  };

  private renderRevealState = (endTimestamp: number): JSX.Element => {
    return (
      <>
        <Td>
          <TextCountdownTimer endTime={endTimestamp / 1000} />
        </Td>
        <Td align="right">
          <StyledHiddenOnMobile>
            <StyledTableAccentText strong>
              <span onClick={() => this.onProposalAction("reveal")}>Reveal Vote</span>
            </StyledTableAccentText>
          </StyledHiddenOnMobile>
        </Td>
      </>
    );
  };

  private onProposalAction = (actionType: string) => {
    this.props.handleProposalAction(
      this.props.parameterName,
      this.getFormattedValue(this.props.parameterValue),
      this.getFormattedValue(this.props.proposal!.propValue),
      this.props.proposal,
      actionType,
    );
  };

  private getFormattedValue = (parameterValue: BigNumber): string => {
    const { civil } = this.context;
    return getFormattedParameterValue(this.props.parameterName, civil.toBigNumber(parameterValue.toString()));
  };
}
