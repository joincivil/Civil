import * as React from "react";
import { compose } from "redux";
import { EthAddress, TwoStepEthTransaction, TxHash } from "@joincivil/core";
import {
  Button,
  buttonSizes,
  ListingDetailPhaseCardComponentProps,
  ChallengeResolveCard as ChallengeResolveCardComponent,
  MetaMaskModal,
  Modal,
  ModalHeading,
  ModalContent,
  ModalStepLabel,
  ProgressModalContentInProgress,
} from "@joincivil/components";

import { updateStatus } from "../../apis/civilTCR";
import {
  ChallengeContainerProps,
  connectChallengeResults,
  connectChallengePhase,
} from "../utility/HigherOrderComponents";

export interface ChallengeResolveProps extends ChallengeContainerProps {
  listingAddress: EthAddress;
}

export interface ChallengeResolveProgressModalPropsState {
  isWaitingTransactionModalOpen?: boolean;
  isTransactionProgressModalOpen?: boolean;
  isTransactionSuccessModalOpen?: boolean;
  isTransactionRejectionModalOpen?: boolean;
  transactionIndex?: number;
  transactions?: any[];
  cancelTransaction?(): void;
}

const ChallengeResolveCard = compose(connectChallengePhase, connectChallengeResults)(
  ChallengeResolveCardComponent,
) as React.ComponentClass<ChallengeResolveProps & ListingDetailPhaseCardComponentProps>;

// A container for the Challenge Resolve Card component
export class ChallengeResolve extends React.Component<ChallengeResolveProps, ChallengeResolveProgressModalPropsState> {
  constructor(props: ChallengeResolveProps) {
    super(props);
    this.state = {
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: false,
      isTransactionRejectionModalOpen: false,
      transactionIndex: -1,
    };
  }

  public render(): JSX.Element | null {
    const transactions = [
      {
        transaction: async () => {
          this.setState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionIndex: 0,
          });
          return this.resolve();
        },
        handleTransactionHash: (txHash: TxHash) => {
          this.setState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: true,
          });
        },
        postTransaction: () => {
          this.setState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: true,
          });
        },
        handleTransactionError: this.handleTransactionError,
      },
    ];

    return (
      <>
        <ChallengeResolveCard
          listingAddress={this.props.listingAddress}
          challengeID={this.props.challengeID}
          transactions={transactions}
        />
        {this.renderAwaitingTransactionModal()}
        {this.renderTransactionProgressModal()}
        {this.renderRevealVoteSuccess()}
        {this.renderTransactionRejectionModal(transactions, this.cancelTransaction)}
      </>
    );
  }

  private renderRevealVoteSuccess(): JSX.Element | null {
    if (!this.state.isTransactionSuccessModalOpen) {
      return null;
    }
    return (
      <Modal>
        <ModalHeading>
          <strong>
            Success!<br />Thanks for resolving this challenge.
          </strong>
        </ModalHeading>
        <ModalContent>
          Voters can now collect rewards from their votes on this challenge, if they are available.
        </ModalContent>
        <Button size={buttonSizes.MEDIUM} onClick={this.closeAllModals}>
          Ok, got it
        </Button>
      </Modal>
    );
  }

  private renderAwaitingTransactionModal(): JSX.Element | null {
    if (!this.state.isWaitingTransactionModalOpen) {
      return null;
    }
    const transactionLabel = "Resolve Challenge";
    const stepLabelText = `Step 1 of 1 - ${transactionLabel}`;
    return (
      <MetaMaskModal waiting={true}>
        <ModalStepLabel>{stepLabelText}</ModalStepLabel>
        <ModalHeading>Waiting for you to confirm in MetaMask</ModalHeading>
      </MetaMaskModal>
    );
  }

  private renderTransactionProgressModal(): JSX.Element | null {
    if (!this.state.isTransactionProgressModalOpen) {
      return null;
    }
    const transactionLabel = "Resolve Challenge";
    const stepLabelText = `Step 1 of 1 - ${transactionLabel}`;
    return (
      <Modal>
        <ProgressModalContentInProgress>
          <ModalStepLabel>{stepLabelText}</ModalStepLabel>
          <ModalHeading>{transactionLabel}</ModalHeading>
        </ProgressModalContentInProgress>
      </Modal>
    );
  }

  private renderTransactionRejectionModal(transactions: any[], cancelTransaction: () => void): JSX.Element | null {
    if (!this.state.isTransactionRejectionModalOpen) {
      return null;
    }

    const message = "The challenge was not resolved";
    const denialMessage = "To resolve the challenge, you need to confirm the transaction in your MetaMask wallet.";

    return (
      <MetaMaskModal
        waiting={false}
        denied={true}
        denialText={denialMessage}
        cancelTransaction={cancelTransaction}
        denialRestartTransactions={transactions}
      >
        <ModalHeading>{message}</ModalHeading>
      </MetaMaskModal>
    );
  }

  private cancelTransaction = (): void => {
    this.setState({
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: false,
      isTransactionRejectionModalOpen: false,
    });
  };

  private handleTransactionError = (err: Error) => {
    const isErrorUserRejection = err.message === "Error: MetaMask Tx Signature: User denied transaction signature.";
    this.setState(() => ({
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: false,
      isTransactionRejectionModalOpen: isErrorUserRejection,
    }));
  };

  private closeAllModals = (): void => {
    this.setState({
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: false,
      isTransactionRejectionModalOpen: false,
      transactionIndex: -1,
    });
  };

  private resolve = async (): Promise<TwoStepEthTransaction<any>> => {
    return updateStatus(this.props.listingAddress);
  };
}
