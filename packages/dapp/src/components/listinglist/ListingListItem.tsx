import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { compose } from "redux";
import { State } from "../../reducers";
import { makeGetListingPhaseState, makeGetListing } from "../../selectors";
import { ListingWrapper } from "@joincivil/core";
import { NewsroomState } from "@joincivil/newsroom-manager";
import { ListingSummaryComponent, ListingSummaryRejectedComponent } from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { ListingContainerProps, connectLatestChallengeSucceededResults } from "../utility/HigherOrderComponents";
import WhitelistedListingItem from "./WhitelistedListingItem";

export interface ListingListItemOwnProps {
  listingAddress?: string;
  even: boolean;
  user?: string;
}

export interface ListingListItemReduxProps {
  newsroom?: NewsroomState;
  listing?: ListingWrapper;
  listingPhaseState?: any;
}

class ListingListItemComponent extends React.Component<
  ListingListItemOwnProps & ListingListItemReduxProps & DispatchProp<any>
> {
  public render(): JSX.Element {
    const { listing, newsroom, listingPhaseState } = this.props;
    const listingExists = listing && listing.data && newsroom && listingPhaseState;
    const isWhitelisted = listingExists && listingPhaseState.isWhitelisted && !listingPhaseState.isUnderChallenge;

    return (
      <>
        {isWhitelisted && <WhitelistedListingItem {...this.props} />}
        {listingExists && !isWhitelisted && !listingPhaseState.isRejected && this.renderListing()}
        {listingExists && listingPhaseState.isRejected && <RejectedListing {...this.props} />}
      </>
    );
  }

  private renderListing = (): JSX.Element => {
    const { listingAddress, listing, newsroom, listingPhaseState } = this.props;
    const listingData = listing!.data;
    let description = "";
    if (newsroom!.wrapper.data.charter) {
      description = JSON.parse(newsroom!.wrapper.data.charter!.content.toString()).desc;
    }
    const appExpiry = listingData.appExpiry && listingData.appExpiry.toNumber();
    const pollData = listingData.challenge && listingData.challenge.poll;
    const commitEndDate = pollData && pollData.commitEndDate.toNumber();
    const revealEndDate = pollData && pollData.revealEndDate.toNumber();
    const unstakedDeposit = listing && getFormattedTokenBalance(listing.data.unstakedDeposit);
    const challengeStake = listingData.challenge && getFormattedTokenBalance(listingData.challenge.stake);

    const newsroomData = newsroom!.wrapper.data;
    const listingDetailURL = `/listing/${listingAddress}`;

    const listingViewProps = {
      ...newsroomData,
      listingAddress,
      description,
      listingDetailURL,
      ...listingPhaseState,
      appExpiry,
      commitEndDate,
      revealEndDate,
      unstakedDeposit,
      challengeStake,
    };

    return <ListingSummaryComponent {...listingViewProps} />;
  };
}

const RejectedListing: React.StatelessComponent<ListingListItemOwnProps & ListingListItemReduxProps> = props => {
  const { listingAddress, newsroom, listingPhaseState } = props;
  const newsroomData = newsroom!.wrapper.data;
  const listingDetailURL = `/listing/${listingAddress}`;

  const listingViewProps = {
    ...newsroomData,
    listingAddress,
    listingDetailURL,
    ...listingPhaseState,
  };

  const ListingSummaryRejected = compose<React.ComponentClass<ListingContainerProps & {}>>(
    connectLatestChallengeSucceededResults,
  )(ListingSummaryRejectedComponent);

  return <ListingSummaryRejected {...listingViewProps} />;
};

const makeMapStateToProps = () => {
  const getListingPhaseState = makeGetListingPhaseState();
  const getListing = makeGetListing();

  const mapStateToProps = (
    state: State,
    ownProps: ListingListItemOwnProps,
  ): ListingListItemReduxProps & ListingListItemOwnProps => {
    const { newsrooms } = state;
    const newsroom = ownProps.listingAddress ? newsrooms.get(ownProps.listingAddress) : undefined;
    const listing = getListing(state, ownProps);

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
