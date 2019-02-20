import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";

import { ListingSummaryRejectedComponent } from "@joincivil/components";

import ListingList from "./ListingList";
import { EmptyRegistryTabContentComponent, REGISTRY_PHASE_TAB_TYPES } from "./EmptyRegistryTabContent";
import { State } from "../../redux/reducers";
import { NewsroomListing } from "@joincivil/core";
import { StyledListingCopy } from "../utility/styledComponents";

export interface RejectedListingsListReduxReduxProps {
  rejectedListings: Set<NewsroomListing>;
  loadingFinished: boolean;
}

const RejectedListingListRedux: React.SFC<RejectedListingsListReduxReduxProps> = props => {
  if (props.rejectedListings.count()) {
    return <ListingList ListingItemComponent={ListingSummaryRejectedComponent} listings={props.rejectedListings} />;
  }

  return (
    <>
      <StyledListingCopy>
        Rejected Newsrooms have been removed from the Civil Registry following a vote that they had violated the{" "}
        <a href="https://civil.co/constitution/">Civil Constitution</a> in some way. Rejected Newsrooms can reapply to
        the Registry at any time. <a href="#zendesk">Learn how</a>.
      </StyledListingCopy>
      <EmptyRegistryTabContentComponent phaseTabType={REGISTRY_PHASE_TAB_TYPES.REJECTED} />;
    </>
  );
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
