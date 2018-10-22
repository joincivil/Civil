import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { EthAddress, ListingWrapper, NewsroomWrapper } from "@joincivil/core";
import { State } from "../../reducers";
import { makeGetListing } from "../../selectors";
import ListingRedux from "./ListingRedux";

export interface ListingReduxComponentProps {
  listingAddress: EthAddress;
}

export interface ListingReduxReduxProps {
  newsroom?: NewsroomWrapper;
  listing?: ListingWrapper;
}

class ListingReduxContainer extends React.Component<
  ListingReduxReduxProps & DispatchProp<any> & ListingReduxComponentProps
> {
  public render(): JSX.Element {
    return (
      <ListingRedux
        listingAddress={this.props.listingAddress}
        listing={this.props.listing}
        newsroom={this.props.newsroom}
      />
    );
  }
}

const mapListingStateToProps = (state: State, ownProps: ListingReduxComponentProps): ListingReduxReduxProps => {
  const getListing = makeGetListing();
  const { newsrooms } = state;
  const newsroom = newsrooms.get(ownProps.listingAddress);
  const wrappedNewsroom = newsroom && newsroom.wrapper;
  return {
    newsroom: wrappedNewsroom,
    listing: getListing(state, ownProps),
  };
};

export default connect(mapListingStateToProps)(ListingReduxContainer);
