import * as React from "react";
import styled from "styled-components";
import { State } from "../reducers";
import { connect, DispatchProp } from "react-redux";
import { BigNumber } from "bignumber.js";
import { PageView, ViewModule, ViewModuleHeader } from "./utility/ViewModules";
import { ProposeReparameterization } from "./parameterizer/proposeReparameterization";
import Proposals from "./parameterizer/Proposals";

const StyledSpan = styled.span`
  font-weight: bold;
  margin: 0 10px 0 0;
`;

export interface ParameterizerProps {
  minDeposit: BigNumber;
  pMinDeposit: BigNumber;
  applyStageLen: BigNumber;
  pApplyStageLen: BigNumber;
  commitStageLen: BigNumber;
  pCommitStageLen: BigNumber;
  revealStageLen: BigNumber;
  pRevealStageLen: BigNumber;
  dispensationPct: BigNumber;
  pDispensationPct: BigNumber;
  voteQuorum: BigNumber;
  pVoteQuorum: BigNumber;
  pProcessBy: BigNumber;
  challengeAppealLen: BigNumber;
  challengeAppealCommitLen: BigNumber;
  challengeAppealRevealLen: BigNumber;
}

export interface ParameterizerPageProps {
  parameters: ParameterizerProps;
}

class Parameterizer extends React.Component<ParameterizerPageProps & DispatchProp<any>> {
  constructor(props: any) {
    super(props);
  }

  // TODO(sruddy): Nguyet is working on designs for this so I'll update with html/css later
  public render(): JSX.Element {
    return (
      <PageView>
        <ViewModule>
          <ViewModuleHeader>Current Parameters</ViewModuleHeader>

          <div>
            <StyledSpan>minDeposit:</StyledSpan>{" "}
            {this.props.parameters.minDeposit && this.props.parameters.minDeposit.toString()}
          </div>
          <div>
            <StyledSpan>pMinDeposit:</StyledSpan>{" "}
            {this.props.parameters.pMinDeposit && this.props.parameters.pMinDeposit.toString()}
          </div>
          <div>
            <StyledSpan>applyStageLen:</StyledSpan>{" "}
            {this.props.parameters.applyStageLen && this.props.parameters.applyStageLen.toString()}
          </div>
          <div>
            <StyledSpan>pApplyStageLen:</StyledSpan>{" "}
            {this.props.parameters.pApplyStageLen && this.props.parameters.pApplyStageLen.toString()}
          </div>
          <div>
            <StyledSpan>commitStageLen:</StyledSpan>{" "}
            {this.props.parameters.commitStageLen && this.props.parameters.commitStageLen.toString()}
          </div>
          <div>
            <StyledSpan>pCommitStageLen:</StyledSpan>{" "}
            {this.props.parameters.pCommitStageLen && this.props.parameters.pCommitStageLen.toString()}
          </div>
          <div>
            <StyledSpan>revealStageLen:</StyledSpan>{" "}
            {this.props.parameters.revealStageLen && this.props.parameters.revealStageLen.toString()}
          </div>
          <div>
            <StyledSpan>pRevealStageLen:</StyledSpan>{" "}
            {this.props.parameters.pRevealStageLen && this.props.parameters.pRevealStageLen.toString()}
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
            {this.props.parameters.pProcessBy && this.props.parameters.pProcessBy.toString()}
          </div>
          <div>
            <StyledSpan>challengeAppealLen:</StyledSpan>{" "}
            {this.props.parameters.challengeAppealLen && this.props.parameters.challengeAppealLen.toString()}
          </div>
          <div>
            <StyledSpan>challengeAppealCommitLen:</StyledSpan>{" "}
            {this.props.parameters.challengeAppealCommitLen &&
              this.props.parameters.challengeAppealCommitLen.toString()}
          </div>
          <div>
            <StyledSpan>challengeAppealRevealLen:</StyledSpan>{" "}
            {this.props.parameters.challengeAppealRevealLen &&
              this.props.parameters.challengeAppealRevealLen.toString()}
          </div>
        </ViewModule>

        <ProposeReparameterization
          paramKeys={Object.keys(this.props.parameters)}
          pMinDeposit={this.props.parameters.pMinDeposit && this.props.parameters.pMinDeposit.toString()}
        />

        <Proposals />
      </PageView>
    );
  }
}

const mapToStateToProps = (state: State): ParameterizerPageProps => {
  const parameters: ParameterizerProps = state.parameters as ParameterizerProps;
  return { parameters };
};

export default connect(mapToStateToProps)(Parameterizer);
