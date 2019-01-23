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
  loadingFinished: boolean;
}

const WhitelistedListingListRedux: React.SFC<WhitelistedListingsListReduxReduxProps> = props => {
  if (props.whitelistedListings.count()) {
    const predicate = (newsroomListing?: NewsroomListing) => {
      const listing = newsroomListing && newsroomListing.listing;
      return !!listing && !!listing.data && !!listing.data.challenge && !listing.data.challengeID.isZero();
    };

    const challengedListings = props.whitelistedListings.filter(predicate).toSet();
    const unchallengedListings = props.whitelistedListings.filterNot(predicate).toSet();
    const groupedListings = challengedListings.concat(unchallengedListings).toSet();

    return <ListingList ListingItemComponent={ListingSummaryApprovedComponent} listings={groupedListings} />;
  }

  return <EmptyRegistryTabContentComponent phaseTabType={REGISTRY_PHASE_TAB_TYPES.APPROVED} />;
};

const mapStateToProps = (state: State): WhitelistedListingsListReduxReduxProps => {
  const { whitelistedListings, listings, loadingFinished } = state.networkDependent;
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
    loadingFinished,
  };
};

export default connect(mapStateToProps)(WhitelistedListingListRedux);
