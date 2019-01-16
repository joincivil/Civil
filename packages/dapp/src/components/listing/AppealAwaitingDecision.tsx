import * as React from "react";
import { compose } from "redux";
import { TwoStepEthTransaction, TxHash } from "@joincivil/core";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { AppealAwaitingDecisionCard, ModalContent } from "@joincivil/components";

import { confirmAppeal, grantAppeal } from "../../apis/civilTCR";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../utility/TransactionStatusModalsHOC";

import { AppealDetailProps } from "./AppealDetail";

enum TransactionTypes {
  GRANT_APPEAL = "GRANT_APPEAL",
  CONFIRM_APPEAL = "CONFIRM_APPEAL",
}

const transactionLabels = {
  [TransactionTypes.GRANT_APPEAL]: "Grant Appeal",
  [TransactionTypes.CONFIRM_APPEAL]: "Confirm Appeal",
};

const denialSuffix = ", you need to confirm the transaction in your MetaMask wallet.";

const transactionRejectionContent = {
  [TransactionTypes.GRANT_APPEAL]: ["The appeal was not granted", `To grant the appeal${denialSuffix}`],
  [TransactionTypes.CONFIRM_APPEAL]: ["The appeal was not confirmed", `To confirm the appeal${denialSuffix}`],
};

const transactionErrorContent = {
  [TransactionTypes.GRANT_APPEAL]: [
    "There was a problem granting the appeal",
    <ModalContent>Please retry your transaction</ModalContent>,
  ],
  [TransactionTypes.CONFIRM_APPEAL]: [
    "There was a problem confirming the appeal",
    <ModalContent>Please retry your transaction</ModalContent>,
  ],
};

const transactionSuccessContent = {
  [TransactionTypes.GRANT_APPEAL]: ["The appeal was granted", undefined],
  [TransactionTypes.CONFIRM_APPEAL]: ["The appeal was confirmed", undefined],
};

const transactionStatusModalConfig = {
  transactionLabels,
  transactionSuccessContent,
  transactionRejectionContent,
  transactionErrorContent,
};

class AwaitingAppealDecision extends React.Component<AppealDetailProps & InjectedTransactionStatusModalProps> {
  public render(): JSX.Element {
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
    const didChallengeSucceed = challenge.poll.votesAgainst.greaterThan(challenge.poll.votesFor);

    const transactions = this.getTransactions();

    if (transactions) {
      this.props.setTransactions(transactions);
    }

    return (
      <>
        <AppealAwaitingDecisionCard
          endTime={endTime}
          phaseLength={phaseLength}
          challengeID={this.props.challengeID.toString()}
          challenger={challenge!.challenger.toString()}
          isViewingUserChallenger={challenge!.challenger.toString() === this.props.user}
          rewardPool={getFormattedTokenBalance(challenge!.rewardPool)}
          stake={getFormattedTokenBalance(challenge!.stake)}
          requester={requester}
          appealFeePaid={appealFeePaid}
          totalVotes={getFormattedTokenBalance(totalVotes)}
          votesFor={votesFor}
          votesAgainst={votesAgainst}
          percentFor={percentFor.toString()}
          percentAgainst={percentAgainst.toString()}
          didChallengeSucceed={didChallengeSucceed}
          transactions={transactions}
          txIdToConfirm={this.props.txIdToConfirm}
          onMobileTransactionClick={this.props.onMobileTransactionClick}
        />
      </>
    );
  }

  private getTransactions = (): any[] | undefined => {
    const { isAwaitingAppealJudgment } = this.props.challengeState;
    let transactions;
    if (isAwaitingAppealJudgment && this.props.isMemberOfAppellate) {
      if (this.props.txIdToConfirm) {
        transactions = [
          {
            transaction: async () => {
              this.props.updateTransactionStatusModalsState({
                isWaitingTransactionModalOpen: true,
                isTransactionProgressModalOpen: false,
                isTransactionSuccessModalOpen: false,
                transactionType: TransactionTypes.CONFIRM_APPEAL,
              });
              return this.confirmAppeal();
            },
            handleTransactionHash: (txHash: TxHash) => {
              this.props.updateTransactionStatusModalsState({
                isWaitingTransactionModalOpen: false,
                isTransactionProgressModalOpen: true,
              });
            },
            postTransaction: () => {
              this.props.updateTransactionStatusModalsState({
                isWaitingTransactionModalOpen: false,
                isTransactionProgressModalOpen: false,
                isTransactionSuccessModalOpen: true,
              });
            },
            handleTransactionError: this.props.handleTransactionError,
          },
        ];
      } else {
        transactions = [
          {
            transaction: async () => {
              this.props.updateTransactionStatusModalsState({
                isWaitingTransactionModalOpen: true,
                isTransactionProgressModalOpen: false,
                isTransactionSuccessModalOpen: false,
                transactionType: TransactionTypes.GRANT_APPEAL,
              });
              return this.grantAppeal();
            },
            handleTransactionHash: (txHash: TxHash) => {
              this.props.updateTransactionStatusModalsState({
                isWaitingTransactionModalOpen: false,
                isTransactionProgressModalOpen: true,
              });
            },
            postTransaction: () => {
              this.props.updateTransactionStatusModalsState({
                isWaitingTransactionModalOpen: false,
                isTransactionProgressModalOpen: false,
                isTransactionSuccessModalOpen: true,
              });
            },
            handleTransactionError: this.props.handleTransactionError,
          },
        ];
      }
    }
    return transactions;
  };

  private grantAppeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return grantAppeal(this.props.listingAddress);
  };

  private confirmAppeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return confirmAppeal(this.props.txIdToConfirm!);
  };
}

export default compose<React.ComponentClass<AppealDetailProps>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(AwaitingAppealDecision);
