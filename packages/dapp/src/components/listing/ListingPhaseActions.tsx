import * as React from "react";
import { compose } from "redux";
import { updateStatus } from "../../apis/civilTCR";
import { ListingWrapper, TwoStepEthTransaction, TxHash } from "@joincivil/core";
import ChallengeDetailContainer from "./ChallengeDetail";
import { ChallengeResolve } from "./ChallengeResolve";
import {
  Button,
  buttonSizes,
  InApplicationCard,
  InApplicationResolveCard,
  MetaMaskModal,
  Modal,
  ModalHeading,
  ModalContent,
  ModalStepLabel,
  ProgressModalContentError,
  ProgressModalContentInProgress,
  RejectedCard as RejectedCardComponent,
} from "@joincivil/components";
import { ListingContainerProps, connectLatestChallengeSucceededResults } from "../utility/HigherOrderComponents";
import WhitelistedDetail from "./WhitelistedDetail";

export interface ListingPhaseActionsProps {
  listing: ListingWrapper;
  expiry?: number;
  parameters: any;
  govtParameters: any;
  constitutionURI?: string;
  listingPhaseState: any;
}

enum TransactionTypes {
  UPDATE_LISTING,
}

export interface TransactionsProgressModalPropsState {
  isWaitingTransactionModalOpen?: boolean;
  isTransactionProgressModalOpen?: boolean;
  isTransactionSuccessModalOpen?: boolean;
  isTransactionErrorModalOpen?: boolean;
  isTransactionRejectionModalOpen?: boolean;
  transactionType?: number;
  transactions?: any[];
  cancelTransaction?(): void;
}

class ListingPhaseActions extends React.Component<ListingPhaseActionsProps, TransactionsProgressModalPropsState> {
  constructor(props: any) {
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
    const listing = this.props.listing;
    const {
      isInApplication,
      isWhitelisted,
      isRejected,
      canBeWhitelisted,
      canResolveChallenge,
    } = this.props.listingPhaseState;
    const challenge = this.props.listing.data.challenge;
    return (
      <>
        {isWhitelisted && (!challenge || challenge.resolved) && this.renderApplicationWhitelisted()}
        {isRejected && (!challenge || challenge.resolved) && this.renderRejected()}
        {isInApplication && this.renderApplicationPhase()}
        {listing.data && (
          <>
            {canBeWhitelisted && this.renderCanWhitelist()}
            {canResolveChallenge && this.renderCanResolve()}

            {listing.data.challenge &&
              !listing.data.challenge.resolved &&
              !canResolveChallenge && (
                <ChallengeDetailContainer
                  challengeID={this.props.listing.data.challengeID}
                  listingAddress={this.props.listing.address}
                  challengeData={{
                    listingAddress: this.props.listing.address,
                    challengeID: this.props.listing.data.challengeID,
                    challenge: this.props.listing.data.challenge!,
                  }}
                />
              )}
          </>
        )}
      </>
    );
  }

  private renderCanWhitelist = (): JSX.Element => {
    const transactions = [
      {
        transaction: async () => {
          this.setState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: TransactionTypes.UPDATE_LISTING,
          });
          return this.update();
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
        <InApplicationResolveCard transactions={transactions} />
        {this.renderAwaitingTransactionModal()}
        {this.renderTransactionProgressModal()}
        {this.renderTransactionSuccessModal()}
        {this.renderTransactionErrorModal()}
        {this.renderTransactionRejectionModal(transactions, this.cancelTransaction)}
      </>
    );
  };

  private renderCanResolve(): JSX.Element {
    return (
      <ChallengeResolve listingAddress={this.props.listing.address} challengeID={this.props.listing.data.challengeID} />
    );
  }

  private renderApplicationWhitelisted(): JSX.Element {
    return (
      <>
        <WhitelistedDetail listingAddress={this.props.listing.address} constitutionURI={this.props.constitutionURI} />
      </>
    );
  }

  private renderRejected(): JSX.Element {
    const RejectedCard = compose<React.ComponentClass<ListingContainerProps & {}>>(
      connectLatestChallengeSucceededResults,
    )(RejectedCardComponent);

    return <RejectedCard listingAddress={this.props.listing.address} />;
  }

  private renderTransactionSuccessModal(): JSX.Element | null {
    if (!this.state.isTransactionSuccessModalOpen) {
      return null;
    }
    return (
      <Modal>
        <ModalHeading>
          <strong>
            Success!<br />Thanks for adding this newsroom to the registry.
          </strong>
        </ModalHeading>
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
    const transactionLabel = "Add to Registry";
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
    const transactionLabel = "Add to Registry";
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

    const message = "The listing was not added to the Civil Registry";
    const denialMessage =
      "To add this listing to the registry, you need to confirm the transaction in your MetaMask wallet.";

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

  private renderTransactionErrorModal(): JSX.Element | null {
    if (!this.state.isTransactionErrorModalOpen) {
      return null;
    }

    return (
      <ProgressModalContentError hideModal={() => this.cancelTransaction()}>
        <ModalHeading>The was an problem with adding this lisitingd</ModalHeading>
        <ModalContent>Please retry your transaction</ModalContent>
      </ProgressModalContentError>
    );
  }

  private cancelTransaction = (): void => {
    this.setState({
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: false,
      isTransactionErrorModalOpen: false,
      isTransactionRejectionModalOpen: false,
    });
  };

  private handleTransactionError = (err: Error) => {
    const isErrorUserRejection = err.message === "Error: MetaMask Tx Signature: User denied transaction signature.";
    this.setState(() => ({
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: false,
      isTransactionErrorModalOpen: !isErrorUserRejection,
      isTransactionRejectionModalOpen: isErrorUserRejection,
    }));
  };

  private closeAllModals = (): void => {
    this.setState({
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: false,
      isTransactionRejectionModalOpen: false,
      transactionType: undefined,
    });
  };

  private renderApplicationPhase(): JSX.Element | null {
    const endTime = this.props.listing!.data.appExpiry.toNumber();
    const phaseLength = this.props.parameters.applyStageLen;
    if (!endTime || !phaseLength) {
      return null;
    }
    const submitChallengeURI = `/listing/${this.props.listing.address}/submit-challenge`;

    return (
      <>
        <InApplicationCard
          endTime={endTime}
          phaseLength={phaseLength}
          submitChallengeURI={submitChallengeURI}
          constitutionURI={this.props.constitutionURI}
        />
      </>
    );
  }

  // Transactions
  private update = async (): Promise<TwoStepEthTransaction<any>> => {
    return updateStatus(this.props.listing.address);
  };
}

export default ListingPhaseActions;
