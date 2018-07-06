import * as React from "react";
import { TwoStepEthTransaction, TxHash } from "@joincivil/core";
import { Button, InvertedButton, DarkButton, buttonSizes } from "./Button";
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
  progressEventName?: string;
  modalContent?: JSX.Element;
  transaction(): Promise<TwoStepEthTransaction<any> | void>;
  preTransaction?(): any;
  postTransaction?(result: any): any;
  handleTransactionError?(err: any): any;
  handleTransactionHash?(txhash: TxHash): void;
}

export interface TransactionButtonProps {
  transactions: Transaction[];
  disabled?: boolean;
  size?: buttonSizes;
  style?: string;
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
  modalComponent?: JSX.Element;
  modalContentComponents?: any;
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

  public componentDidUpdate(prevProps: TransactionButtonProps): void {
    if (prevProps.disabled !== this.props.disabled) {
      this.setState({ disableButton: !!this.props.disabled });
    }
  }

  public render(): JSX.Element {
    let StyledButton;
    switch (this.props.style) {
      case "inverted":
        StyledButton = InvertedButton;
        break;
      case "dark":
        StyledButton = DarkButton;
        break;
      default:
        StyledButton = Button;
    }
    return (
      <>
        {this.state.error}
        <StyledButton
          onClick={this.onClick}
          disabled={this.state.disableButton}
          size={this.props.size || buttonSizes.MEDIUM}
        >
          {this.state.step === 1 && "Waiting for Transaction..."}
          {this.state.step === 2 && "Transaction Processing..."}
          {this.state.step === 0 && this.props.children}
        </StyledButton>
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

        if (currTransaction.handleTransactionHash && pending) {
          currTransaction.handleTransactionHash(pending.txHash);
        }

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
        this.setState({ step: 0, disableButton: false });

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
    const {
      modalComponent,
      modalContentComponents,
      transactions,
      preExecuteTransactions,
      postExecuteTransactions,
      ...other
    } = this.props;
    const progressModal = this.getProgressModalEl(modalComponent, modalContentComponents);
    const extendedTransactions = this.extendTransactionsHandlers(transactions);
    let extendedPreExecuteTransactions = this.showProgressModal;
    let extendedPostExecuteTransactions = this.showProgressModalSuccess;

    if (!!preExecuteTransactions) {
      extendedPreExecuteTransactions = (): void => {
        preExecuteTransactions();
        this.showProgressModal();
      };
    }
    if (!!postExecuteTransactions) {
      extendedPostExecuteTransactions = (): void => {
        postExecuteTransactions();
        this.showProgressModalSuccess();
      };
    }

    return (
      <>
        <TransactionButtonNoModal
          preExecuteTransactions={extendedPreExecuteTransactions}
          postExecuteTransactions={extendedPostExecuteTransactions}
          transactions={extendedTransactions}
          {...other}
        />
        {progressModal}
      </>
    );
  }

  private extendTransactionsHandlers = (transactions: Transaction[]): Transaction[] => {
    return transactions.map(transaction => {
      if (!transaction.handleTransactionError) {
        transaction.handleTransactionError = this.showProgressModalError;
      }
      if (transaction.progressEventName) {
        const preTransaction = transaction.preTransaction;
        transaction.preTransaction = () => {
          if (preTransaction) {
            preTransaction();
          }
          this.showProgressModal(transaction.progressEventName);
        };
      }
      return transaction;
    });
  };

  private getProgressModalEl = (
    modalComponent: JSX.Element | undefined,
    modalContentComponents?: any,
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

  private showProgressModal = (progressModalState: string = progressModalStates.IN_PROGRESS): void => {
    this.setState({ isProgressModalVisible: true, progressModalState });
  };

  private hideProgressModal = (): void => {
    this.setState({ isProgressModalVisible: false });
  };
}

export class TransactionDarkButton extends React.Component<
  TransactionButtonProps & TransactionButtonModalProps,
  TransitionButtonModalState
> {
  public render(): JSX.Element {
    const style = "dark";
    return <TransactionButton style={style} {...this.props} />;
  }
}

export class TransactionInvertedButton extends React.Component<
  TransactionButtonProps & TransactionButtonModalProps,
  TransitionButtonModalState
> {
  public render(): JSX.Element {
    const style = "inverted";
    return <TransactionButton style={style} {...this.props} />;
  }
}
