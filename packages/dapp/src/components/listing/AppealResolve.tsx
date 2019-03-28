import * as React from "react";
import { compose } from "redux";
import { TwoStepEthTransaction, TxHash } from "@joincivil/core";
import {
  AppealResolveCard as AppealResolveCardComponent,
  ModalContent,
  ListingDetailPhaseCardComponentProps,
  ChallengePhaseProps,
  AppealDecisionProps,
} from "@joincivil/components";
import { urlConstants as links } from "@joincivil/utils";

import { updateStatus } from "../../apis/civilTCR";
import {
  ChallengeContainerProps,
  connectChallengePhase,
  connectChallengeResults,
} from "../utility/HigherOrderComponents";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../utility/TransactionStatusModalsHOC";

import { AppealDetailProps } from "./AppealDetail";

const AppealResolveCard = compose<
  React.ComponentType<
    ListingDetailPhaseCardComponentProps & ChallengePhaseProps & ChallengeContainerProps & AppealDecisionProps
  >
>(connectChallengeResults, connectChallengePhase)(AppealResolveCardComponent);

enum TransactionTypes {
  RESOLVE_APPEAL = "RESOLVE_APPEAL",
}

const transactionLabels = {
  [TransactionTypes.RESOLVE_APPEAL]: "Resolve Appeal",
};

const transactionRejectionContent = {
  [TransactionTypes.RESOLVE_APPEAL]: [
    "The appeal was not resolved",
    "To resolve the appeal, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
  [TransactionTypes.RESOLVE_APPEAL]: [
    "There was a problem resolving the appeal",
    <ModalContent>Please retry your transaction</ModalContent>,
  ],
};

const transactionSuccessContent = {
  [TransactionTypes.RESOLVE_APPEAL]: [
    "The appeal was resolved",
    <ModalContent>
      Voters can now collect rewards from their votes on this challenge, if they are available.
    </ModalContent>,
  ],
};

const transactionStatusModalConfig = {
  transactionLabels,
  transactionSuccessContent,
  transactionRejectionContent,
  transactionErrorContent,
};

class AppealResolve extends React.Component<AppealDetailProps & InjectedTransactionStatusModalProps> {
  public render(): JSX.Element {
    const transactions = this.getTransactions();
    const appealGranted = this.props.appeal.appealGranted;
    return (
      <>
        <AppealResolveCard
          challengeID={this.props.challengeID.toString()}
          appealGranted={appealGranted}
          appealGrantedStatementURI={this.props.appeal.appealGrantedStatementURI}
          transactions={transactions}
          onMobileTransactionClick={this.props.onMobileTransactionClick}
          faqURL={links.FAQ_REGISTRY}
        />
      </>
    );
  }

  private getTransactions = (): any[] => {
    return [
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: TransactionTypes.RESOLVE_APPEAL,
          });
          return this.resolveAppeal();
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
  };

  private resolveAppeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return updateStatus(this.props.listingAddress);
  };
}

export default compose<React.ComponentClass<AppealDetailProps>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(AppealResolve);
