import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";

import { ListingSummaryApprovedComponent } from "@joincivil/components";

import ListingList from "./ListingList";
import { EmptyRegistryTabContentComponent, REGISTRY_PHASE_TAB_TYPES } from "./EmptyRegistryTabContent";
import { State } from "../../redux/reducers";
import { NewsroomListing } from "@joincivil/core";

export interface RejectedListingsListReduxReduxProps {
  rejectedListings: Set<NewsroomListing>;
  loadingFinished: boolean;
}

const RejectedListingListRedux: React.SFC<RejectedListingsListReduxReduxProps> = props => {
  if (props.rejectedListings.count()) {
    return <ListingList ListingItemComponent={ListingSummaryApprovedComponent} listings={props.rejectedListings} />;
  }

  return <EmptyRegistryTabContentComponent phaseTabType={REGISTRY_PHASE_TAB_TYPES.REJECTED} />;
};

const mapStateToProps = (state: State): RejectedListingsListReduxReduxProps => {
  const { rejectedListings, listings, loadingFinished } = state.networkDependent;
  const { newsrooms } = state;
  const rejectedNewsroomListings = rejectedListings
    .map(l => {
      return {
        newsroom: newsrooms.get(l!).wrapper,
        listing: listings.get(l!).listing,
      };
    })
    .toSet();
  return {
    rejectedListings: rejectedNewsroomListings,
    loadingFinished,
  };
};

export default connect(mapStateToProps)(RejectedListingListRedux);
