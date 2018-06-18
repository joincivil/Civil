import * as React from "react";
import styled from "styled-components";
import { TwoStepEthTransaction } from "@joincivil/core";
import { Button, InvertedButton, buttonSizes } from "./Button";
import { Modal } from "./Modal";
import {
  ProgressModalContentInProgress,
  ProgressModalContentSuccess,
  ProgressModalContentError,
} from "./ProgressModalContent";

export interface TransactionButtonState {
  name: string;
  error: string;
  step: number;
  disableButton: boolean;
}

export interface Transaction {
  transaction(): Promise<TwoStepEthTransaction<any> | void>;
  preTransaction?(): any;
  postTransaction?(result: any): any;
  handleTransactionError?(err: any): any;
}

export interface TransactionButtonProps {
  transactions: Transaction[];
  disabled?: boolean;
  size?: buttonSizes;
  style?: string | undefined;
  preExecuteTransactions?(): any;
  postExecuteTransactions?(): any;
}

export enum progressModalStates {
  IN_PROGRESS = "IN_PROGRESS",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

export interface TransactionButtonModalContentComponentsProps {
  [index: string]: JSX.Element | undefined;
  [progressModalStates.IN_PROGRESS]?: JSX.Element | undefined;
  [progressModalStates.SUCCESS]?: JSX.Element | undefined;
  [progressModalStates.ERROR]?: JSX.Element | undefined;
}

export interface TransactionButtonModalProps {
  modalComponent?: JSX.Element | undefined;
  modalContentComponents?: TransactionButtonModalContentComponentsProps | undefined;
}

export interface TransitionButtonModalState {
  isProgressModalVisible: boolean;
  progressModalState?: string;
}

const DEFAULT_MODAL_COMPONENTS: TransactionButtonModalContentComponentsProps = {
  [progressModalStates.IN_PROGRESS]: <ProgressModalContentInProgress />,
  [progressModalStates.SUCCESS]: <ProgressModalContentSuccess />,
  [progressModalStates.ERROR]: <ProgressModalContentError />,
};

export class TransactionButtonNoModal extends React.Component<TransactionButtonProps, TransactionButtonState> {
  constructor(props: TransactionButtonProps) {
    super(props);
    this.state = {
      name: "",
      error: "",
      step: 0,
      disableButton: !!props.disabled,
    };
  }

  public render(): JSX.Element {
    if (this.props.style && this.props.style === "inverted") {
      return (
        <>
          {this.state.error}
          <InvertedButton
            onClick={this.onClick}
            disabled={this.state.disableButton}
            size={this.props.size || buttonSizes.MEDIUM}
          >
            {this.state.step === 1 && "Waiting for Transaction..."}
            {this.state.step === 2 && "Transaction Processing..."}
            {this.state.step === 0 && this.props.children}
          </InvertedButton>
        </>
      );
    }
    return (
      <>
        {this.state.error}
        <Button onClick={this.onClick} disabled={this.state.disableButton} size={this.props.size || buttonSizes.MEDIUM}>
          {this.state.step === 1 && "Waiting for Transaction..."}
          {this.state.step === 2 && "Transaction Processing..."}
          {this.state.step === 0 && this.props.children}
        </Button>
      </>
    );
  }

  private onClick = async () => {
    if (this.props.preExecuteTransactions) {
      setImmediate(() => this.props.preExecuteTransactions!());
    }
    return this.executeTransactions(this.props.transactions.slice().reverse());
  };

  private executeTransactions = async (transactions: Transaction[]): Promise<any> => {
    const currTransaction = transactions.pop();
    if (currTransaction) {
      if (currTransaction.preTransaction) {
        setImmediate(() => currTransaction.preTransaction!());
      }
      try {
        this.setState({ step: 1, disableButton: true });
        const pending = await currTransaction.transaction();
        this.setState({ step: 2 });
        if (pending) {
          const receipt = await pending.awaitReceipt();
          if (!transactions.length) {
            this.setState({ step: 0, disableButton: false });
          }
          if (currTransaction.postTransaction) {
            setImmediate(() => currTransaction.postTransaction!(receipt));
          }
        }
        return this.executeTransactions(transactions);
      } catch (err) {
        if (currTransaction.handleTransactionError) {
          setImmediate(() => currTransaction.handleTransactionError!(err));
        }
      }
    } else if (this.props.postExecuteTransactions) {
      setImmediate(() => this.props.postExecuteTransactions!());
    }
  };
}

export class TransactionButton extends React.Component<
  TransactionButtonProps & TransactionButtonModalProps,
  TransitionButtonModalState
> {
  constructor(props: TransactionButtonProps & TransactionButtonModalProps) {
    super(props);
    this.state = {
      isProgressModalVisible: false,
    };
  }

  public render(): JSX.Element {
    const { modalComponent, modalContentComponents, transactions, ...other } = this.props;
    const progressModal = this.getProgressModalEl(modalComponent, modalContentComponents);
    const extendedTransactions = this.extendTransactionsErrorHandlers(transactions);
    return (
      <>
        <TransactionButtonNoModal
          preExecuteTransactions={this.showProgressModal}
          postExecuteTransactions={this.showProgressModalSuccess}
          transactions={extendedTransactions}
          {...other}
        />
        {progressModal}
      </>
    );
  }

  private extendTransactionsErrorHandlers = (transactions: Transaction[]): Transaction[] => {
    return transactions.map(transaction => {
      if (!transaction.handleTransactionError) {
        transaction.handleTransactionError = this.showProgressModalError;
      }
      return transaction;
    });
  };

  private getProgressModalEl = (
    modalComponent: JSX.Element | undefined,
    modalContentComponents: TransactionButtonModalContentComponentsProps | undefined,
  ): JSX.Element | undefined => {
    const modalContentSource =
      (modalContentComponents && modalContentComponents[this.state.progressModalState!]) ||
      DEFAULT_MODAL_COMPONENTS[this.state.progressModalState!];
    let modalContent: JSX.Element | undefined;
    if (modalContentSource) {
      modalContent = React.cloneElement(modalContentSource as React.ReactElement<any>, {
        hideModal: this.hideProgressModal,
      });
    }
    if (modalComponent) {
      return React.cloneElement(
        modalComponent as React.ReactElement<any>,
        {
          visible: this.state.isProgressModalVisible,
        },
        modalContent,
      );
    }
    return (
      <Modal visible={this.state.isProgressModalVisible} textAlign="center">
        {modalContent}
      </Modal>
    );
  };

  private showProgressModalSuccess = (): void => {
    this.setState({ progressModalState: progressModalStates.SUCCESS });
  };

  private showProgressModalError = (): void => {
    this.setState({ progressModalState: progressModalStates.ERROR });
  };

  private showProgressModal = (): void => {
    this.setState({ isProgressModalVisible: true, progressModalState: progressModalStates.IN_PROGRESS });
  };

  private hideProgressModal = (): void => {
    this.setState({ isProgressModalVisible: false });
  };
}
