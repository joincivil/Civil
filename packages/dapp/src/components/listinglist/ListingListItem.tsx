import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { compose } from "redux";
import { setupListingHistorySubscription } from "../../actionCreators/listings";
import { State } from "../../reducers";
import { makeGetListingPhaseState, makeGetListing } from "../../selectors";
import { ListingWrapper } from "@joincivil/core";
import { NewsroomState } from "@joincivil/newsroom-manager";
import { ListingSummaryComponent, ListingSummaryRejectedComponent } from "@joincivil/components";
import { ListingContainerProps, connectLatestChallengeSucceededResults } from "../utility/HigherOrderComponents";

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

class ListingListItemComponent extends React.Component<
  ListingListItemOwnProps & ListingListItemReduxProps & DispatchProp<any>
> {
  public render(): JSX.Element {
    const { listing, newsroom, listingPhaseState } = this.props;
    const listingExists = listing && listing.data && newsroom && listingPhaseState;

    return (
      <>
        {listingExists && !listingPhaseState.isRejected && this.renderListing()}
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
    };

    return <ListingSummaryComponent {...listingViewProps} />;
  };
}

class RejectedListing extends React.Component<ListingListItemOwnProps & ListingListItemReduxProps & DispatchProp<any>> {
  public async componentDidMount(): Promise<void> {
    this.props.dispatch!(await setupListingHistorySubscription(this.props.listingAddress!));
  }

  public render(): JSX.Element {
    const { listingAddress, newsroom, listingPhaseState } = this.props;
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
