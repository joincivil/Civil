import * as React from "react";
import { compose } from "redux";
import { BigNumber } from "bignumber.js";

import { TwoStepEthTransaction, TxHash } from "@joincivil/core";
import {
  CreateGovtProposal as CreateGovtProposalComponent,
  CreateGovtProposalProps as CreateProposalComponentProps,
  ModalContent,
} from "@joincivil/components";

import { updateGovernmentParameter } from "../../apis/civilTCR";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../utility/TransactionStatusModalsHOC";

import { amountParams } from "./constants";

export interface CreateGovtProposalProps extends CreateProposalComponentProps {
  createProposalParameterName: string;
}

enum TransactionTypes {
  PROPOSE_REPARAMETERIZATION = "PROPOSE_REPARAMETERIZATION",
}

const transactionLabels = {
  [TransactionTypes.PROPOSE_REPARAMETERIZATION]: "Propose New Govt Parameter Value",
};

const multiStepTransactionLabels = {
  [TransactionTypes.PROPOSE_REPARAMETERIZATION]: "1 of 1",
};

const transactionSuccessContent = {
  [TransactionTypes.PROPOSE_REPARAMETERIZATION]: [
    "Your proposal was submitted!",
    <>
      <ModalContent />
    </>,
  ],
};

const transactionRejectionContent = {
  [TransactionTypes.PROPOSE_REPARAMETERIZATION]: [
    "Your proposal was not submitted",
    "To submit a proposal, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
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

class CreateGovtProposal extends React.Component<CreateGovtProposalProps & InjectedTransactionStatusModalProps> {
  public componentWillMount(): void {
    this.props.setTransactions(this.getTransactions());
    this.props.setHandleTransactionSuccessButtonClick(this.props.handleClose);
  }

  public render(): JSX.Element {
    console.log("Create Govt Proposal");
    const createProposalProps = {
      ...this.props,
      transactions: this.getTransactions(),
      postExecuteTransactions: this.onProposeReparameterizationSuccess,
    };

    return <CreateGovtProposalComponent {...createProposalProps} />;
  }

  private getTransactions = (): any[] => {
    return [
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
    return updateGovernmentParameter(this.props.createProposalParameterName!, newValue);
  };
}

export default compose<React.ComponentClass<CreateGovtProposalProps>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(CreateGovtProposal);
