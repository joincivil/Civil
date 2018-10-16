import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { State } from "../../reducers";
import { makeGetListing } from "../../selectors";
import { ListingWrapper, NewsroomWrapper } from "@joincivil/core";
import ListingListItem from "./ListingListItem";

export interface ListingListItemOwnProps {
  listingAddress?: string;
  even: boolean;
  user?: string;
}

export interface ListingListItemReduxProps {
  newsroom?: NewsroomWrapper;
  listing?: ListingWrapper;
  listingPhaseState?: any;
  charter?: any;
}

class ListingListItemReduxContainerComponent extends React.Component<
  ListingListItemOwnProps & ListingListItemReduxProps & DispatchProp<any>
> {
  public render(): JSX.Element {
    return (
      <ListingListItem
        listingAddress={this.props.listingAddress}
        listing={this.props.listing}
        newsroom={this.props.newsroom}
        even={this.props.even}
      />
    );
  }
}
const makeMapStateToProps = () => {
  const getListing = makeGetListing();

  const mapStateToProps = (
    state: State,
    ownProps: ListingListItemOwnProps,
  ): ListingListItemReduxProps & ListingListItemOwnProps => {
    const { newsrooms } = state;
    const newsroomState = ownProps.listingAddress ? newsrooms.get(ownProps.listingAddress) : undefined;
    const listing = getListing(state, ownProps);
    const newsroom = newsroomState && newsroomState.wrapper;
    return {
      newsroom,
      listing,
      ...ownProps,
    };
  };

  return mapStateToProps;
};

export default connect(makeMapStateToProps)(ListingListItemReduxContainerComponent);
