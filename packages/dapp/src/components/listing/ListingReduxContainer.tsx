import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { EthAddress, ListingWrapper, NewsroomWrapper, EthContentHeader } from "@joincivil/core";
import { State } from "../../redux/reducers";
import { makeGetListing } from "../../selectors";
import ListingRedux from "./ListingRedux";

export interface ListingReduxComponentProps {
  listingAddress: EthAddress;
}

export interface ListingReduxReduxProps {
  newsroom?: NewsroomWrapper;
  listing?: ListingWrapper;
  charterRevisions?: Map<number, EthContentHeader>;
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
  const { charterRevisions: allCharterRevisions } = state.networkDependent;
  const newsroom = newsrooms.get(ownProps.listingAddress);
  const wrappedNewsroom = newsroom && newsroom.wrapper;
  let charterRevisions;
  if (allCharterRevisions) {
    charterRevisions = allCharterRevisions.get(ownProps.listingAddress);
  }
  return {
    newsroom: wrappedNewsroom,
    listing: getListing(state, ownProps),
    charterRevisions,
  };
};

export default connect(mapListingStateToProps)(ListingReduxContainer);
