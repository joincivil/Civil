import * as React from "react";
import {
  Button,
  buttonSizes,
  MetaMaskModal,
  Modal,
  ModalContentInsetContainer,
  ModalHeading,
  ModalStepLabel,
  ProgressModalContentError,
  ProgressModalContentInProgress,
} from "@joincivil/components";

export interface InjectedTransactionStatusModalProps {
  setTransactions(transactions: any[]): void;
  setHandleTransactionSuccessButtonClick(handleTransactionSuccessButtonClick: () => void): void;
  setCancelTransaction(cancelTransaction: () => void): void;
  setTransactionStatusModalConfig(newConfig: TransactionStatusModalsConfigProps): void;
  updateTransactionStatusModalsState(newState: TransactionStatusModalState): void;
  handleTransactionError(err: Error): void;
  closeAllModals(): void;
}

export interface TransactionStatusModalState {
  isWaitingTransactionModalOpen?: boolean;
  isTransactionProgressModalOpen?: boolean;
  isTransactionSuccessModalOpen?: boolean;
  isTransactionErrorModalOpen?: boolean;
  isTransactionRejectionModalOpen?: boolean;
  isIPFSUploadModalOpen?: boolean;
  transactionType?: number | string;
}

export type TransactionStatusModalContent = string | JSX.Element | undefined;

export interface TransactionStatusModalContentMap {
  [index: string]: Array<string | JSX.Element | undefined>;
}

export interface TransactionStatusModalsConfigProps {
  transactionLabels?: { [index: string]: string };
  multiStepTransactionLabels?: { [index: string]: string };
  transactionSuccessContent?: TransactionStatusModalContentMap;
  transactionRejectionContent?: TransactionStatusModalContentMap;
  transactionErrorContent?: TransactionStatusModalContentMap;
}

export const hasTransactionStatusModals = (transactionStatusModalConfig: TransactionStatusModalsConfigProps) => <
  TOriginalProps extends {}
