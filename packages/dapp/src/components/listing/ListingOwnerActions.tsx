import * as React from "react";
import { EthAddress, ListingWrapper, TwoStepEthTransaction } from "@joincivil/core";
import { TransactionButton } from "@joincivil/components";
import { exitListing, withdrawTokensFromMultisig } from "../../apis/civilTCR";
import { ViewModuleHeader } from "../utility/ViewModules";

export interface ListingOwnerActionsProps {
  listing: ListingWrapper;
}

export interface OwnerListingViewProps {
  listingAddress: EthAddress;
  listing: ListingWrapper;
}

class ExitListing extends React.Component<OwnerListingViewProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <TransactionButton
        transactions={[{ transaction: this.exitListing }, { transaction: this.withdrawTokensFromMultisig }]}
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

export default class ListingOwnerActions extends React.Component<ListingOwnerActionsProps> {
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
            <ExitListing listingAddress={this.props.listing.address} listing={this.props.listing} />
          </>
        )}
      </>
    );
  }
}
