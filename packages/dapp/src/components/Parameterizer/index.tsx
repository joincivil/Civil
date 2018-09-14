import * as React from "react";
import styled from "styled-components";
import { connect, DispatchProp } from "react-redux";
import { BigNumber } from "bignumber.js";
import { TwoStepEthTransaction, ParamProposalState } from "@joincivil/core";
import {
  colors,
  fonts,
  Table,
  Tr,
  Th,
  Tabs,
  Tab,
  StyledParameterizerContainer,
  StyledDashboardSubTab,
  MinDepositLabelText,
  ParamMinDepositLabelText,
  ApplicationStageLenLabelText,
  ParamApplicationStageLenLabelText,
  CommitStageLenLabelText,
  ParamCommitStageLenLabelText,
  RevealStageLenLabelText,
  ParamRevealStageLenLabelText,
  DispensationPctLabelText,
  ParamDispensationPctLabelText,
  VoteQuorumLabelText,
  ParamVoteQuorumLabelText,
  ParamProcessByLabelText,
  ChallengeAppealLenLabelText,
  ChallengeAppealCommitStageLenLabelText,
  ChallengeAppealRevealStageLenLabelText,
  RequestAppealLenLabelText,
  JudgeAppealLenLabelText,
  AppealFeeLabelText,
  AppealVotePercentageLabelText,
  CreateProposal,
  ChallengeProposal,
  ProcessProposal,
} from "@joincivil/components";
import { getFormattedParameterValue, Parameters, GovernmentParameters } from "@joincivil/utils";
import { getCivil } from "../../helpers/civilInstance";
import { State } from "../../reducers";
import ListingDiscourse from "../listing/ListingDiscourse";
import {
  approveForProposeReparameterization,
  approveForProposalChallenge,
  challengeReparameterization,
  proposeReparameterization,
  updateReparameterizationProp,
} from "../../apis/civilTCR";
import { getIsMemberOfAppellate } from "../../selectors";
import { amountParams, durationParams, percentParams } from "./constants";
import { Parameter } from "./Parameter";
import ChallengeContainer from "./ChallengeProposalDetail";

const GridRow = styled.div`
  display: flex;
  margin: 40px auto 0;
  padding: 0 0 20px;
  width: 1200px;

  & ~ & {
    margin-top: 0;
  }
`;

const GridRowStatic = styled.div`
  margin: 0 auto;
  width: 1200px;
`;

const StyledTabContainer = styled.div`
  padding: 30px 0 50px;
`;

const StyledTabComponent = styled(StyledDashboardSubTab)`
  font-size: 18px;
  line-height: 21px;
`;

const StyledTitle = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-family: ${fonts.SERIF};
  font-size: 48px;
  font-weight: 200;
  margin: 0;
  line-height: 40px;
  letter-spacing: -0.19px;
  width: 350px;
`;

const StyledDescriptionP = styled.p`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 18px;
  line-height: 33px;
  letter-spacing: -0.12px;
  width: 730px;
`;

const StyledP = styled.p`
  color: ${colors.primary.CIVIL_GRAY_1}
  font-size: 16px;
  line-height: 20px;
  letter-spacing: -0.11px;
  max-width: 730px;
