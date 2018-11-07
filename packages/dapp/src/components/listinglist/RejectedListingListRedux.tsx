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
}

class RejectedListingListRedux extends React.Component<RejectedListingsListReduxReduxProps> {
  public render(): JSX.Element {
    if (this.props.rejectedListings.count()) {
      return (
        <ListingList ListingItemComponent={ListingSummaryApprovedComponent} listings={this.props.rejectedListings} />
      );
    }

    return <EmptyRegistryTabContentComponent phaseTabType={REGISTRY_PHASE_TAB_TYPES.REJECTED} />;
  }
}

const mapStateToProps = (state: State): RejectedListingsListReduxReduxProps => {
  const { rejectedListings, listings } = state.networkDependent;
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
  };
};

export default connect(mapStateToProps)(RejectedListingListRedux);
