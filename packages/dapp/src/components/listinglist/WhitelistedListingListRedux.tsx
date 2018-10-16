import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";

import ListingList from "./ListingList";
import { State } from "../../reducers";

export interface WhitelistedListingsListReduxReduxProps {
  whitelistedListings: Set<string>;
}

class WhitelistedListingListRedux extends React.Component<WhitelistedListingsListReduxReduxProps> {
  public render(): JSX.Element {
    return <ListingList listings={this.props.whitelistedListings} />;
  }
}

const mapStateToProps = (state: State): WhitelistedListingsListReduxReduxProps => {
  const { whitelistedListings } = state.networkDependent;

  return {
    whitelistedListings,
  };
};

export default connect(mapStateToProps)(WhitelistedListingListRedux);
