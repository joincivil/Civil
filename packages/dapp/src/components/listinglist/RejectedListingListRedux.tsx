import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";

import { ListingSummaryRejectedComponent } from "@joincivil/components";

import ListingList from "./ListingList";
import { EmptyRegistryTabContentComponent, REGISTRY_PHASE_TAB_TYPES } from "./EmptyRegistryTabContent";
import { State } from "../../redux/reducers";
import { NewsroomListing } from "@joincivil/core";
import { RejectedTabDescription } from "./TabDescriptions";
import { ListingProps } from "./Listings";

export interface RejectedListingsListReduxReduxProps {
  rejectedListings: Set<NewsroomListing>;
  loadingFinished: boolean;
}

const RejectedListingListRedux: React.SFC<RejectedListingsListReduxReduxProps & ListingProps> = props => {
  if (props.rejectedListings.count()) {
    return (
      <ListingList
        ListingItemComponent={ListingSummaryRejectedComponent}
        listings={props.rejectedListings}
        history={props.history}
      />
    );
  }

  return (
    <>
      <RejectedTabDescription />
      <EmptyRegistryTabContentComponent phaseTabType={REGISTRY_PHASE_TAB_TYPES.REJECTED} />;
    </>
  );
};

const mapStateToProps = (state: State, ownProps: ListingProps): RejectedListingsListReduxReduxProps & ListingProps => {
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
    ...ownProps,
  };
};

export default connect(mapStateToProps)(RejectedListingListRedux);
