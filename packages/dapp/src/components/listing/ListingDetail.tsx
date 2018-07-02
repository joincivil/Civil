import * as React from "react";
import { EthAddress, ListingWrapper, NewsroomWrapper } from "@joincivil/core";
import { DepositTokens, ExitListing, WithdrawTokens } from "./OwnerListingViews";
import { ViewModule, ViewModuleHeader } from "../utility/ViewModules";
import { ListingDetailHeader, ListingDetailHeaderProps } from "@joincivil/components";

export interface ListingDetailProps {
  newsroom: NewsroomWrapper;
  listing: ListingWrapper;
  userAccount?: EthAddress;
  listingPhaseState: any;
}

class ListingDetail extends React.Component<ListingDetailProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    // const isOwnerViewingListing = this.props.listing.data.owner === this.props.userAccount;
    let newsroomDescription =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id.";
    if (this.props.newsroom.data.charter) {
      newsroomDescription = JSON.parse(this.props.newsroom.data.charter.content.toString()).desc;
    }

    const props: ListingDetailHeaderProps = {
      newsroomName: this.props.newsroom.data.name,
      newsroomDescription,
      owner: this.props.listing.data.owner,
      unstakedDeposit: this.props.listing.data.unstakedDeposit,
      ...this.props.listingPhaseState,
    };

    return <>{this.props.listing.data && <ListingDetailHeader {...props} />}</>;
  }

  /*
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
  //*/
}

export default ListingDetail;
