import * as React from "react";
import { compose } from "redux";
import { TwoStepEthTransaction, TxHash } from "@joincivil/core";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { AppealResolveCard, ModalContent } from "@joincivil/components";

import { updateStatus } from "../../apis/civilTCR";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../utility/TransactionStatusModalsHOC";

import { AppealDetailProps } from "./AppealDetail";

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
      <>
        <AppealResolveCard
          challengeID={this.props.challengeID.toString()}
          challenger={challenge!.challenger.toString()}
          rewardPool={getFormattedTokenBalance(challenge!.rewardPool)}
          stake={getFormattedTokenBalance(challenge!.stake)}
          totalVotes={getFormattedTokenBalance(totalVotes)}
          votesFor={votesFor}
          votesAgainst={votesAgainst}
          percentFor={percentFor.toString()}
          percentAgainst={percentAgainst.toString()}
          appealGranted={appealGranted}
          transactions={transactions}
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
