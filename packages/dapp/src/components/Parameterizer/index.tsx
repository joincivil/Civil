import * as React from "react";
import styled from "styled-components";
import { connect, DispatchProp } from "react-redux";
import { BigNumber } from "@joincivil/typescript-types";
import { Helmet } from "react-helmet";

import {
  colors,
  fonts,
  mediaQueries,
  CivilContext,
  Table,
  Tr,
  Th,
  Tabs,
  Tab,
  StyledContentRow,
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
  ChallengeAppealLenLabelText,
  ChallengeAppealCommitStageLenLabelText,
  ChallengeAppealRevealStageLenLabelText,
  RequestAppealLenLabelText,
  JudgeAppealLenLabelText,
  AppealFeeLabelText,
  AppealVotePercentageLabelText,
  GovtProposalCommitStageLenLabelText,
  GovtProposalRevealStageLenLabelText,
  AppealVoteDispensationPctLabelText,
  ICivilContext,
} from "@joincivil/components";
import { getFormattedParameterValue, Parameters, GovernmentParameters } from "@joincivil/utils";

import { State } from "../../redux/reducers";
import ListingDiscourse from "../listing/ListingDiscourse";
import { getIsMemberOfAppellate } from "../../selectors";
import ScrollToTopOnMount from "../utility/ScrollToTop";

import { amountParams, durationParams, percentParams } from "./constants";
import { Parameter } from "./Parameter";
import CreateProposal from "./CreateProposal";
import CreateGovtProposal from "./CreateGovtProposal";
import ChallengeProposal from "./ChallengeProposal";
import ChallengeContainer from "./ChallengeProposalDetail";
import ProcessProposal from "./ProcessProposal";
import { connectParameters, ParametersProps } from "../utility/HigherOrderComponents";
import { compose } from "redux";

const GridRow = styled(StyledContentRow)`
  padding-top: 71px;

  ${mediaQueries.MOBILE} {
    padding-top: 42px;
  }
`;

const GridRowStatic = styled.div`
  margin: 0 auto;
  width: 1200px;

  ${mediaQueries.MOBILE} {
    width: auto;
  }
`;

const StyledTabContainer = styled.div`
  padding: 30px 0 50px;
`;

const StyledTabComponent = styled(StyledDashboardSubTab)`
  font-size: 18px;
  line-height: 21px;

  ${mediaQueries.MOBILE} {
    font-size: 16px;
    line-height: 19px;

    &:first-of-type {
      margin: 0 16px;
    }
  }
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

  ${mediaQueries.MOBILE} {
    font-size: 32px;
    letter-spacing: -0.3px;
    line-height: 36px;
    margin: 0 16px 16px;
    width: auto;
  }
`;

const StyledDescriptionP = styled.p`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 18px;
  line-height: 33px;
  letter-spacing: -0.12px;
  width: 730px;

  ${mediaQueries.MOBILE} {
    font-size: 16px;
    line-height: 26px;
    margin-left: 16px;
    margin-right: 16px;
    width: auto;
  }
`;

const StyledP = styled.p`
  color: ${colors.primary.CIVIL_GRAY_1}
  font-size: 16px;
  line-height: 20px;
  letter-spacing: -0.11px;
  max-width: 730px;

  ${mediaQueries.MOBILE} {
    line-height: 26px;
    margin-left: 16px;
    margin-right: 16px;
  }
`;

const ParameterizerKeys = [
  Parameters.minDeposit,
  Parameters.pMinDeposit,
  Parameters.applyStageLen,
  Parameters.pApplyStageLen,
  Parameters.commitStageLen,
  Parameters.pCommitStageLen,
  Parameters.revealStageLen,
  Parameters.pRevealStageLen,
  Parameters.dispensationPct,
  Parameters.pDispensationPct,
  Parameters.voteQuorum,
  Parameters.pVoteQuorum,
  Parameters.challengeAppealLen,
  Parameters.challengeAppealCommitLen,
  Parameters.challengeAppealRevealLen,
]

export interface GovernmentParameterProps {
  [GovernmentParameters.requestAppealLen]: BigNumber;
  [GovernmentParameters.judgeAppealLen]: BigNumber;
  [GovernmentParameters.appealFee]: BigNumber;
  [GovernmentParameters.appealVotePercentage]: BigNumber;
  [GovernmentParameters.appealChallengeVoteDispensationPct]: BigNumber;
  [GovernmentParameters.govtPCommitStageLen]: BigNumber;
  [GovernmentParameters.govtPRevealStageLen]: BigNumber;
}

export interface ParameterizerPageProps {
  govtParameters: GovernmentParameterProps;
  isMemberOfAppellate: boolean;
}

