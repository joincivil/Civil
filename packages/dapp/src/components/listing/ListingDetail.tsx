import * as React from "react";
import { EthAddress, ListingWrapper } from "@joincivil/core";
import { DepositTokens, WithdrawTokens } from "./OwnerListingViews";
import { ViewModule, ViewModuleHeader } from "../utility/ViewModules";

export interface ListingDetailProps {
  listing: ListingWrapper;
  userAccount?: EthAddress;
}

class ListingDetail extends React.Component<ListingDetailProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    const isOwnerViewingListing = this.props.listing.data.owner === this.props.userAccount;
    return (
      <ViewModule>
        <ViewModuleHeader>Listing Details</ViewModuleHeader>

        {this.props.listing.data && (
          <>
            <dl>
              <dt>Is Whitelisted</dt>
              <dd>{this.props.listing.data.isWhitelisted}</dd>

              <dt>Owner</dt>
              <dd>{this.props.listing.data.owner}</dd>

              <dt>Unstaked Deposit</dt>
              <dd>{this.props.listing.data.unstakedDeposit.toString()}</dd>
            </dl>

            {isOwnerViewingListing && this.renderOwnerListingActionsView()}
          </>
        )}
      </ViewModule>
    );
  }

  private renderOwnerListingActionsView = (): JSX.Element => {
    return (
      <ViewModule>
        <ViewModuleHeader>Owner Actions</ViewModuleHeader>
        <DepositTokens listing={this.props.listing} listingAddress={this.props.listing.address} />
        <WithdrawTokens listing={this.props.listing} listingAddress={this.props.listing.address} />
      </ViewModule>
    );
  };
}

export default ListingDetail;
