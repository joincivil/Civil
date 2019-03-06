import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";

import { NewsroomListing } from "@joincivil/core";
import { ListingSummaryApprovedComponent } from "@joincivil/components";

import { FAQ_BASE_URL } from "../../constants";
import { State } from "../../redux/reducers";
import { StyledListingCopy } from "../utility/styledComponents";

import ListingList from "./ListingList";
import { EmptyRegistryTabContentComponent, REGISTRY_PHASE_TAB_TYPES } from "./EmptyRegistryTabContent";

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

    return (
      <>
        <StyledListingCopy>
          All approved Newsrooms agreed to uphold the journalistic principles in the{" "}
          <a href="https://civil.co/constitution/">Civil Constitution</a>, and Newsrooms are subject to Civil's{" "}
          <a
            href={`${FAQ_BASE_URL}/hc/en-us/articles/360024853311-What-is-the-Civil-Registry-community-vetting-process-for-a-Newsroom-`}
          >
            community vetting process
          </a>.
        </StyledListingCopy>
        <ListingList ListingItemComponent={ListingSummaryApprovedComponent} listings={groupedListings} />;
      </>
    );
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
