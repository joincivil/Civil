import * as React from "react";
import { compose } from "redux";

import { TwoStepEthTransaction, TxHash } from "@joincivil/core";
import {
  ProcessProposal as ProcessProposalComponent,
  ProcessProposalProps as ProcessProposalComponentProps,
  ModalContent,
} from "@joincivil/components";

import { updateReparameterizationProp } from "../../apis/civilTCR";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../utility/TransactionStatusModalsHOC";

export interface ProcessProposalProps extends ProcessProposalComponentProps {
  challengeProposalID: number;
}

enum TransactionTypes {
  PROCESS_PROPOSAL = "PROCESS_PROPOSAL",
}

const transactionLabels = {
  [TransactionTypes.PROCESS_PROPOSAL]: "Approve For Proposal Challenge",
};

const transactionSuccessContent = {
  [TransactionTypes.PROCESS_PROPOSAL]: [
    "The proposal was successfully processed!",
    <>
      <ModalContent />
    </>,
  ],
};

const transactionRejectionContent = {
  [TransactionTypes.PROCESS_PROPOSAL]: [
    "The proposal was not processed",
    "To process a proposal, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
  [TransactionTypes.PROCESS_PROPOSAL]: [
    "The was an problem processing the proposal",
    <>
      <ModalContent>Please retry your transaction</ModalContent>
    </>,
  ],
};

const transactionStatusModalConfig = {
  transactionLabels,
  transactionSuccessContent,
  transactionRejectionContent,
  transactionErrorContent,
};

class ProcessProposal extends React.Component<ProcessProposalProps & InjectedTransactionStatusModalProps> {
  public componentWillMount(): void {
    this.props.setTransactions(this.getTransactions());
    this.props.setHandleTransactionSuccessButtonClick(this.props.handleClose);
  }

  public render(): JSX.Element {
    const challengeProposalProps = {
      ...this.props,
      transactions: this.getTransactions(),
      postExecuteTransactions: this.onProcessProposalSuccess,
    };

    return <ProcessProposalComponent {...challengeProposalProps} />;
  }

  private getTransactions = (): any[] => {
    return [
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: TransactionTypes.PROCESS_PROPOSAL,
          });
          return this.updateProposal();
        },
        handleTransactionHash: (txHash: TxHash) => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
          });
        },
        handleTransactionError: this.props.handleTransactionError,
      },
    ];
  };

  private onProcessProposalSuccess = (): void => {
    this.props.updateTransactionStatusModalsState({
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: true,
    });
    this.props.handleClose();
  };

  private updateProposal = async (): Promise<TwoStepEthTransaction<any> | void> => {
    return updateReparameterizationProp(this.props.challengeProposalID!.toString());
  };
}

export default compose<React.ComponentClass<ProcessProposalProps>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(ProcessProposal);
