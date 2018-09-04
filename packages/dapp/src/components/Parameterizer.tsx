import * as React from "react";
import styled from "styled-components";
import { State } from "../reducers";
import { connect, DispatchProp } from "react-redux";
import { BigNumber } from "bignumber.js";
import { PageView, ViewModule, ViewModuleHeader } from "./utility/ViewModules";
import { ProposeReparameterization } from "./parameterizer/proposeReparameterization";
import { GovernmentReparameterization } from "./parameterizer/GovernmentReparameterization";
import Proposals from "./parameterizer/Proposals";
import { getFormattedTokenBalance, getReadableDuration, Parameters, GovernmentParameters } from "@joincivil/utils";
import { getCivil } from "../helpers/civilInstance";

const StyledSpan = styled.span`
  font-weight: bold;
  margin: 0 10px 0 0;
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
}

class Parameterizer extends React.Component<ParameterizerPageProps & DispatchProp<any>> {
  constructor(props: any) {
    super(props);
  }

  // TODO(sruddy): Nguyet is working on designs for this so I'll update with html/css later
  public render(): JSX.Element {
    const civil = getCivil();

    return (
      <PageView>
        <ViewModule>
          <ViewModuleHeader>Current Parameters</ViewModuleHeader>

          <div>
            <StyledSpan>minDeposit:</StyledSpan>{" "}
            {this.props.parameters.minDeposit &&
              getFormattedTokenBalance(civil.toBigNumber(this.props.parameters.minDeposit.toString()))}
          </div>
          <div>
            <StyledSpan>pMinDeposit:</StyledSpan>{" "}
            {this.props.parameters.pMinDeposit &&
              getFormattedTokenBalance(civil.toBigNumber(this.props.parameters.pMinDeposit.toString()))}
          </div>
          <div>
            <StyledSpan>applyStageLen:</StyledSpan>{" "}
            {this.props.parameters.applyStageLen &&
              getReadableDuration(civil.toBigNumber(this.props.parameters.applyStageLen.toString()))}
          </div>
          <div>
            <StyledSpan>pApplyStageLen:</StyledSpan>{" "}
            {this.props.parameters.pApplyStageLen &&
              getReadableDuration(civil.toBigNumber(this.props.parameters.pApplyStageLen.toString()))}
          </div>
          <div>
            <StyledSpan>commitStageLen:</StyledSpan>{" "}
            {this.props.parameters.commitStageLen &&
              getReadableDuration(civil.toBigNumber(this.props.parameters.commitStageLen.toString()))}
          </div>
          <div>
            <StyledSpan>pCommitStageLen:</StyledSpan>{" "}
            {this.props.parameters.pCommitStageLen &&
              getReadableDuration(civil.toBigNumber(this.props.parameters.pCommitStageLen.toString()))}
          </div>
          <div>
            <StyledSpan>revealStageLen:</StyledSpan>{" "}
            {this.props.parameters.revealStageLen &&
              getReadableDuration(civil.toBigNumber(this.props.parameters.revealStageLen.toString()))}
          </div>
          <div>
            <StyledSpan>pRevealStageLen:</StyledSpan>{" "}
            {this.props.parameters.pRevealStageLen &&
              getReadableDuration(civil.toBigNumber(this.props.parameters.pRevealStageLen.toString()))}
          </div>
          <div>
            <StyledSpan>dispensationPct:</StyledSpan>{" "}
            {this.props.parameters.dispensationPct && this.props.parameters.dispensationPct.toString()}
          </div>
          <div>
            <StyledSpan>pDispensationPct:</StyledSpan>{" "}
            {this.props.parameters.pDispensationPct && this.props.parameters.pDispensationPct.toString()}
          </div>
          <div>
            <StyledSpan>voteQuorum:</StyledSpan>{" "}
            {this.props.parameters.voteQuorum && this.props.parameters.voteQuorum.toString()}
          </div>
          <div>
            <StyledSpan>pVoteQuorum:</StyledSpan>{" "}
            {this.props.parameters.pVoteQuorum && this.props.parameters.pVoteQuorum.toString()}
          </div>
          <div>
            <StyledSpan>pProcessBy:</StyledSpan>{" "}
            {this.props.parameters.pProcessBy &&
              getReadableDuration(civil.toBigNumber(this.props.parameters.pProcessBy.toString()))}
          </div>
          <div>
            <StyledSpan>challengeAppealLen:</StyledSpan>{" "}
            {this.props.parameters.challengeAppealLen &&
              getReadableDuration(civil.toBigNumber(this.props.parameters.challengeAppealLen.toString()))}
          </div>
          <div>
            <StyledSpan>challengeAppealCommitLen:</StyledSpan>{" "}
            {this.props.parameters.challengeAppealCommitLen &&
              getReadableDuration(civil.toBigNumber(this.props.parameters.challengeAppealCommitLen.toString()))}
          </div>
          <div>
            <StyledSpan>challengeAppealRevealLen:</StyledSpan>{" "}
            {this.props.parameters.challengeAppealRevealLen &&
              getReadableDuration(civil.toBigNumber(this.props.parameters.challengeAppealRevealLen.toString()))}
          </div>
          <br />
          <ViewModuleHeader> Goverment Parameters </ViewModuleHeader>
          <div>
            <StyledSpan>requestAppealLen:</StyledSpan>{" "}
            {this.props.govtParameters.requestAppealLen &&
              getReadableDuration(civil.toBigNumber(this.props.govtParameters.requestAppealLen.toString()))}
          </div>
          <div>
            <StyledSpan>judgeAppealLen:</StyledSpan>{" "}
            {this.props.govtParameters.judgeAppealLen &&
              getReadableDuration(civil.toBigNumber(this.props.govtParameters.judgeAppealLen.toString()))}
          </div>
          <div>
            <StyledSpan>appealFee:</StyledSpan>{" "}
            {this.props.govtParameters.appealFee &&
              getFormattedTokenBalance(civil.toBigNumber(this.props.govtParameters.appealFee.toString()))}
          </div>
          <div>
            <StyledSpan>appealVotePercentage:</StyledSpan>{" "}
            {this.props.govtParameters.appealVotePercentage &&
              this.props.govtParameters.appealVotePercentage.toString()}
          </div>
        </ViewModule>

        <ProposeReparameterization
          paramKeys={Object.keys(this.props.parameters)}
          pMinDeposit={this.props.parameters.pMinDeposit && this.props.parameters.pMinDeposit.toString()}
        />

        <GovernmentReparameterization paramKeys={Object.keys(this.props.govtParameters)} />

        <Proposals />
      </PageView>
    );
  }
}

const mapToStateToProps = (state: State): ParameterizerPageProps => {
  const parameters: ParameterizerProps = state.networkDependent.parameters as ParameterizerProps;
  const govtParameters: GovernmentParameterProps = state.networkDependent.govtParameters as GovernmentParameterProps;
  console.log("govtParameters: ", govtParameters);
  return { parameters, govtParameters };
};

export default connect(mapToStateToProps)(Parameterizer);
