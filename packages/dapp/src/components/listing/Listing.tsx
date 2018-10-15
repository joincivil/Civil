import * as React from "react";

import ListingRedux from "./ListingRedux";
import ListingApollo from "./ListingApollo";
import { State } from "../../reducers";
import { connect } from "react-redux";

export interface ListingPageProps {
  match: any;
}

export interface ListingPageReduxProps {
  useGraphQl: boolean;
}

class ListingPageComponent extends React.Component<ListingPageProps & ListingPageReduxProps> {
  public render(): JSX.Element {
    const listingAddress = this.props.match.params.listing;
    if (this.props.useGraphQl) {
      return <ListingApollo listingAddress={listingAddress} />;
    } else {
      return <ListingRedux listingAddress={listingAddress} />;
    }
  }
}

const mapToStateToProps = (state: State, ownProps: ListingPageProps): ListingPageProps & ListingPageReduxProps => {
  return {
    ...ownProps,
    useGraphQl: state.useGraphQL,
  };
};

export default connect(mapToStateToProps)(ListingPageComponent);
