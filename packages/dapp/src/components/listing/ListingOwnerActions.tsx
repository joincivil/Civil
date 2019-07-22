import * as React from "react";
import { EthAddress, ListingWrapper, TwoStepEthTransaction, TxHash } from "@joincivil/core";
import { TransactionButton, CommitVoteSuccessIcon, ModalUnorderedList, ModalListItem } from "@joincivil/components";
import { exitListing, withdrawTokensFromMultisig } from "../../apis/civilTCR";
import { ViewModuleHeader } from "../utility/ViewModules";
import { hasTransactionStatusModals, InjectedTransactionStatusModalProps } from "../utility/TransactionStatusModalsHOC";
import { ModalContent } from "@joincivil/components/build/ReviewVote/styledComponents";
import { compose } from "redux";

export interface ListingOwnerActionsProps {
  listing: ListingWrapper;
}

export interface OwnerListingViewProps {
  listingAddress: EthAddress;
  listing: ListingWrapper;
}

enum TransactionTypes {
  EXIT_LISTING = "EXIT_LISTING",
  WITHDRAW_TOKENS = "WITHDRAW_TOKENS",
}

const transactionLabels = {
  [TransactionTypes.EXIT_LISTING]: "Withdraw from Registry",
  [TransactionTypes.WITHDRAW_TOKENS]: "Withdraw CVL from Newsroom Wallet",
};

const multiStepTransactionLabels = {
  [TransactionTypes.EXIT_LISTING]: "1 of 2",
  [TransactionTypes.WITHDRAW_TOKENS]: "2 of 2",
};

const transactionSuccessContent = {
  [TransactionTypes.EXIT_LISTING]: [undefined, undefined],
  [TransactionTypes.WITHDRAW_TOKENS]: [
    <>
      <div>Your newsroom has exited the registry</div>
    </>,
    <>
      <ModalContent>
        Your newsroom has exited from the registry and your CVL tokens have been withdrawn to your personal wallet.
      </ModalContent>
    </>,
  ],
};

const transactionRejectionContent = {
  [TransactionTypes.EXIT_LISTING]: [
    "Your newsroom has not exited the registry",
    "To exit the registry, you need to confirm the transaction in your MetaMask wallet",
  ],
  [TransactionTypes.WITHDRAW_TOKENS]: [
    "Your tokens have not been withdrawn",
    "To withdraw your tokens, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
  [TransactionTypes.EXIT_LISTING]: [
    "The was an problem with exiting the registry",
    <>
      <ModalContent>
        Please retry your transaction. You can contact Customer Support if you continue to have issues.
      </ModalContent>
    </>,
  ],
  [TransactionTypes.WITHDRAW_TOKENS]: [
    "The was an problem with withdrawing your tokens",
    <>
      <ModalContent>
        Please retry your transaction. You can contact Customer Support if you continue to have issues.
      </ModalContent>
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

class ExitListing extends React.Component<OwnerListingViewProps & InjectedTransactionStatusModalProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <TransactionButton
        transactions={[
          {
            transaction: async () => {
              this.props.updateTransactionStatusModalsState({
                isWaitingTransactionModalOpen: true,
                isTransactionProgressModalOpen: false,
                isTransactionSuccessModalOpen: false,
                transactionType: TransactionTypes.EXIT_LISTING,
              });
              return this.exitListing();
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
                transactionType: TransactionTypes.WITHDRAW_TOKENS,
              });
              return this.withdrawTokensFromMultisig();
            },
            handleTransactionHash: (txHash: TxHash) => {
              this.props.updateTransactionStatusModalsState({
                isWaitingTransactionModalOpen: false,
                isTransactionProgressModalOpen: true,
              });
            },
            postTransaction: () => {
              this.props.updateTransactionStatusModalsState({
                isWaitingTransactionModalOpen: false,
                isTransactionProgressModalOpen: false,
                isTransactionSuccessModalOpen: true,
              });
            },
            handleTransactionError: this.props.handleTransactionError,
          },
        ]}
      >
        Exit Listing
      </TransactionButton>
    );
  }

  private exitListing = async (): Promise<TwoStepEthTransaction<any> | void> => {
    return exitListing(this.props.listingAddress, this.props.listing.data.owner);
  };

  private withdrawTokensFromMultisig = async (): Promise<TwoStepEthTransaction<any> | void> => {
    return withdrawTokensFromMultisig(this.props.listing.data.owner);
  };
}

class ListingOwnerActions extends React.Component<ListingOwnerActionsProps & InjectedTransactionStatusModalProps> {
  public render(): JSX.Element {
    const canExitListing = this.props.listing.data.isWhitelisted && !this.props.listing.data.challenge;
    return (
      <>
        <ViewModuleHeader>Owner Actions</ViewModuleHeader>
        <p>As an Owner of this listing, you can manage your listing here</p>
        {canExitListing && (
          <>
            <p>
              To remove your newsroom from the registry, and withdraw your tokens to your wallet, click the button
              below. If you choose to rejoin the registry, you will have to re-apply. There will be 2 transactions to
              complete this action.{" "}
            </p>
            <ExitListing listingAddress={this.props.listing.address} {...this.props} />
          </>
        )}
      </>
    );
  }
}

export default compose<React.ComponentClass<ListingOwnerActionsProps>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(ListingOwnerActions);
