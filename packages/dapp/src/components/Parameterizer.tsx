import * as React from "react";
import styled from "styled-components";
import { getParameterValue } from "../apis/civilTCR";

const StyledSpan = styled.span`
  font-weight: bold;
  margin: 0 10px 0 0;
`;

export interface ParameterStates {
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

class Parameterizer extends React.Component<{}, ParameterStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      minDeposit: "",
      pMinDeposit: "",
      applyStageLen: "",
      pApplyStageLen: "",
      commitStageLen: "",
      pCommitStageLen: "",
      revealStageLen: "",
      pRevealStageLen: "",
      dispensationPct: "",
      pDispensationPct: "",
      voteQuorum: "",
      pVoteQuorum: "",
      pProcessBy: "",
      challengeAppealLen: "",
      challengeAppealCommitLen: "",
      challengeAppealRevealLen: "",
    };
  }

  public async componentDidMount(): Promise<void> {
    return this.initParameterValues();
  }

  // TODO(sruddy): Nguyet is working on designs for this so I'll update with html/css later
  public render(): JSX.Element {
    return (
      <>
        <div>
          <StyledSpan>minDeposit:</StyledSpan> {this.state.minDeposit}
        </div>
        <div>
          <StyledSpan>pMinDeposit:</StyledSpan> {this.state.pMinDeposit}
        </div>
        <div>
          <StyledSpan>applyStageLen:</StyledSpan> {this.state.applyStageLen}
        </div>
        <div>
          <StyledSpan>pApplyStageLen:</StyledSpan> {this.state.pApplyStageLen}
        </div>
        <div>
          <StyledSpan>commitStageLen:</StyledSpan> {this.state.commitStageLen}
        </div>
        <div>
          <StyledSpan>pCommitStageLen:</StyledSpan> {this.state.pCommitStageLen}
        </div>
        <div>
          <StyledSpan>revealStageLen:</StyledSpan> {this.state.revealStageLen}
        </div>
        <div>
          <StyledSpan>pRevealStageLen:</StyledSpan> {this.state.pRevealStageLen}
        </div>
        <div>
          <StyledSpan>dispensationPct:</StyledSpan> {this.state.dispensationPct}
        </div>
        <div>
          <StyledSpan>pDispensationPct:</StyledSpan> {this.state.pDispensationPct}
        </div>
        <div>
          <StyledSpan>voteQuorum:</StyledSpan> {this.state.voteQuorum}
        </div>
        <div>
          <StyledSpan>pVoteQuorum:</StyledSpan> {this.state.pVoteQuorum}
        </div>
        <div>
          <StyledSpan>pProcessBy:</StyledSpan> {this.state.pProcessBy}
        </div>
        <div>
          <StyledSpan>challengeAppealLen:</StyledSpan> {this.state.challengeAppealLen}
        </div>
        <div>
          <StyledSpan>challengeAppealCommitLen:</StyledSpan> {this.state.challengeAppealCommitLen}
        </div>
        <div>
          <StyledSpan>challengeAppealRevealLen:</StyledSpan> {this.state.challengeAppealRevealLen}
        </div>
      </>
    );
  }

  private initParameterValues = async (): Promise<any> => {
    const keys = Object.keys(this.state);

    const parameterVals = await getParameterValue(keys);
    const paramObj = parameterVals.reduce((acc, item, index) => {
      acc[keys[index]] = item.toString();
      return acc;
    }, {});

    this.setState(paramObj);
  };
}

export default Parameterizer;
