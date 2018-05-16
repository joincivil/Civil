import * as React from "react";
import { EthAddress, ListingWrapper, NewsroomWrapper } from "@joincivil/core";
import { DepositTokens, ExitListing, WithdrawTokens } from "./OwnerListingViews";
import { ViewModule, ViewModuleHeader } from "../utility/ViewModules";

export interface ListingDetailProps {
  newsroom: NewsroomWrapper;
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
              <dt>Name</dt>
              <dd>{this.props.newsroom.data.name}</dd>

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
    const canExitListing = this.props.listing.data.isWhitelisted && !this.props.listing.data.challenge;
    return (
      <ViewModule>
        <ViewModuleHeader>Owner Actions</ViewModuleHeader>
        <DepositTokens listing={this.props.listing} listingAddress={this.props.listing.address} />
        <WithdrawTokens listing={this.props.listing} listingAddress={this.props.listing.address} />
        {canExitListing && <ExitListing listingAddress={this.props.listing.address} listing={this.props.listing} />}
      </ViewModule>
    );
  };
}

export default ListingDetail;
