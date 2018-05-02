import * as React from "react";
import styled from "styled-components";
import {
  AppealData,
  canAppealBeResolved,
  EthAddress,
  isAwaitingAppealChallenge,
  TwoStepEthTransaction,
} from "@joincivil/core";
import { updateListing } from "../../apis/civilTCR";
import AppealChallengeDetail from "./AppealChallengeDetail";
import TransactionButton from "../utility/TransactionButton";

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
        Requester: {appeal.requester.toString()}
        <br />
        Appeal Fee Paid: {appeal.appealFeePaid.toString()}
        <br />
        Judgment Expiry: {appeal.appealPhaseExpiry.toString()}
        <br />
        Appeal Granted: {appeal.appealPhaseExpiry.toString()}
        <br />
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

  private renderChallengeAppealStage(): JSX.Element {
    return <>CHALLENGE GRANTED APPEAL</>;
  }

  private resolveAppeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return updateListing(this.props.listingAddress);
  };
}

export default AppealDetail;
