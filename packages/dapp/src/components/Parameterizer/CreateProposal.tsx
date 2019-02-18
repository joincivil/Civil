import * as React from "react";
import { compose } from "redux";
import { BigNumber } from "bignumber.js";

import { TwoStepEthTransaction, TxHash } from "@joincivil/core";
import {
  CreateProposal as CreateProposalComponent,
  CreateProposalProps as CreateProposalComponentProps,
  ModalContent,
  ModalUnorderedList,
  ModalListItem,
} from "@joincivil/components";

import { approveForProposeReparameterization, proposeReparameterization } from "../../apis/civilTCR";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../utility/TransactionStatusModalsHOC";

import { amountParams } from "./constants";

export interface CreateProposalProps extends CreateProposalComponentProps {
  createProposalParameterName: string;
}

enum TransactionTypes {
  APPROVE_FOR_REPARAMETERIZATION = "APPROVE_FOR_REPARAMETERIZATION",
  PROPOSE_REPARAMETERIZATION = "PROPOSE_REPARAMETERIZATION",
}

const transactionLabels = {
  [TransactionTypes.APPROVE_FOR_REPARAMETERIZATION]: "Approve For New Parameterizer Proposal",
  [TransactionTypes.PROPOSE_REPARAMETERIZATION]: "Propose New Parameter Value",
};

const multiStepTransactionLabels = {
  [TransactionTypes.APPROVE_FOR_REPARAMETERIZATION]: "1 of 2",
  [TransactionTypes.PROPOSE_REPARAMETERIZATION]: "2 of 2",
};

const transactionSuccessContent = {
  [TransactionTypes.APPROVE_FOR_REPARAMETERIZATION]: [undefined, undefined],
  [TransactionTypes.PROPOSE_REPARAMETERIZATION]: [
    "Your proposal was submitted!",
    <>
      <ModalContent />
    </>,
  ],
};

const transactionRejectionContent = {
  [TransactionTypes.APPROVE_FOR_REPARAMETERIZATION]: [
    "There was a problem with your proposal",
    "Before propossing a new value, you need to confirm the approval of your proposal token deposit in your MetaMask wallet.",
  ],
  [TransactionTypes.PROPOSE_REPARAMETERIZATION]: [
    "Your proposal was not submitted",
    "To submit a proposal, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
  [TransactionTypes.APPROVE_FOR_REPARAMETERIZATION]: [
    "There was a problem with your proposal",
    <>
      <ModalContent>Please check the following and retry your transaction</ModalContent>
      <ModalUnorderedList>
        <ModalListItem>You have sufficient CVL in your account for the Parameter Proposal Deposit</ModalListItem>
      </ModalUnorderedList>
    </>,
  ],
  [TransactionTypes.PROPOSE_REPARAMETERIZATION]: [
    "The was an problem with submitting your proposal",
    <>
      <ModalContent>Please retry your transaction</ModalContent>
    </>,
  ],
};

const transactionStatusModalConfig = {
  transactionLabels,
  multiStepTransactionLabels,
  transactionSuccessContent,
  transactionRejectionContent,
  transactionErrorContent,
};

class CreateProposal extends React.Component<CreateProposalProps & InjectedTransactionStatusModalProps> {
  public componentWillMount(): void {
    this.props.setTransactions(this.getTransactions());
    this.props.setHandleTransactionSuccessButtonClick(this.props.handleClose);
  }

  public render(): JSX.Element {
    const createProposalProps = {
      ...this.props,
      transactions: this.getTransactions(),
      postExecuteTransactions: this.onProposeReparameterizationSuccess,
    };

    return <CreateProposalComponent {...createProposalProps} />;
  }

  private getTransactions = (): any[] => {
    return [
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            isTransactionErrorModalOpen: false,
            isTransactionRejectionModalOpen: false,
            transactionType: TransactionTypes.APPROVE_FOR_REPARAMETERIZATION,
          });
          return approveForProposeReparameterization();
        },
        handleTransactionHash: (txHash: TxHash) => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: true,
          });
        },
        handleTransactionError: this.props.handleTransactionError,
      },
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: TransactionTypes.PROPOSE_REPARAMETERIZATION,
          });
          return this.proposeReparameterization();
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

  private onProposeReparameterizationSuccess = (): void => {
    this.props.updateTransactionStatusModalsState({
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: true,
    });
    this.props.handleClose();
  };

  private proposeReparameterization = async (): Promise<TwoStepEthTransaction<any> | void> => {
    let newValue: BigNumber = new BigNumber(this.props.parameterProposalValue!);
    if (amountParams.includes(this.props.createProposalParameterName!)) {
      newValue = newValue.mul(1e18);
    }
    return proposeReparameterization(this.props.createProposalParameterName!, newValue);
  };
}

export default compose<React.ComponentClass<CreateProposalProps>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(CreateProposal);