>(
  WrappedComponent: React.ComponentType<TOriginalProps & InjectedTransactionStatusModalProps>,
) => {
  return class ComponentWithTransactionStatusModals extends React.Component<
    TOriginalProps & InjectedTransactionStatusModalProps,
    TransactionStatusModalState
  > {
    public transactionStatusModalConfig: TransactionStatusModalsConfigProps;
    public transactions: any[];
    public cancelTransaction: () => void;
    public handleTransactionSuccessButtonClick: () => void;

    constructor(props: TOriginalProps & InjectedTransactionStatusModalProps) {
      super(props);
      this.transactionStatusModalConfig = transactionStatusModalConfig;
      this.state = {
        isWaitingTransactionModalOpen: false,
        isTransactionProgressModalOpen: false,
        isTransactionSuccessModalOpen: false,
        isTransactionErrorModalOpen: false,
        isTransactionRejectionModalOpen: false,
        transactionType: undefined,
      };
    }

    public render(): JSX.Element {
      const cancelTransaction = this.cancelTransaction
        ? this.cancelTransaction
        : () => {
            this.closeAllModals();
          };
      return (
        <>
          <WrappedComponent
            setTransactions={this.setTransactions}
            setCancelTransaction={this.setCancelTransaction}
            setTransactionStatusModalConfig={this.setTransactionStatusModalConfig}
            setHandleTransactionSuccessButtonClick={this.setHandleTransactionSuccessButtonClick}
            updateTransactionStatusModalsState={(newState: TransactionStatusModalState) =>
              this.updateTransactionStatusModalsState(newState)
            }
            handleTransactionError={(err: Error) => this.handleTransactionError(err)}
            closeAllModals={this.closeAllModals}
            {...this.props}
          />
          {this.renderAwaitingTransactionModal()}
          {this.renderTransactionProgressModal()}
          {this.renderIPFSUploadProgressModal()}
          {this.renderTransactionSuccessModal()}
          {this.renderTransactionErrorModal()}
          {this.renderTransactionRejectionModal(this.transactions, cancelTransaction)}
        </>
      );
    }

    public updateTransactionStatusModalsState = (newState: TransactionStatusModalState) => {
      this.setState(newState);
    };

    public renderTransactionSuccessModal(): JSX.Element | null {
      if (!this.state.isTransactionSuccessModalOpen) {
        return null;
      }
      const { transactionSuccessContent } = this.transactionStatusModalConfig;
      const successContent = transactionSuccessContent![this.state.transactionType!];
      const onClick = this.handleTransactionSuccessButtonClick || this.closeAllModals;

      return (
        <Modal width={558} textAlign="center">
          <ModalHeading>{successContent[0]}</ModalHeading>
          <ModalContentInsetContainer>{successContent[1]}</ModalContentInsetContainer>
          <Button size={buttonSizes.MEDIUM} onClick={onClick}>
            Ok, got it
          </Button>
        </Modal>
      );
    }

    public renderAwaitingTransactionModal(): JSX.Element | null {
      if (!this.state.isWaitingTransactionModalOpen) {
        return null;
      }
      const { transactionLabels, multiStepTransactionLabels } = this.transactionStatusModalConfig;

      const transactionLabel = transactionLabels![this.state.transactionType!];
      const stepLabelText =
        (multiStepTransactionLabels && multiStepTransactionLabels[this.state.transactionType!]) || "1 of 1";
      const stepLabel = `Step ${stepLabelText} - ${transactionLabel}`;
      return (
        <MetaMaskModal waiting={true}>
          <ModalStepLabel>{stepLabel}</ModalStepLabel>
          <ModalHeading>Waiting for you to confirm in MetaMask</ModalHeading>
        </MetaMaskModal>
      );
    }

    public renderIPFSUploadProgressModal(): JSX.Element | null {
      if (!this.state.isIPFSUploadModalOpen) {
        return null;
      }
      const { transactionLabels, multiStepTransactionLabels } = this.transactionStatusModalConfig;
      const transactionLabel = transactionLabels![this.state.transactionType!];
      const stepLabelText =
        (multiStepTransactionLabels && multiStepTransactionLabels[this.state.transactionType!]) || "1 of 1";
      const stepLabel = `Step ${stepLabelText} - ${transactionLabel}`;
      return (
        <MetaMaskModal ipfsPost={true} waiting={true}>
          <ModalStepLabel>{stepLabel}</ModalStepLabel>
          <ModalHeading>Waiting for you to confirm in MetaMask</ModalHeading>
        </MetaMaskModal>
      );
    }

    public renderTransactionProgressModal(): JSX.Element | null {
      if (!this.state.isTransactionProgressModalOpen) {
        return null;
      }
      const { transactionLabels, multiStepTransactionLabels } = this.transactionStatusModalConfig;
      const transactionLabel = transactionLabels![this.state.transactionType!];
      const stepLabelText =
        (multiStepTransactionLabels && multiStepTransactionLabels[this.state.transactionType!]) || "1 of 1";
      const stepLabel = `Step ${stepLabelText} - ${transactionLabel}`;
      return (
        <Modal width={558} textAlign="center">
          <ProgressModalContentInProgress>
            <ModalStepLabel>{stepLabel}</ModalStepLabel>
            <ModalHeading>{transactionLabel}</ModalHeading>
          </ProgressModalContentInProgress>
        </Modal>
      );
    }

    public renderTransactionRejectionModal(
      transactions: any[],
      cancelTransaction: (() => void) | undefined,
    ): JSX.Element | null {
      if (!this.state.isTransactionRejectionModalOpen) {
        return null;
      }

      const { transactionRejectionContent } = this.transactionStatusModalConfig;
      const denialContent = transactionRejectionContent![this.state.transactionType!];

      return (
        <MetaMaskModal
          waiting={false}
          denied={true}
          denialText={denialContent[1] as string}
          cancelTransaction={cancelTransaction}
          denialRestartTransactions={this.transactions}
        >
          <ModalHeading>{denialContent[0]}</ModalHeading>
        </MetaMaskModal>
      );
    }

    public renderTransactionErrorModal(): JSX.Element | null {
      if (!this.state.isTransactionErrorModalOpen) {
        return null;
      }

      const { transactionErrorContent } = this.transactionStatusModalConfig;

      const message = transactionErrorContent![this.state.transactionType!];

      return (
        <Modal width={558} textAlign="center">
          <ProgressModalContentError hideModal={() => this.closeAllModals()}>
            <ModalHeading>{message[0]}</ModalHeading>
            {message[1]}
          </ProgressModalContentError>
        </Modal>
      );
    }

    public closeAllModals = (): void => {
      this.setState({
        isWaitingTransactionModalOpen: false,
        isTransactionProgressModalOpen: false,
        isTransactionSuccessModalOpen: false,
        isTransactionErrorModalOpen: false,
        isTransactionRejectionModalOpen: false,
      });
    };

    public handleTransactionError = (err: Error) => {
      const isErrorUserRejection = err.message === "Error: MetaMask Tx Signature: User denied transaction signature.";
      this.setState(() => ({
        isWaitingTransactionModalOpen: false,
        isTransactionProgressModalOpen: false,
        isTransactionSuccessModalOpen: false,
        isTransactionErrorModalOpen: !isErrorUserRejection,
        isTransactionRejectionModalOpen: isErrorUserRejection,
      }));
    };

    public setTransactions = (transactions: any[]): void => {
      this.transactions = transactions;
    };

    public setCancelTransaction = (cancelTransaction: () => void): void => {
      this.cancelTransaction = cancelTransaction;
    };

    public setHandleTransactionSuccessButtonClick = (handleTransactionSuccessButtonClick: () => void): void => {
      this.handleTransactionSuccessButtonClick = handleTransactionSuccessButtonClick;
    };

    public setTransactionStatusModalConfig = (newConfig: TransactionStatusModalsConfigProps): void => {
      this.transactionStatusModalConfig = {
        ...this.transactionStatusModalConfig,
        ...newConfig,
      };
    };
  };
};
