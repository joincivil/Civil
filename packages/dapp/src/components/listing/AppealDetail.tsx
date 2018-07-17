import * as React from "react";
import styled from "styled-components";
import { AppealData, ChallengeData, EthAddress, TwoStepEthTransaction } from "@joincivil/core";
import {
  approveForChallengeGrantedAppeal,
  challengeGrantedAppeal,
  grantAppeal,
  updateStatus,
} from "../../apis/civilTCR";
import AppealChallengeDetail from "./AppealChallengeDetail";
import { getFormattedTokenBalance } from "@joincivil/utils";
import {
  AppealAwaitingDecisionCard,
  AppealResolveCard,
  AppealDecisionCard,
  LoadingIndicator,
  ModalHeading,
  ModalContent,
  ModalOrderedList,
  ModalListItem,
  ModalListItemTypes,
} from "@joincivil/components";

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%
  color: black;
`;

enum ModalContentEventNames {
  GRANT_APPEAL = "GRANT_APPEAL",
  RESOLVE_APPEAL = "RESOLVE_APPEAL",
  APPROVE_CHALLENGE_APPEAL = "APPROVE_CHALLENGE_APPEAL",
  CHALLENGE_APPEAL = "CHALLENGE_APPEAL",
}

export interface AppealDetailProps {
  listingAddress: EthAddress;
  appeal: AppealData;
  challenge: ChallengeData;
  challengeState: any;
  govtParameters: any;
  tokenBalance: number;
}

class AppealDetail extends React.Component<AppealDetailProps> {
  constructor(props: AppealDetailProps) {
    super(props);
  }

  public render(): JSX.Element {
    const appeal = this.props.appeal;
    const { canAppealBeResolved, isAwaitingAppealChallenge } = this.props.challengeState;
    const hasAppealChallenge = appeal.appealChallenge;
    return (
      <StyledDiv>
        {!hasAppealChallenge && this.renderAwaitingAppealDecision()}
        {isAwaitingAppealChallenge && this.renderChallengeAppealStage()}
        {appeal.appealChallenge && (
          <AppealChallengeDetail
            listingAddress={this.props.listingAddress}
            challenge={this.props.challenge}
            appeal={this.props.appeal}
            appealChallengeID={appeal.appealChallengeID}
            appealChallenge={appeal.appealChallenge}
            govtParameters={this.props.govtParameters}
            tokenBalance={this.props.tokenBalance}
          />
        )}
        {canAppealBeResolved && this.renderCanResolve()}
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
    const votesFor = getFormattedTokenBalance(challenge.poll.votesFor);
    const votesAgainst = getFormattedTokenBalance(challenge.poll.votesAgainst);
    const percentFor = challenge.poll.votesFor
      .div(totalVotes)
      .mul(100)
      .toFixed(0);
    const percentAgainst = challenge.poll.votesAgainst
      .div(totalVotes)
      .mul(100)
      .toFixed(0);

    const { isAppealAwaitingJudgment } = this.props.challengeState;

    // @TODO(jon): Check if user is in Civil Council multi-sig
    let transactions;
    let modalContentComponents;
    if (isAppealAwaitingJudgment) {
      const grantAppealProgressModal = this.renderGrantAppealProgressModal();
      modalContentComponents = {
        [ModalContentEventNames.GRANT_APPEAL]: grantAppealProgressModal,
      };
      transactions = [
        {
          transaction: this.grantAppeal,
          progressEventName: ModalContentEventNames.GRANT_APPEAL,
        },
      ];
    }

    return (
      <AppealAwaitingDecisionCard
        endTime={endTime}
        phaseLength={phaseLength}
        requester={requester}
        appealFeePaid={appealFeePaid}
        totalVotes={getFormattedTokenBalance(totalVotes)}
        votesFor={votesFor}
        votesAgainst={votesAgainst}
        percentFor={percentFor.toString()}
        percentAgainst={percentAgainst.toString()}
        transactions={transactions}
        modalContentComponents={modalContentComponents}
      />
    );
  }

  private renderCanResolve(): JSX.Element {
    const resolveAppealProgressModal = this.renderResolveAppealProgressModal();
    const modalContentComponents = {
      [ModalContentEventNames.RESOLVE_APPEAL]: resolveAppealProgressModal,
    };
    const transactions = [
      {
        transaction: this.resolveAppeal,
        progressEventName: ModalContentEventNames.RESOLVE_APPEAL,
      },
    ];
    const challenge = this.props.challenge;
    const appealGranted = this.props.appeal.appealGranted;
    const totalVotes = challenge.poll.votesAgainst.add(challenge.poll.votesFor);
    const votesFor = getFormattedTokenBalance(challenge.poll.votesFor);
    const votesAgainst = getFormattedTokenBalance(challenge.poll.votesAgainst);
    const percentFor = challenge.poll.votesFor
      .div(totalVotes)
      .mul(100)
      .toFixed(0);
    const percentAgainst = challenge.poll.votesAgainst
      .div(totalVotes)
      .mul(100)
      .toFixed(0);
    return (
      <AppealResolveCard
        totalVotes={getFormattedTokenBalance(totalVotes)}
        votesFor={votesFor}
        votesAgainst={votesAgainst}
        percentFor={percentFor.toString()}
        percentAgainst={percentAgainst.toString()}
        appealGranted={appealGranted}
        transactions={transactions}
        modalContentComponents={modalContentComponents}
      />
    );
  }

  private renderChallengeAppealStage(): JSX.Element {
    const challenge = this.props.challenge;
    const totalVotes = challenge.poll.votesAgainst.add(challenge.poll.votesFor);
    const votesFor = getFormattedTokenBalance(challenge.poll.votesFor);
    const votesAgainst = getFormattedTokenBalance(challenge.poll.votesAgainst);
    const percentFor = challenge.poll.votesFor
      .div(totalVotes)
      .mul(100)
      .toFixed(0);
    const percentAgainst = challenge.poll.votesAgainst
      .div(totalVotes)
      .mul(100)
      .toFixed(0);
    const appeal = this.props.appeal;
    const appealGranted = appeal.appealGranted;
    const approveForChallengeProgressModal = this.getApproveForChallengeProgressModal();
    const challengeProgressModal = this.getChallengeProgressModal();
    const modalContentComponents = {
      [ModalContentEventNames.APPROVE_CHALLENGE_APPEAL]: approveForChallengeProgressModal,
      [ModalContentEventNames.CHALLENGE_APPEAL]: challengeProgressModal,
    };
    const transactions = [
      {
        transaction: approveForChallengeGrantedAppeal,
        progressEventName: ModalContentEventNames.APPROVE_CHALLENGE_APPEAL,
      },
      { transaction: this.challengeGrantedAppeal, progressEventName: ModalContentEventNames.CHALLENGE_APPEAL },
    ];
    const endTime = appeal.appealOpenToChallengeExpiry.toNumber();
    const phaseLength = this.props.govtParameters.challengeAppealLen;
    return (
      <AppealDecisionCard
        endTime={endTime}
        phaseLength={phaseLength}
        totalVotes={getFormattedTokenBalance(totalVotes)}
        votesFor={votesFor}
        votesAgainst={votesAgainst}
        percentFor={percentFor.toString()}
        percentAgainst={percentAgainst.toString()}
        appealGranted={appealGranted}
        transactions={transactions}
        modalContentComponents={modalContentComponents}
      />
    );
  }

  private getApproveForChallengeProgressModal(): JSX.Element {
    return (
      <>
        <LoadingIndicator height={100} />
        <ModalHeading>Transactions in progress</ModalHeading>
        <ModalOrderedList>
          <ModalListItem type={ModalListItemTypes.STRONG}>Approving for Challenge</ModalListItem>
          <ModalListItem type={ModalListItemTypes.FADED}>Challenge Granted Appeal</ModalListItem>
        </ModalOrderedList>
        <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
        <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
      </>
    );
  }

  private getChallengeProgressModal(): JSX.Element {
    return (
      <>
        <LoadingIndicator height={100} />
        <ModalHeading>Transactions in progress</ModalHeading>
        <ModalOrderedList>
          <ModalListItem>Approving for Challenge</ModalListItem>
          <ModalListItem type={ModalListItemTypes.STRONG}>Challenge Granted Appeal</ModalListItem>
        </ModalOrderedList>
        <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
        <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
      </>
    );
  }

  private renderResolveAppealProgressModal(): JSX.Element {
    return (
      <>
        <LoadingIndicator height={100} />
        <ModalHeading>Transaction in progress</ModalHeading>
        <ModalOrderedList>
          <ModalListItem type={ModalListItemTypes.STRONG}>Resolving appeal</ModalListItem>
        </ModalOrderedList>
        <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
        <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
      </>
    );
  }

  private renderGrantAppealProgressModal(): JSX.Element {
    return (
      <>
        <LoadingIndicator height={100} />
        <ModalHeading>Transaction in progress</ModalHeading>
        <ModalOrderedList>
          <ModalListItem type={ModalListItemTypes.STRONG}>Granting appeal</ModalListItem>
        </ModalOrderedList>
        <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
        <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
      </>
    );
  }

  private grantAppeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return grantAppeal(this.props.listingAddress);
  };

  private challengeGrantedAppeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return challengeGrantedAppeal(this.props.listingAddress);
  };
  private resolveAppeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return updateStatus(this.props.listingAddress);
  };
}

export default AppealDetail;
