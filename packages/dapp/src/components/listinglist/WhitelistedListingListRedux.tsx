import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";

import { ListingSummaryApprovedComponent } from "@joincivil/components";

import ListingList from "./ListingList";
import { EmptyRegistryTabContentComponent, REGISTRY_PHASE_TAB_TYPES } from "./EmptyRegistryTabContent";
import { State } from "../../redux/reducers";
import { NewsroomListing } from "@joincivil/core";

export interface WhitelistedListingsListReduxReduxProps {
  whitelistedListings: Set<NewsroomListing>;
}

class WhitelistedListingListRedux extends React.Component<WhitelistedListingsListReduxReduxProps> {
  public render(): JSX.Element {
    if (this.props.whitelistedListings.count()) {
      return (
        <ListingList ListingItemComponent={ListingSummaryApprovedComponent} listings={this.props.whitelistedListings} />
      );
    }

    return <EmptyRegistryTabContentComponent phaseTabType={REGISTRY_PHASE_TAB_TYPES.APPROVED} />;
  }
}

const mapStateToProps = (state: State): WhitelistedListingsListReduxReduxProps => {
  const { whitelistedListings, listings } = state.networkDependent;
  const { newsrooms } = state;
  const whitelistedNewsroomListings = whitelistedListings
    .map(l => {
      return {
        newsroom: newsrooms.get(l!).wrapper,
        listing: listings.get(l!).listing,
      };
    })
    .toSet();
  return {
    whitelistedListings: whitelistedNewsroomListings,
  };
};

export default connect(mapStateToProps)(WhitelistedListingListRedux);
