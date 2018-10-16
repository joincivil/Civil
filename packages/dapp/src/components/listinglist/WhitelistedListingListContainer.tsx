import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";

import ListingList from "./ListingList";
import { State } from "../../reducers";
import WhitelistedListingListRedux from "./WhitelistedListingListRedux";
import { Query } from "react-apollo";
import gql from "graphql-tag";

export interface WhitelistedListingsListContainerReduxProps {
  whitelistedListings: Set<string>;
  useGraphQL: boolean;
}
const LISTING_QUERY = gql`
  query($whitelistedOnly: Boolean!) {
    listings(whitelistedOnly: $whitelistedOnly) {
      contractAddress
    }
  }
`;
class WhitelistedListingListContainer extends React.Component<WhitelistedListingsListContainerReduxProps> {
  public render(): JSX.Element {
    if (this.props.useGraphQL) {
      return (
        <Query query={LISTING_QUERY} variables={{ whitelistedOnly: true }}>
          {({ loading, error, data }: any): JSX.Element => {
            if (loading) {
              return <p>Loading...</p>;
            }
            if (error) {
              return <p>Error :</p>;
            }
            const map = Set<string>(
              data.listings.map((listing: any) => {
                return listing.contractAddress.toLowerCase();
              }),
            );
            return (
              <>
                <ListingList listings={map} />
              </>
            );
          }}
        </Query>
      );
    } else {
      return <WhitelistedListingListRedux />;
    }
    // return(<ListingList listings={this.props.whitelistedListings} />;
  }
}

const mapStateToProps = (state: State): WhitelistedListingsListContainerReduxProps => {
  const { whitelistedListings } = state.networkDependent;
  const useGraphQL = state.useGraphQL;

  return {
    whitelistedListings,
    useGraphQL,
  };
};

export default connect(mapStateToProps)(WhitelistedListingListContainer);
