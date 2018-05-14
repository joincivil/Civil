import * as React from "react";
import styled from "styled-components";
import { State } from "../reducers";
import { connect, DispatchProp } from "react-redux";

const StyledSpan = styled.span`
  font-weight: bold;
  margin: 0 10px 0 0;
`;

export interface ParameterizerProps {
  minDeposit: string;
  pMinDeposit: string;
  applyStageLen: string;
  pApplyStageLen: string;
  commitStageLen: string;
  pCommitStageLen: string;
  revealStageLen: string;
  pRevealStageLen: string;
  dispensationPct: string;
  pDispensationPct: string;
  voteQuorum: string;
  pVoteQuorum: string;
  pProcessBy: string;
  challengeAppealLen: string;
  challengeAppealCommitLen: string;
  challengeAppealRevealLen: string;
}

export interface ParameterizerPageProps {
  parameters: object;
}

class Parameterizer extends React.Component<ParameterizerProps & DispatchProp<any>> {
  constructor(props: any) {
    super(props);
  }

  // TODO(sruddy): Nguyet is working on designs for this so I'll update with html/css later
  public render(): JSX.Element {
    return (
      <>
        <div>
          <StyledSpan>minDeposit:</StyledSpan> {this.props.minDeposit && this.props.minDeposit.toString()}
        </div>
        <div>
          <StyledSpan>pMinDeposit:</StyledSpan> {this.props.pMinDeposit && this.props.pMinDeposit.toString()}
        </div>
        <div>
          <StyledSpan>applyStageLen:</StyledSpan> {this.props.applyStageLen && this.props.applyStageLen.toString()}
        </div>
        <div>
          <StyledSpan>pApplyStageLen:</StyledSpan> {this.props.pApplyStageLen && this.props.pApplyStageLen.toString()}
        </div>
        <div>
          <StyledSpan>commitStageLen:</StyledSpan> {this.props.commitStageLen && this.props.commitStageLen.toString()}
        </div>
        <div>
          <StyledSpan>pCommitStageLen:</StyledSpan> {this.props.pCommitStageLen && this.props.pCommitStageLen.toString()}
        </div>
        <div>
          <StyledSpan>revealStageLen:</StyledSpan> {this.props.revealStageLen && this.props.revealStageLen.toString()}
        </div>
        <div>
          <StyledSpan>pRevealStageLen:</StyledSpan> {this.props.pRevealStageLen && this.props.pRevealStageLen.toString()}
        </div>
        <div>
          <StyledSpan>dispensationPct:</StyledSpan> {this.props.dispensationPct && this.props.dispensationPct.toString()}
        </div>
        <div>
          <StyledSpan>pDispensationPct:</StyledSpan> {this.props.pDispensationPct && this.props.pDispensationPct.toString()}
        </div>
        <div>
          <StyledSpan>voteQuorum:</StyledSpan> {this.props.voteQuorum && this.props.voteQuorum.toString()}
        </div>
        <div>
          <StyledSpan>pVoteQuorum:</StyledSpan> {this.props.pVoteQuorum && this.props.pVoteQuorum.toString()}
        </div>
        <div>
          <StyledSpan>pProcessBy:</StyledSpan> {this.props.pProcessBy && this.props.pProcessBy.toString()}
        </div>
        <div>
          <StyledSpan>challengeAppealLen:</StyledSpan> {this.props.challengeAppealLen && this.props.challengeAppealLen.toString()}
        </div>
        <div>
          <StyledSpan>challengeAppealCommitLen:</StyledSpan> {this.props.challengeAppealCommitLen && this.props.challengeAppealCommitLen.toString()}
        </div>
        <div>
          <StyledSpan>challengeAppealRevealLen:</StyledSpan> {this.props.challengeAppealRevealLen && this.props.challengeAppealRevealLen.toString()}
        </div>
      </>
    );
  }

}

const mapToStateToProps = (state: State, ownProps: ParameterizerProps): ParameterizerProps => {
  const { parameters } = state;
  return parameters as ParameterizerProps;
};

export default connect(mapToStateToProps)(Parameterizer);