export interface ParameterizerPageState {
  isCreateProposalVisible: boolean;
  isCreateGovtProposalVisible: boolean;
  createProposalParameterName?: string;
  createProposalParameterCurrentValue?: string;
  createProposalNewValue?: string;
  isProposalActionVisible: boolean;
  challengeProposalID?: number;
  challengeProposalNewValue?: string;
  proposal?: any;
  actionType?: string;
}

class Parameterizer extends React.Component<ParameterizerPageProps & DispatchProp<any> & ParametersProps, ParameterizerPageState> {
  public static contextType = CivilContext;
  public context: ICivilContext;

  constructor(props: ParameterizerPageProps & DispatchProp<any> & ParametersProps) {
    super(props);

    this.state = {
      isCreateProposalVisible: false,
      isCreateGovtProposalVisible: false,
      isProposalActionVisible: false,
    };
  }

  public render(): JSX.Element {
    const { civil } = this.context;
    const { parameters } = this.props;
    const proposalMinDeposit =
      parameters && parameters.get(Parameters.pMinDeposit) &&
      getFormattedParameterValue(
        Parameters.pMinDeposit,
        civil!.toBigNumber(parameters.get(Parameters.pMinDeposit)),
      );

    const params = ParameterizerKeys.map((paramName) => {
      const value = parameters.get(paramName)
      return (
            <Parameter
              key={paramName}
              parameterName={paramName}
              parameterDisplayName={this.getParameterDisplayName(paramName)}
              parameterValue={value}
              handleCreateProposal={this.showCreateProposal}
              handleProposalAction={this.showProposalAction}
              canShowCreateProposal={true}
            />
          );
        })

    return(
      <>
        <ScrollToTopOnMount />
        <Helmet title="Registry Parameters - The Civil Registry" />
        <GridRow>
          <StyledTitle>Civil Registry Parameters</StyledTitle>
          <StyledDescriptionP>
            The Civil Registry runs on a set of rules called "parameters". These parameters control almost every
            function of the Registry's governance, from how much it costs to challenge a newsroom to how long the voting
            process will take. The Civil community has the power to propose new values for these parameters and new
            rules as the Civil platform evolves.
          </StyledDescriptionP>
        </GridRow>
        <StyledContentRow>
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
                      {params}
                    </tbody>
                  </Table>
                </StyledParameterizerContainer>
              </StyledTabContainer>
            </Tab>

            <Tab title="Government Parameters">
              <StyledTabContainer>
                <StyledP>
                  Civil Council members may propose a change to the current Council Parameters. Once proposed, a vote is
                  begun immediately in which the CVL community can vote to accept or reject it.
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
                            handleCreateProposal={this.showCreateGovtProposal}
                            handleProposalAction={this.showProposalAction}
                            canShowCreateProposal={this.props.isMemberOfAppellate}
                            isGovtProposal={true}
                          />
                        );
                      })}
                    </tbody>
                  </Table>
                </StyledParameterizerContainer>
              </StyledTabContainer>
            </Tab>
          </Tabs>
        </StyledContentRow>

        <GridRowStatic>
          <ListingDiscourse />
        </GridRowStatic>

        {this.state.isCreateProposalVisible && this.renderCreateProposal()}
        {this.state.isCreateGovtProposalVisible && this.renderCreateGovtProposal()}
        {this.state.isProposalActionVisible && this.renderProposalAction()}
      </>
    );
  }

  private renderCreateProposal = (): JSX.Element => {
      const proposalMinDeposit = getFormattedParameterValue(
        Parameters.pMinDeposit, this.props.parameters.get(Parameters.pMinDeposit));
      const pApplyLenText = getFormattedParameterValue(
        Parameters.pApplyStageLen, this.props.parameters.get(Parameters.pApplyStageLen));
      return (
        <CreateProposal
          pApplyLenText={pApplyLenText}
          parameterDisplayName={this.getParameterDisplayName(this.state.createProposalParameterName!)}
          parameterCurrentValue={this.state.createProposalParameterCurrentValue!}
          parameterDisplayUnits={this.getParameterDisplayUnits(this.state.createProposalParameterName!)}
          createProposalParameterName={this.state.createProposalParameterName!}
          parameterProposalValue={this.state.createProposalNewValue!}
          proposalDeposit={proposalMinDeposit}
          handleClose={this.hideCreateProposal}
          handleUpdateProposalValue={this.updateProposalNewValue}
        />
      );
  };

  private renderCreateGovtProposal = (): JSX.Element => {
    return (
      <CreateGovtProposal
        parameterDisplayName={this.getParameterDisplayName(this.state.createProposalParameterName!)}
        parameterCurrentValue={this.state.createProposalParameterCurrentValue!}
        parameterDisplayUnits={this.getParameterDisplayUnits(this.state.createProposalParameterName!)}
        createProposalParameterName={this.state.createProposalParameterName!}
        parameterProposalValue={this.state.createProposalNewValue!}
        handleClose={this.hideCreateGovtProposal}
        handleUpdateProposalValue={this.updateProposalNewValue}
      />
    );
  };

  private renderProposalAction = (): JSX.Element => {
    const { actionType } = this.state;
    switch (actionType) {
      case "challenge":
        return this.renderChallengeProposal();
      case "reveal":
      case "commit":
      case "resolve":
        return this.renderChallengeDetail();
      case "update":
        return this.renderUpdateParam();
      default:
        return <></>;
    }
  };

  private renderUpdateParam = (): JSX.Element => {
    return (
      <ProcessProposal
        challengeProposalID={this.state.challengeProposalID!}
        parameterDisplayName={this.getParameterDisplayName(this.state.createProposalParameterName!)}
        parameterCurrentValue={this.state.createProposalParameterCurrentValue!}
        parameterProposalValue={this.state.createProposalNewValue!}
        parameterNewValue={this.state.challengeProposalNewValue!}
        handleClose={this.hideProposalAction}
      />
    );
  };

  private renderChallengeProposal = (): JSX.Element => {

    const proposalMinDeposit = getFormattedParameterValue(
      Parameters.pMinDeposit, this.props.parameters.get(Parameters.pMinDeposit));

    return (<ChallengeProposal
            challengeProposalID={this.state.challengeProposalID!}
            parameterDisplayName={this.getParameterDisplayName(this.state.createProposalParameterName!)}
            parameterCurrentValue={this.state.createProposalParameterCurrentValue!}
            parameterProposalValue={this.state.createProposalNewValue!}
            parameterNewValue={this.state.challengeProposalNewValue!}
            proposalDeposit={proposalMinDeposit}
            handleClose={this.hideProposalAction}
      />);
  };

  private renderChallengeDetail = (): JSX.Element => {
    return (
      <ChallengeContainer
        propID={this.state.challengeProposalID!}
        challengeID={this.state.proposal!.pollID}
        parameterName={this.state.proposal!.paramName}
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

  private showCreateGovtProposal = (parameterName: string, currentValue: string): void => {
    this.setState(() => ({
      createProposalParameterName: parameterName,
      createProposalParameterCurrentValue: currentValue,
    }));
    this.setState(() => ({ isCreateGovtProposalVisible: true }));
  };

  private showProposalAction = (parameterName: string, currentValue: string, newValue: string, proposal: any, actionType: string): void => {
    this.setState(() => ({
      createProposalParameterName: parameterName,
      createProposalParameterCurrentValue: currentValue,
      challengeProposalID: proposal.propID,
      challengeProposalNewValue: newValue,
      proposal,
      actionType
    }));
    this.setState(() => ({ isProposalActionVisible: true }));
  };

  private hideCreateProposal = (): void => {
    this.setState(() => ({ isCreateProposalVisible: false }));
  };

  private hideCreateGovtProposal = (): void => {
    this.setState(() => ({ isCreateGovtProposalVisible: false }));
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
      [Parameters.challengeAppealLen]: ChallengeAppealLenLabelText,
      [Parameters.challengeAppealCommitLen]: ChallengeAppealCommitStageLenLabelText,
      [Parameters.challengeAppealRevealLen]: ChallengeAppealRevealStageLenLabelText,
      [GovernmentParameters.requestAppealLen]: RequestAppealLenLabelText,
      [GovernmentParameters.judgeAppealLen]: JudgeAppealLenLabelText,
      [GovernmentParameters.govtPCommitStageLen]: GovtProposalCommitStageLenLabelText,
      [GovernmentParameters.govtPRevealStageLen]: GovtProposalRevealStageLenLabelText,

      [Parameters.dispensationPct]: DispensationPctLabelText,
      [Parameters.pDispensationPct]: ParamDispensationPctLabelText,
      [Parameters.voteQuorum]: VoteQuorumLabelText,
      [Parameters.pVoteQuorum]: ParamVoteQuorumLabelText,
      [GovernmentParameters.appealVotePercentage]: AppealVotePercentageLabelText,
      [GovernmentParameters.appealChallengeVoteDispensationPct]: AppealVoteDispensationPctLabelText,
    };

    let DisplayName: React.FunctionComponent = props => <></>;
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
}

const mapToStateToProps = (state: State): ParameterizerPageProps => {
  const govtParameters: GovernmentParameterProps = state.networkDependent.govtParameters as GovernmentParameterProps;
  const isMemberOfAppellate = getIsMemberOfAppellate(state);

  return {
    govtParameters,
    isMemberOfAppellate,
  };
};

export default compose(connectParameters, connect(mapToStateToProps))(Parameterizer);
