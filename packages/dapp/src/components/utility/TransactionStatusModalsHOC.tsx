import * as React from "react";
import {
  Button,
  buttonSizes,
  MetaMaskModal,
  Modal,
  ModalHeading,
  ModalStepLabel,
  ProgressModalContentError,
  ProgressModalContentInProgress,
} from "@joincivil/components";

export interface TransactionStatusModalProps {
  transactions: any[];
  handleTransactionSuccessButtonClick?(): void;
  cancelTransaction?(): void;
}

export interface InjectedTransactionStatusModalProps {
  updateTransactionStatusModalsState(newState: TransactionStatusModalState): void;
  handleTransactionError(err: Error): void;
}

export interface TransactionStatusModalState {
  isWaitingTransactionModalOpen?: boolean;
  isTransactionProgressModalOpen?: boolean;
  isTransactionSuccessModalOpen?: boolean;
  isTransactionErrorModalOpen?: boolean;
  isTransactionRejectionModalOpen?: boolean;
  transactionType?: number | string;
}

export type TransactionStatusModalContent = string | JSX.Element | undefined;

export interface TransactionStatusModalContentMap {
  [index: string]: Array<string | JSX.Element | undefined>
}

export interface TransactionStatusModalsConfigProps {
  transactionLabels: { [index: string]: string };
  multiStepTransactionLabels?: { [index: string]: string };
  transactionSuccessContent: TransactionStatusModalContentMap;
  transactionRejectionContent: TransactionStatusModalContentMap;
  transactionErrorContent: TransactionStatusModalContentMap;
}

export const hasTransactionStatusModals = (transactionStatusModalConfig: TransactionStatusModalsConfigProps) => <
  TOriginalProps extends {}
>(
  WrappedComponent: React.ComponentType<
    TOriginalProps & TransactionStatusModalProps & InjectedTransactionStatusModalProps
  >,
) => {
  const {
    transactionLabels,
    multiStepTransactionLabels,
    transactionSuccessContent,
    transactionRejectionContent,
    transactionErrorContent,
  } = transactionStatusModalConfig;

  return class ComponentWithTransactionStatusModals extends React.Component<
    TOriginalProps & TransactionStatusModalProps & InjectedTransactionStatusModalProps,
    TransactionStatusModalState
  > {
    constructor(props: TOriginalProps & TransactionStatusModalProps & InjectedTransactionStatusModalProps) {
      super(props);
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
      const cancelTransaction = this.props.cancelTransaction ? this.props.cancelTransaction : (() => { this.closeAllModals() });
      return (
        <>
          <WrappedComponent
            updateTransactionStatusModalsState={(newState: TransactionStatusModalState) =>
              this.updateTransactionStatusModalsState(newState)
            }
            handleTransactionError={(err: Error) => this.handleTransactionError(err)}
            {...this.props}
          />
          {this.renderAwaitingTransactionModal()}
          {this.renderTransactionProgressModal()}
          {this.renderTransactionSuccessModal()}
          {this.renderTransactionErrorModal()}
          {this.renderTransactionRejectionModal(this.props.transactions, cancelTransaction)}
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

      const successContent = transactionSuccessContent[this.state.transactionType!];
      const onClick = this.props.handleTransactionSuccessButtonClick || this.closeAllModals;

      return (
        <Modal>
          <ModalHeading>
            <strong>
              Success!<br />
              {successContent[0]}
            </strong>
          </ModalHeading>
          {successContent[1]}
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
      const transactionLabel = transactionLabels[this.state.transactionType!];
      const stepLabelText = multiStepTransactionLabels && multiStepTransactionLabels[this.state.transactionType!] || "1 of 1";
      const stepLabel = `Step ${stepLabelText} - ${transactionLabel}`;
      return (
        <MetaMaskModal waiting={true}>
          <ModalStepLabel>{stepLabel}</ModalStepLabel>
          <ModalHeading>Waiting for you to confirm in MetaMask</ModalHeading>
        </MetaMaskModal>
      );
    }

    public renderTransactionProgressModal(): JSX.Element | null {
      if (!this.state.isTransactionProgressModalOpen) {
        return null;
      }
      const transactionLabel = transactionLabels[this.state.transactionType!];
      const stepLabelText = multiStepTransactionLabels && multiStepTransactionLabels[this.state.transactionType!] || "1 of 1";
      const stepLabel = `Step ${stepLabelText} - ${transactionLabel}`;
      return (
        <Modal>
          <ProgressModalContentInProgress>
            <ModalStepLabel>{stepLabel}</ModalStepLabel>
            <ModalHeading>{transactionLabel}</ModalHeading>
          </ProgressModalContentInProgress>
        </Modal>
      );
    }

    public renderTransactionRejectionModal(transactions: any[], cancelTransaction: (() => void) | undefined): JSX.Element | null {
      if (!this.state.isTransactionRejectionModalOpen) {
        return null;
      }

      const denialContent = transactionRejectionContent[this.state.transactionType!];

      return (
        <MetaMaskModal
          waiting={false}
          denied={true}
          denialText={denialContent[1] as string}
          cancelTransaction={cancelTransaction}
          denialRestartTransactions={this.props.transactions}
        >
          <ModalHeading>{denialContent[0]}</ModalHeading>
        </MetaMaskModal>
      );
    }

    public renderTransactionErrorModal(): JSX.Element | null {
      if (!this.state.isTransactionErrorModalOpen) {
        return null;
      }

      const message = transactionErrorContent[this.state.transactionType!];

      return (
        <ProgressModalContentError hideModal={() => this.closeAllModals()}>
          <ModalHeading>{message[0]}</ModalHeading>
          {message[1]}
        </ProgressModalContentError>
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
  };
};
