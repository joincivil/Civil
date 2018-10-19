import * as React from "react";
import { TwoStepEthTransaction, TxHash } from "@joincivil/core";
import { EthSignedMessage } from "@joincivil/typescript-types";
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

export interface TransactionButtonModalFlowState {
  modalOpen?: boolean;
  isPreTransactionModalOpen?: boolean;
  isWaitingTransactionModalOpen?: boolean;
  metaMaskRejectionModal?: boolean;
  completeModalOpen?: boolean;
  startTransaction?(): any;
  cancelTransaction?(): any;
}

export interface Transaction {
  progressEventName?: string;
  transaction(): Promise<TwoStepEthTransaction<any> | EthSignedMessage | void>;
  preTransaction?(): any;
  requireBeforeTransaction?(): Promise<any>;
  postTransaction?(result: any): any;
  handleTransactionError?(err: any): any;
  handleTransactionHash?(txhash?: TxHash): void;
}

export interface TransactionButtonProps {
  transactions: Transaction[];
  disabled?: boolean;
  Button?: React.StatelessComponent<TransactionButtonInnerProps>;
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
  modalContentComponents?: TransactionButtonModalContentComponentsProps;
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

export interface TransactionButtonInnerProps {
  disabled?: boolean;
  step?: number;
  children?: React.ReactNode | React.ReactNode[];
  onClick(event?: any): void;
}

export const PrimaryTransactionButton: React.StatelessComponent<TransactionButtonInnerProps> = (
  props: TransactionButtonInnerProps,
): JSX.Element => {
  return (
    <Button onClick={props.onClick} disabled={props.disabled} size={buttonSizes.MEDIUM}>
      {props.step === 1 && "Waiting for confirmation..."}
      {props.step === 2 && "Processing..."}
      {props.step === 0 && props.children}
    </Button>
  );
};

export const InvertedTransactionButton: React.StatelessComponent<TransactionButtonInnerProps> = (
  props: TransactionButtonInnerProps,
): JSX.Element => {
  return (
    <InvertedButton onClick={props.onClick} disabled={props.disabled} size={buttonSizes.MEDIUM}>
      {props.step === 1 && "Waiting for confirmation..."}
      {props.step === 2 && "Processing..."}
      {props.step === 0 && props.children}
    </InvertedButton>
  );
};

export const DarkTransactionButton: React.StatelessComponent<TransactionButtonInnerProps> = (
  props: TransactionButtonInnerProps,
): JSX.Element => {
  return (
    <DarkButton onClick={props.onClick} disabled={props.disabled} size={buttonSizes.MEDIUM}>
      {props.step === 1 && "Waiting for confirmation..."}
      {props.step === 2 && "Processing..."}
      {props.step === 0 && props.children}
    </DarkButton>
  );
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
    const ButtonComponent = this.props.Button || PrimaryTransactionButton;
    return (
      <>
        {this.state.error}
        <ButtonComponent step={this.state.step} onClick={this.onClick} disabled={this.state.disableButton}>
          {this.props.children}
        </ButtonComponent>
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
        if (currTransaction.requireBeforeTransaction) {
          await currTransaction.requireBeforeTransaction();
        }
        this.setState({ step: 1, disableButton: true });
        const pending = await currTransaction.transaction();
        this.setState({ step: 2 });

        if (currTransaction.handleTransactionHash && pending) {
          if ("txHash" in pending) {
            currTransaction.handleTransactionHash(pending.txHash);
          } else {
            currTransaction.handleTransactionHash();
          }
        }

        if (pending) {
          let receipt = pending;
          if ("awaitReceipt" in pending) {
            receipt = await pending.awaitReceipt();
          }

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
        this.showProgressModal();
        preExecuteTransactions();
      };
    }
    if (!!postExecuteTransactions) {
      extendedPostExecuteTransactions = (): void => {
        this.showProgressModalSuccess();
        postExecuteTransactions();
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
    return <TransactionButton Button={DarkTransactionButton} {...this.props} />;
  }
}

export class TransactionInvertedButton extends React.Component<
  TransactionButtonProps & TransactionButtonModalProps,
  TransitionButtonModalState
> {
  public render(): JSX.Element {
    return <TransactionButton Button={InvertedTransactionButton} {...this.props} />;
  }
}
