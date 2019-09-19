import * as React from "react";
import { EthAddress, ListingWrapper, TwoStepEthTransaction, TxHash, NewsroomWrapper } from "@joincivil/core";
import { TransactionButton } from "@joincivil/components";
import { CivilHelper, CivilHelperContext } from "../../apis/CivilHelper";
import { ViewModuleHeader } from "../utility/ViewModules";
import { hasTransactionStatusModals, InjectedTransactionStatusModalProps } from "../utility/TransactionStatusModalsHOC";
import { ModalContent } from "@joincivil/components/build/ReviewVote/styledComponents";
import { compose } from "redux";
import { BigNumber } from "@joincivil/typescript-types";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { Subscription } from "rxjs";

enum TransactionTypes {
  EXIT_LISTING = "EXIT_LISTING",
  WITHDRAW_TOKENS = "WITHDRAW_TOKENS",
}

const transactionLabels = {
  [TransactionTypes.EXIT_LISTING]: "Withdraw from Registry",
  [TransactionTypes.WITHDRAW_TOKENS]: "Withdraw CVL from Newsroom Wallet",
};

const multiStepTransactionLabels = {
  [TransactionTypes.EXIT_LISTING]: "1 of 1",
  [TransactionTypes.WITHDRAW_TOKENS]: "1 of 1",
};

const transactionSuccessContent = {
  [TransactionTypes.EXIT_LISTING]: [
    <>
      <div>Your newsroom has exited the registry</div>
    </>,
    <>
      <ModalContent>Your newsroom has exited from the registry. You may now withdraw your CVL tokens.</ModalContent>
    </>,
  ],
  [TransactionTypes.WITHDRAW_TOKENS]: [
    <>
      <div>You have withdrawn your CVL tokens</div>
    </>,
    <>
      <ModalContent>Your CVL tokens have been withdrawn to your personal wallet.</ModalContent>
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
  public static contextType = CivilHelperContext;
  public context: CivilHelper;

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
    return this.context.exitListing(this.props.listingAddress, this.props.listing.data.owner);
  };
}

class WithdrawTokens extends React.Component<OwnerListingViewProps & InjectedTransactionStatusModalProps> {
  public static contextType = CivilHelperContext;
  public context: CivilHelper;

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
        Withdraw Tokens
      </TransactionButton>
    );
  }

  private withdrawTokensFromMultisig = async (): Promise<TwoStepEthTransaction<any> | void> => {
    return this.context.withdrawTokensFromMultisig(this.props.newsroom.data.owner);
  };
}

export interface ListingOwnerActionsProps {
  listing: ListingWrapper;
  newsroom: NewsroomWrapper;
}

export interface ListingOwnerActionsState {
  cvlBalance: BigNumber;
  tokenBalanceSubscription?: Subscription;
}

export interface OwnerListingViewProps {
  listingAddress: EthAddress;
  listing: ListingWrapper;
}

class ListingOwnerActions extends React.Component<
  ListingOwnerActionsProps & InjectedTransactionStatusModalProps,
  ListingOwnerActionsState
> {
  public static contextType = CivilHelperContext;
  public context: CivilHelper;

  constructor(props: ListingOwnerActionsProps & InjectedTransactionStatusModalProps) {
    super(props);
    this.state = {
      cvlBalance: new BigNumber(0),
    };
  }

  public async componentDidMount(): Promise<void> {
    const civil = this.context.civil;
    const cvl = await civil.cvlTokenSingletonTrusted();
    const ownerCVLBalance = await cvl.getBalance(this.props.newsroom.data.owner);
    this.setState({ cvlBalance: ownerCVLBalance });
    const subscription = await cvl.balanceUpdate("latest", this.props.newsroom.data.owner).subscribe(balance => {
      this.setState({ cvlBalance: balance });
    });
    this.setState({ tokenBalanceSubscription: subscription });
  }

  public componentWillUnmount(): void {
    if (this.state.tokenBalanceSubscription) {
      this.state.tokenBalanceSubscription.unsubscribe();
    }
  }

  public render(): JSX.Element {
    const canExitListing = this.props.listing.data.isWhitelisted && !this.props.listing.data.challenge;
    return (
      <>
        <ViewModuleHeader>Owner Actions</ViewModuleHeader>
        <p>As an Owner of this listing, you can manage your listing here</p>
        {canExitListing && (
          <>
            <p>
              To remove your newsroom from the registry, click the button below. If you choose to rejoin the registry,
              you will have to re-apply. Once this transaction has completed, you can withdraw your CVL tokens from your
              newsroom wallet by clicking "Withdraw Tokens" below.
            </p>
            <ExitListing listingAddress={this.props.listing.address} {...this.props} />
          </>
        )}
        <p>Newsroom Wallet CVL Balance: {getFormattedTokenBalance(this.state.cvlBalance)}</p>
        {this.state.cvlBalance.gt(0) && (
          <>
            <p>
              To withdraw your CVL tokens from your newsroom wallet into your personal wallet, click the button below.
            </p>
            <WithdrawTokens listingAddress={this.props.listing.address} {...this.props} />
          </>
        )}
      </>
    );
  }
}

export default compose<React.ComponentClass<ListingOwnerActionsProps>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(ListingOwnerActions);
