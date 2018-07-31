import * as React from "react";
import { connect } from "react-redux";
import { State } from "../../reducers";
import { makeGetListingPhaseState, makeGetListing } from "../../selectors";
import { ListingWrapper } from "@joincivil/core";
import { NewsroomState } from "@joincivil/newsroom-manager";
import { ListingSummaryComponent, ListingSummaryRejectedComponent } from "@joincivil/components";

export interface ListingListItemOwnProps {
  listingAddress?: string;
  even: boolean;
  user?: string;
}

export interface ChallengeListingListItemOwnProps {
  challengeID: string;
  even: boolean;
  user?: string;
}

export interface ListingListItemReduxProps {
  newsroom?: NewsroomState;
  listing?: ListingWrapper;
  listingPhaseState?: any;
}

class ListingListItemComponent extends React.Component<ListingListItemOwnProps & ListingListItemReduxProps> {
  public render(): JSX.Element {
    const { listingAddress: address, listing, newsroom, listingPhaseState } = this.props;

    if (listing && listing.data && newsroom && listingPhaseState) {
      const newsroomData = newsroom.wrapper.data;
      const listingDetailURL = `/listing/${address}`;

      if (listingPhaseState.isRejected) {
        const listingViewProps = {
          ...newsroomData,
          address,
          listingDetailURL,
          ...listingPhaseState,
        };

        return <ListingSummaryRejectedComponent {...listingViewProps} />;
      } else {
        const listingData = listing.data;
        let description = "";
        if (newsroom.wrapper.data.charter) {
          description = JSON.parse(newsroom.wrapper.data.charter.content.toString()).desc;
        }
        const appExpiry = listingData.appExpiry && listingData.appExpiry.toNumber();
        const pollData = listingData.challenge && listingData.challenge.poll;
        const commitEndDate = pollData && pollData.commitEndDate.toNumber();
        const revealEndDate = pollData && pollData.revealEndDate.toNumber();

        const listingViewProps = {
          ...newsroomData,
          address,
          description,
          listingDetailURL,
          ...listingPhaseState,
          appExpiry,
          commitEndDate,
          revealEndDate,
        };

        return <ListingSummaryComponent {...listingViewProps} />;
      }
    } else {
      return <></>;
    }
  }
}

const makeMapStateToProps = () => {
  const getListingPhaseState = makeGetListingPhaseState();
  const getListing = makeGetListing();

  const mapStateToProps = (
    state: State,
    ownProps: ListingListItemOwnProps,
  ): ListingListItemReduxProps & ListingListItemOwnProps => {
    const { newsrooms } = state;
    const { user } = state.networkDependent;
    const newsroom = ownProps.listingAddress ? newsrooms.get(ownProps.listingAddress) : undefined;
    const listing = getListing(state, ownProps);

    let userAcct = ownProps.user;
    if (!userAcct) {
      userAcct = user.account.account;
    }

    return {
      newsroom,
      listing,
      listingPhaseState: getListingPhaseState(state, ownProps),
      ...ownProps,
    };
  };

  return mapStateToProps;
};

export const ListingListItem = connect(makeMapStateToProps)(ListingListItemComponent);
