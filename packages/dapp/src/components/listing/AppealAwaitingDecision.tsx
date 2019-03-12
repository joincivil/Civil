import * as React from "react";
import { compose } from "redux";
import { TwoStepEthTransaction, TxHash } from "@joincivil/core";
import { getFormattedTokenBalance, FAQ_BASE_URL, urlConstants as links } from "@joincivil/utils";
import {
  AppealAwaitingDecisionCard as AppealAwaitingDecisionCardComponent,
  AppealAwaitingDecisionCardProps,
  ModalContent,
} from "@joincivil/components";

import { confirmAppeal, grantAppeal } from "../../apis/civilTCR";
import {
  ChallengeContainerProps,
  connectChallengePhase,
  connectChallengeResults,
} from "../utility/HigherOrderComponents";
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
  [TransactionTypes.GRANT_APPEAL]: ["The grant appeal transaction has been sent to the council multisig", undefined],
  [TransactionTypes.CONFIRM_APPEAL]: [
    "The grant appeal transaction was confirmed. If enough council members have confirmed, it will execute and grant the appeal.",
    undefined,
  ],
};

const transactionStatusModalConfig = {
  transactionLabels,
  transactionSuccessContent,
  transactionRejectionContent,
  transactionErrorContent,
};

const AppealAwaitingDecisionCard = compose<
  React.ComponentClass<ChallengeContainerProps & Partial<AppealAwaitingDecisionCardProps>>
>(connectChallengePhase, connectChallengeResults)(AppealAwaitingDecisionCardComponent);

interface AwaitingAppealDecisionState {
  uriValue: string;
}

class AwaitingAppealDecision extends React.Component<
  AppealDetailProps & InjectedTransactionStatusModalProps,
  AwaitingAppealDecisionState
> {
  constructor(props: AppealDetailProps & InjectedTransactionStatusModalProps) {
    super(props);
    this.state = {
      uriValue: "",
    };
  }
  public render(): JSX.Element {
    const appeal = this.props.appeal;
    const requester = appeal.requester.toString();
    const appealFeePaid = getFormattedTokenBalance(appeal.appealFeePaid);
    const phaseLength = this.props.govtParameters.judgeAppealLen;
    const transactions = this.getTransactions();
    const endTime = parseInt(appeal.appealPhaseExpiry.toString(), 10);

    if (transactions) {
      this.props.setTransactions(transactions);
    }

    return (
      <>
        <AppealAwaitingDecisionCard
          challengeID={this.props.challengeID.toString()}
          phaseLength={phaseLength}
          requester={requester}
          appealFeePaid={appealFeePaid}
          endTime={endTime}
          transactions={transactions}
          txIdToConfirm={this.props.txIdToConfirm}
          onMobileTransactionClick={this.props.onMobileTransactionClick}
          uriValue={this.state.uriValue}
          onChange={this.onURIChange}
          faqURL={`${FAQ_BASE_URL}${links.FAQ_REGISTRY}`}
        />
      </>
    );
  }

  private onURIChange = (name: string, value: string) => {
    this.setState({ uriValue: value });
  };

  private getTransactions = (): any[] | undefined => {
    const { isAwaitingAppealJudgement } = this.props.challengeState;
    let transactions;
    if (isAwaitingAppealJudgement && this.props.isMemberOfAppellate) {
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
              return this.grantAppeal(this.state.uriValue);
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

  private grantAppeal = async (uri: string): Promise<TwoStepEthTransaction<any>> => {
    return grantAppeal(this.props.listingAddress, uri);
  };

  private confirmAppeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return confirmAppeal(this.props.txIdToConfirm!);
  };
}

export default compose<React.ComponentClass<AppealDetailProps>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(AwaitingAppealDecision);