`;

export interface ParameterizerProps {
  [Parameters.minDeposit]: BigNumber;
  [Parameters.pMinDeposit]: BigNumber;
  [Parameters.applyStageLen]: BigNumber;
  [Parameters.pApplyStageLen]: BigNumber;
  [Parameters.commitStageLen]: BigNumber;
  [Parameters.pCommitStageLen]: BigNumber;
  [Parameters.revealStageLen]: BigNumber;
  [Parameters.pRevealStageLen]: BigNumber;
  [Parameters.dispensationPct]: BigNumber;
  [Parameters.pDispensationPct]: BigNumber;
  [Parameters.voteQuorum]: BigNumber;
  [Parameters.pVoteQuorum]: BigNumber;
  [Parameters.pProcessBy]: BigNumber;
  [Parameters.challengeAppealLen]: BigNumber;
  [Parameters.challengeAppealCommitLen]: BigNumber;
  [Parameters.challengeAppealRevealLen]: BigNumber;
}

export interface GovernmentParameterProps {
  [GovernmentParameters.requestAppealLen]: BigNumber;
  [GovernmentParameters.judgeAppealLen]: BigNumber;
  [GovernmentParameters.appealFee]: BigNumber;
  [GovernmentParameters.appealVotePercentage]: BigNumber;
}

export interface ParameterizerPageProps {
  parameters: ParameterizerProps;
  govtParameters: GovernmentParameterProps;
  isMemberOfAppellate: boolean;
}

export interface ParameterizerPageState {
  isCreateProposalVisible: boolean;
  createProposalParameterName?: string;
  createProposalParameterCurrentValue?: string;
  createProposalNewValue?: string;
  isProposalActionVisible: boolean;
  challengeProposalID?: number;
  challengeProposalNewValue?: string;
  proposal?: any;
}

class Parameterizer extends React.Component<ParameterizerPageProps & DispatchProp<any>, ParameterizerPageState> {
  constructor(props: ParameterizerPageProps & DispatchProp<any>) {
    super(props);

    this.state = {
      isCreateProposalVisible: false,
      isProposalActionVisible: false,
    };
  }

  public render(): JSX.Element {
    const civil = getCivil();
    const proposalMinDeposit =
      this.props.parameters[Parameters.pMinDeposit] &&
      getFormattedParameterValue(
        Parameters.pMinDeposit,
        civil.toBigNumber(this.props.parameters[Parameters.pMinDeposit].toString()),
      );

    return (
      <>
        <GridRow>
          <StyledTitle>Civil Registry Parameters</StyledTitle>
          <StyledDescriptionP>
            The Civil Registry runs on a set of rules called "parameters". These parameters control almost every
            function of the Registry's governance, from how much it costs to challenge a newsroom to how long the voting
            process will take. The Civil community has the power to propose new values for these parameters and new
            rules as the Civil platform evolves.
          </StyledDescriptionP>
        </GridRow>
        <GridRow>
          <Tabs TabComponent={StyledTabComponent}>
            <Tab title="Current Parameters">
              <StyledTabContainer>
                <StyledP>
                  All Civil token holders may propose a change to the current Registry values. This process involves
                  three phases: proposal, challenge, and vote.
                </StyledP>
                <StyledP>
                  Proposing new values and challenging a proposal <b>requires a deposit of {proposalMinDeposit}</b>.
                </StyledP>

                <StyledParameterizerContainer>
                  <Table width="100%">
                    <thead>
                      <Tr>
                        <Th width="300">Current Parameter</Th>
                        <Th>Current Value</Th>
                        <Th accent>Proposal for New Value</Th>
                      </Tr>
                    </thead>
                    <tbody>
                      {Object.keys(this.props.parameters).map(key => {
                        if (!this.props.parameters[key]) {
                          return <></>;
                        }
                        return (
                          <Parameter
                            key={key}
                            parameterName={key}
                            parameterDisplayName={this.getParameterDisplayName(key)}
                            parameterValue={this.props.parameters[key]}
                            handleCreateProposal={this.showCreateProposal}
                            handleProposalAction={this.showProposalAction}
                            canShowCreateProposal={true}
                          />
                        );
                      })}
                    </tbody>
                  </Table>
                </StyledParameterizerContainer>
              </StyledTabContainer>
            </Tab>

            <Tab title="Government Parameters">
              <StyledTabContainer>
                <StyledP>
                  Civil Council members may propose a change to the current Council Parameters. The CVL token holder
                  community approve the proposed values through a voting process.
                </StyledP>
                <StyledP>
                  Challenging a Council Parameter proposal <b>requires a deposit of {proposalMinDeposit}</b>.
                </StyledP>
                <StyledParameterizerContainer>
                  <Table width="100%">
                    <thead>
                      <Tr>
                        <Th>Current Parameter</Th>
                        <Th>Current Value</Th>
                        <Th colSpan={3} accent>
                          Proposal for New Value
                        </Th>
                      </Tr>
                    </thead>
                    <tbody>
                      {Object.keys(this.props.govtParameters).map(key => {
                        if (!this.props.govtParameters[key]) {
                          return <></>;
                        }
                        return (
                          <Parameter
                            key={key}
                            parameterName={key}
                            parameterDisplayName={this.getParameterDisplayName(key)}
                            parameterValue={this.props.govtParameters[key]}
                            handleCreateProposal={this.showCreateProposal}
                            handleProposalAction={this.showProposalAction}
                            canShowCreateProposal={this.props.isMemberOfAppellate}
                          />
                        );
                      })}
                    </tbody>
                  </Table>
                </StyledParameterizerContainer>
              </StyledTabContainer>
            </Tab>
          </Tabs>
        </GridRow>

        <GridRowStatic>
          <ListingDiscourse />
        </GridRowStatic>

        {this.state.isCreateProposalVisible && this.renderCreateProposal()}
        {this.state.isProposalActionVisible && this.renderProposalAction()}
      </>
    );
  }

  private renderCreateProposal = (): JSX.Element => {
    const civil = getCivil();
    const proposalMinDeposit =
      this.props.parameters[Parameters.pMinDeposit] &&
      getFormattedParameterValue(
        Parameters.pMinDeposit,
        civil.toBigNumber(this.props.parameters[Parameters.pMinDeposit].toString()),
      );
    const pApplyLenText =
      this.props.parameters[Parameters.pApplyStageLen] &&
      getFormattedParameterValue(
        Parameters.pApplyStageLen,
        civil.toBigNumber(this.props.parameters[Parameters.pApplyStageLen].toString()),
      );

    return (
      <CreateProposal
        pApplyLenText={pApplyLenText}
        parameterDisplayName={this.getParameterDisplayName(this.state.createProposalParameterName!)}
        parameterCurrentValue={this.state.createProposalParameterCurrentValue!}
        parameterDisplayUnits={this.getParameterDisplayUnits(this.state.createProposalParameterName!)}
        parameterProposalValue={this.state.createProposalNewValue!}
        proposalDeposit={proposalMinDeposit}
        transactions={[
          { transaction: approveForProposeReparameterization },
          { transaction: this.proposeReparameterization, postExecuteTransactions: this.hideCreateProposal },
        ]}
        handleClose={this.hideCreateProposal}
        handleUpdateProposalValue={this.updateProposalNewValue}
        postExecuteTransactions={this.hideProposalAction}
      />
    );
  };

  private renderProposalAction = (): JSX.Element => {
    const propState = this.state.proposal!.state;
    switch (propState) {
      case ParamProposalState.APPLYING:
        return this.renderChallengeProposal();
      case ParamProposalState.CHALLENGED_IN_COMMIT_VOTE_PHASE:
      case ParamProposalState.CHALLENGED_IN_REVEAL_VOTE_PHASE:
      case ParamProposalState.READY_TO_RESOLVE_CHALLENGE:
        return this.renderChallengeDetail();
      case ParamProposalState.READY_TO_PROCESS:
        return this.renderUpdateParam();
      default:
        return <></>;
    }
  };

  private renderUpdateParam = (): JSX.Element => {
    return (
      <ProcessProposal
        parameterDisplayName={this.getParameterDisplayName(this.state.createProposalParameterName!)}
        parameterCurrentValue={this.state.createProposalParameterCurrentValue!}
        parameterProposalValue={this.state.createProposalNewValue!}
        parameterNewValue={this.state.challengeProposalNewValue!}
        transactions={[{ transaction: this.updateProposal, postExecuteTransactions: this.hideProposalAction }]}
        handleClose={this.hideProposalAction}
        postExecuteTransactions={this.hideProposalAction}
      />
    );
  };

  private renderChallengeProposal = (): JSX.Element => {
    const civil = getCivil();
    const proposalMinDeposit =
      this.props.parameters[Parameters.pMinDeposit] &&
      getFormattedParameterValue(
        Parameters.pMinDeposit,
        civil.toBigNumber(this.props.parameters[Parameters.pMinDeposit].toString()),
      );

    return (
      <ChallengeProposal
        parameterDisplayName={this.getParameterDisplayName(this.state.createProposalParameterName!)}
        parameterCurrentValue={this.state.createProposalParameterCurrentValue!}
        parameterProposalValue={this.state.createProposalNewValue!}
        parameterNewValue={this.state.challengeProposalNewValue!}
        proposalDeposit={proposalMinDeposit}
        transactions={[{ transaction: approveForProposalChallenge }, { transaction: this.challengeProposal }]}
        handleClose={this.hideProposalAction}
        postExecuteTransactions={this.hideProposalAction}
      />
    );
  };

  private renderChallengeDetail = (): JSX.Element => {
    return (
      <ChallengeContainer
        propID={this.state.challengeProposalID!}
        challengeID={this.state.proposal!.challenge.id}
        parameterDisplayName={this.getParameterDisplayName(this.state.createProposalParameterName!)}
        parameterCurrentValue={this.state.createProposalParameterCurrentValue!}
        parameterProposalValue={this.state.challengeProposalNewValue!}
        handleClose={this.hideProposalAction}
      />
    );
  };

  private updateProposalNewValue = (name: string, value: string) => {
    this.setState(() => ({ createProposalNewValue: value }));
  };

  private showCreateProposal = (parameterName: string, currentValue: string): void => {
    this.setState(() => ({
      createProposalParameterName: parameterName,
      createProposalParameterCurrentValue: currentValue,
    }));
    this.setState(() => ({ isCreateProposalVisible: true }));
  };

  private showProposalAction = (parameterName: string, currentValue: string, newValue: string, proposal: any): void => {
    this.setState(() => ({
      createProposalParameterName: parameterName,
      createProposalParameterCurrentValue: currentValue,
      challengeProposalID: proposal.id,
      challengeProposalNewValue: newValue,
      proposal,
    }));
    this.setState(() => ({ isProposalActionVisible: true }));
  };

  private hideCreateProposal = (): void => {
    this.setState(() => ({ isCreateProposalVisible: false }));
  };

  private hideProposalAction = (): void => {
    this.setState(() => ({ isProposalActionVisible: false }));
  };

  private getParameterDisplayName = (parameterName: string): JSX.Element => {
    const parameterDisplayNameMap = {
      [Parameters.minDeposit]: MinDepositLabelText,
      [Parameters.pMinDeposit]: ParamMinDepositLabelText,
      [GovernmentParameters.appealFee]: AppealFeeLabelText,

      [Parameters.applyStageLen]: ApplicationStageLenLabelText,
      [Parameters.pApplyStageLen]: ParamApplicationStageLenLabelText,
      [Parameters.commitStageLen]: CommitStageLenLabelText,
      [Parameters.pCommitStageLen]: ParamCommitStageLenLabelText,
      [Parameters.revealStageLen]: RevealStageLenLabelText,
      [Parameters.pRevealStageLen]: ParamRevealStageLenLabelText,
      [Parameters.pProcessBy]: ParamProcessByLabelText,
      [Parameters.challengeAppealLen]: ChallengeAppealLenLabelText,
      [Parameters.challengeAppealCommitLen]: ChallengeAppealCommitStageLenLabelText,
      [Parameters.challengeAppealRevealLen]: ChallengeAppealRevealStageLenLabelText,
      [GovernmentParameters.requestAppealLen]: RequestAppealLenLabelText,
      [GovernmentParameters.judgeAppealLen]: JudgeAppealLenLabelText,

      [Parameters.dispensationPct]: DispensationPctLabelText,
      [Parameters.pDispensationPct]: ParamDispensationPctLabelText,
      [Parameters.voteQuorum]: VoteQuorumLabelText,
      [Parameters.pVoteQuorum]: ParamVoteQuorumLabelText,
      [GovernmentParameters.appealVotePercentage]: AppealVotePercentageLabelText,
    };

    let DisplayName: React.SFC = props => <></>;
    if (parameterDisplayNameMap[parameterName]) {
      DisplayName = parameterDisplayNameMap[parameterName];
    }

    return <DisplayName />;
  };

  private getParameterDisplayUnits = (parameterName: string): string => {
    let label = "";

    if (amountParams.includes(parameterName)) {
      label = "CVL";
    } else if (durationParams.includes(parameterName)) {
      label = "Seconds";
    } else if (percentParams.includes(parameterName)) {
      label = "%";
    }

    return label;
  };

  private proposeReparameterization = async (): Promise<TwoStepEthTransaction<any> | void> => {
    let newValue: BigNumber = new BigNumber(this.state.createProposalNewValue!);
    if (amountParams.includes(this.state.createProposalParameterName!)) {
      newValue = newValue.mul(1e18);
    }
    return proposeReparameterization(this.state.createProposalParameterName!, newValue);
  };

  private challengeProposal = async (): Promise<TwoStepEthTransaction<any> | void> => {
    return challengeReparameterization(this.state.challengeProposalID!.toString());
  };

  private updateProposal = async (): Promise<TwoStepEthTransaction<any> | void> => {
    return updateReparameterizationProp(this.state.challengeProposalID!.toString());
  };
}

const mapToStateToProps = (state: State): ParameterizerPageProps => {
  const parameters: ParameterizerProps = state.networkDependent.parameters as ParameterizerProps;
  const govtParameters: GovernmentParameterProps = state.networkDependent.govtParameters as GovernmentParameterProps;
  const isMemberOfAppellate = getIsMemberOfAppellate(state);

  return {
    parameters,
    govtParameters,
    isMemberOfAppellate,
  };
};

export default connect(mapToStateToProps)(Parameterizer);
