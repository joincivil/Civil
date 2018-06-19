import * as React from "react";
import styled from "styled-components";
import {
  AppealData,
  canAppealBeResolved,
  EthAddress,
  isAwaitingAppealChallenge,
  TwoStepEthTransaction,
} from "@joincivil/core";
import { approveForChallengeGrantedAppeal, challengeGrantedAppeal, updateStatus } from "../../apis/civilTCR";
import AppealChallengeDetail from "./AppealChallengeDetail";
import { TransactionButton } from "@joincivil/components";
import CountdownTimer from "../utility/CountdownTimer";
import { getFormattedTokenBalance } from "@joincivil/utils";

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%
  color: black;
`;

export interface AppealDetailProps {
  listingAddress: EthAddress;
  appeal: AppealData;
}

class AppealDetail extends React.Component<AppealDetailProps> {
  constructor(props: AppealDetailProps) {
    super(props);
  }

  public render(): JSX.Element {
    const appeal = this.props.appeal;
    const canResolve = canAppealBeResolved(appeal);
    const canBeChallenged = isAwaitingAppealChallenge(appeal);
    return (
      <StyledDiv>
        <dl>
          <dt>Requester:</dt>
          <dd>{appeal.requester.toString()}</dd>
          <dt>Appeal Fee Paid:</dt>
          <dd>{getFormattedTokenBalance(appeal.appealFeePaid)}</dd>
          {this.renderJudgmentExpiry()}
          <dt>Appeal Granted:</dt>
          <dd>{appeal.appealGranted.toString()}</dd>
        </dl>
        {canBeChallenged && this.renderChallengeAppealStage()}
        {appeal.appealChallenge && (
          <AppealChallengeDetail
            appealChallengeID={appeal.appealChallengeID}
            appealChallenge={appeal.appealChallenge}
          />
        )}
        {canResolve && this.renderCanResolve()}
      </StyledDiv>
    );
  }

  private renderCanResolve(): JSX.Element {
    return <TransactionButton transactions={[{ transaction: this.resolveAppeal }]}>Resolve Appeal</TransactionButton>;
  }

  private renderJudgmentExpiry(): JSX.Element {
    const appeal = this.props.appeal;
    if (appeal.appealGranted) {
      return <></>;
    } else {
      return (
        <>
          <dt>Judgment Expiry:</dt>
          <dd>
            <CountdownTimer endTime={appeal.appealPhaseExpiry.toNumber()} />
          </dd>
        </>
      );
    }
  }

  private renderChallengeAppealStage(): JSX.Element {
    return (
      <TransactionButton
        transactions={[{ transaction: approveForChallengeGrantedAppeal }, { transaction: this.challengeGrantedAppeal }]}
      >
        Challenge Granted Appeal
      </TransactionButton>
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
