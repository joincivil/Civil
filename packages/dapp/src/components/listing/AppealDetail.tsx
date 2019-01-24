import * as React from "react";
import styled from "styled-components";
import { AppealData, ChallengeData, EthAddress, NewsroomWrapper, UserChallengeData } from "@joincivil/core";
import BigNumber from "bignumber.js";
import AppealChallengeDetail from "./AppealChallengeDetail";
import AppealAwaitingDecision from "./AppealAwaitingDecision";
import AppealResolve from "./AppealResolve";
import AppealSubmitChallenge from "./AppealSubmitChallenge";

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%
  color: black;
`;

export interface AppealDetailProps {
  listingAddress: EthAddress;
  newsroom?: NewsroomWrapper,
  appeal: AppealData;
  challengeID: BigNumber;
  challenge: ChallengeData;
  challengeState: any;
  userAppealChallengeData?: UserChallengeData;
  parameters: any;
  govtParameters: any;
  user: EthAddress;
  balance: BigNumber;
  votingBalance: BigNumber;
  isMemberOfAppellate: boolean;
  txIdToConfirm?: number;
  onMobileTransactionClick?(): any;
}

class AppealDetail extends React.Component<AppealDetailProps> {
  public render(): JSX.Element {
    const appeal = this.props.appeal;
    const { canAppealBeResolved, isAwaitingAppealChallenge } = this.props.challengeState;
    const hasAppealChallenge = appeal.appealChallenge;
    return (
      <StyledDiv>
        {!hasAppealChallenge &&
          !canAppealBeResolved &&
          !appeal.appealChallenge &&
          !isAwaitingAppealChallenge &&
          this.renderAwaitingAppealDecision()}
        {isAwaitingAppealChallenge && this.renderChallengeAppealStage()}
        {appeal.appealChallenge &&
          !appeal.appealChallenge.resolved && (
            <AppealChallengeDetail
              listingAddress={this.props.listingAddress}
              challengeID={this.props.challengeID}
              challenge={this.props.challenge}
              appeal={this.props.appeal}
              appealChallengeID={appeal.appealChallengeID}
              appealChallenge={appeal.appealChallenge}
              userAppealChallengeData={this.props.userAppealChallengeData}
              parameters={this.props.parameters}
              govtParameters={this.props.govtParameters}
              balance={this.props.balance}
              votingBalance={this.props.votingBalance}
              user={this.props.user}
              onMobileTransactionClick={this.props.onMobileTransactionClick}
            />
          )}
        {canAppealBeResolved && !appeal.appealChallenge && this.renderCanResolve()}
      </StyledDiv>
    );
  }

  private renderAwaitingAppealDecision(): JSX.Element {
    return <AppealAwaitingDecision {...this.props} />;
  }

  private renderCanResolve(): JSX.Element {
    return <AppealResolve {...this.props} />;
  }

  private renderChallengeAppealStage(): JSX.Element {
    return <AppealSubmitChallenge {...this.props} />;
  }
}

export default AppealDetail;
