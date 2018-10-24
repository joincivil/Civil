import * as React from "react";
import { compose } from "redux";
import { updateStatus } from "../../apis/civilTCR";
import { EthAddress, TwoStepEthTransaction, TxHash } from "@joincivil/core";
import { InApplicationResolveCard, ModalContent } from "@joincivil/components";

import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../utility/TransactionStatusModalsHOC";

export interface ApplicationUpdateStatusProps {
  listingAddress: EthAddress;
}

enum TransactionTypes {
  UPDATE_LISTING = "UPDATE_LISTING",
}

const transactionLabels = {
  [TransactionTypes.UPDATE_LISTING]: "Add to Registry",
};

const transactionSuccessContent = {
  [TransactionTypes.UPDATE_LISTING]: ["Thanks for adding this newsroom to the registry.", <></>],
};

const transactionRejectionContent = {
  [TransactionTypes.UPDATE_LISTING]: [
    "The listing was not added to the Civil Registry",
    "To add this listing to the registry, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
  [TransactionTypes.UPDATE_LISTING]: [
    "The was an problem with adding this listing",
    <ModalContent>Please retry your transaction</ModalContent>,
  ],
};

const transactionStatusModalConfig = {
  transactionLabels,
  transactionSuccessContent,
  transactionRejectionContent,
  transactionErrorContent,
};

class ApplicationUpdateStatus extends React.Component<
  ApplicationUpdateStatusProps & InjectedTransactionStatusModalProps
> {
  public componentDidMount(): void {
    this.props.setTransactions(this.getTransactions());
  }

  public render(): JSX.Element {
    return <InApplicationResolveCard transactions={this.getTransactions()} />;
  }

  // Transactions
  private getTransactions = (): any[] => {
    return [
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: TransactionTypes.UPDATE_LISTING,
          });
          return this.update();
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

  private update = async (): Promise<TwoStepEthTransaction<any>> => {
    return updateStatus(this.props.listingAddress);
  };
}

export default compose<React.ComponentClass<ApplicationUpdateStatusProps>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(ApplicationUpdateStatus);
