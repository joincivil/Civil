import * as React from "react";

import ListingHistory from "./ListingHistory";
import ListingDetail from "./ListingDetail";
import ListingPhaseActions from "./ListingPhaseActions";
import { EthAddress, ListingWrapper } from "@joincivil/core";
import { State } from "../../reducers";
import { connect, DispatchProp } from "react-redux";
import { PageView } from "../utility/ViewModules";
import { fetchAndAddListingData } from "../../actionCreators/listings";
import { NewsroomState } from "@joincivil/newsroom-manager";

export interface ListingPageProps {
  match: any;
}

export interface ListingReduxProps {
  newsroom: NewsroomState | undefined;
  listing: ListingWrapper | undefined;
  userAccount?: EthAddress;
  listingDataRequestStatus?: any;
  parameters: any;
}

class ListingPage extends React.Component<ListingReduxProps & DispatchProp<any> & ListingPageProps> {
  public componentDidUpdate(): void {
    if (!this.props.listing && !this.props.listingDataRequestStatus) {
      this.props.dispatch!(fetchAndAddListingData(this.props.match.params.listing.toString()));
    }
  }

  public render(): JSX.Element {
    const listing = this.props.listing;
    const newsroom = this.props.newsroom;
    let appExistsAsNewsroom = false;
    if (listing && newsroom) {
      appExistsAsNewsroom = !listing.data.appExpiry.isZero();
    }
    return (
      <PageView>
        {appExistsAsNewsroom && (
          <ListingDetail userAccount={this.props.userAccount} listing={listing!} newsroom={newsroom!.wrapper} />
        )}
        {appExistsAsNewsroom && (
          <ListingPhaseActions listing={this.props.listing!} parameters={this.props.parameters} />
        )}
        {!appExistsAsNewsroom && this.renderListingNotFound()}
        <ListingHistory listing={this.props.match.params.listing} />
      </PageView>
    );
  }

  private renderListingNotFound(): JSX.Element {
    return <>NOT FOUND</>;
  }
}

const mapToStateToProps = (state: State, ownProps: ListingPageProps): ListingReduxProps => {
  const { newsrooms, listings, listingsFetching, user, parameters } = state;
  const listingAddress = ownProps.match.params.listing;

  let listingDataRequestStatus;
  if (listingAddress) {
    listingDataRequestStatus = listingsFetching.get(listingAddress.toString());
  }

  const listing = listings.get(listingAddress) ? listings.get(listingAddress).listing : undefined;
  return {
    newsroom: newsrooms.get(listingAddress),
    listing,
    userAccount: user.account,
    listingDataRequestStatus,
    parameters,
  };
};

export default connect(mapToStateToProps)(ListingPage);
