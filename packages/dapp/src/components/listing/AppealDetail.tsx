import * as React from "react";
import styled from "styled-components";
import {
  AppealData,
  ChallengeData,
  canAppealBeResolved,
  EthAddress,
  isAwaitingAppealChallenge,
  TwoStepEthTransaction,
} from "@joincivil/core";
import { approveForChallengeGrantedAppeal, challengeGrantedAppeal, updateStatus } from "../../apis/civilTCR";
import AppealChallengeDetail from "./AppealChallengeDetail";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { AppealAwaitingDecisionCard, TransactionButton, AppealDecisionCard } from "@joincivil/components";

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%
  color: black;
`;

export interface AppealDetailProps {
  listingAddress: EthAddress;
  appeal: AppealData;
  challenge: ChallengeData;
  govtParameters: any;
  tokenBalance: number;
}

class AppealDetail extends React.Component<AppealDetailProps> {
  constructor(props: AppealDetailProps) {
    super(props);
  }

  public render(): JSX.Element {
    const appeal = this.props.appeal;
    const canResolve = canAppealBeResolved(appeal);
    const canBeChallenged = isAwaitingAppealChallenge(appeal);
    const hasAppealChallenge = appeal.appealChallenge;
    return (
      <StyledDiv>
        {!hasAppealChallenge && this.renderAwaitingAppealDecision()}
        {canBeChallenged && this.renderChallengeAppealStage()}
        {appeal.appealChallenge && (
          <AppealChallengeDetail
            appealChallengeID={appeal.appealChallengeID}
            appealChallenge={appeal.appealChallenge}
            govtParameters={this.props.govtParameters}
            tokenBalance={this.props.tokenBalance}
          />
        )}
        {canResolve && this.renderCanResolve()}
      </StyledDiv>
    );
  }

  private renderAwaitingAppealDecision(): JSX.Element {
    const appeal = this.props.appeal;
    const challenge = this.props.challenge;
    const requester = appeal.requester.toString();
    const appealFeePaid = getFormattedTokenBalance(appeal.appealFeePaid);
    const endTime = appeal.appealPhaseExpiry.toNumber();
    const phaseLength = this.props.govtParameters.judgeAppealLen;
    const totalVotes = challenge.poll.votesAgainst.add(challenge.poll.votesFor);
    const votesFor = challenge.poll.votesFor;
    const votesAgainst = challenge.poll.votesFor;
    const percentFor = challenge.poll.votesFor.div(totalVotes).mul(100);
    const percentAgainst = challenge.poll.votesAgainst.div(totalVotes).mul(100);
    return (
      <AppealAwaitingDecisionCard
        endTime={endTime}
        phaseLength={phaseLength}
        requester={requester}
        appealFeePaid={appealFeePaid}
        totalVotes={totalVotes.toString()}
        votesFor={votesFor.toString()}
        votesAgainst={votesAgainst.toString()}
        percentFor={percentFor.toString()}
        percentAgainst={percentAgainst.toString()}
      />
    );
  }

  private renderCanResolve(): JSX.Element {
    return <TransactionButton transactions={[{ transaction: this.resolveAppeal }]}>Resolve Appeal</TransactionButton>;
  }

  private renderChallengeAppealStage(): JSX.Element {
    const appeal = this.props.appeal;
    const appealGranted = appeal.appealGranted;
    const transactions = [
      { transaction: approveForChallengeGrantedAppeal },
      { transaction: this.challengeGrantedAppeal },
    ];
    const endTime = appeal.appealOpenToChallengeExpiry.toNumber();
    const phaseLength = this.props.govtParameters.challengeAppealLen;
    return (
      <AppealDecisionCard
        endTime={endTime}
        phaseLength={phaseLength}
        transactions={transactions}
        appealGranted={appealGranted}
      />
    );
  }

  private challengeGrantedAppeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return challengeGrantedAppeal(this.props.listingAddress);
  };
  private resolveAppeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return updateStatus(this.props.listingAddress);
  };
}

export default AppealDetail;
