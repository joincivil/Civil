import * as React from "react";
import ListingReduxContainer from "./ListingReduxContainer";
import ListingRedux from "./ListingRedux";
import { State } from "../../reducers";
import { connect } from "react-redux";
import { Query } from "react-apollo";
import { EthAddress, ListingWrapper } from "@joincivil/core";
import { NewsroomState } from "@joincivil/newsroom-manager";
import {
  LISTING_QUERY,
  transformGraphQLDataIntoNewsroom,
  transformGraphQLDataIntoListing,
} from "../../helpers/queryTransformations";
export interface ListingPageProps {
  match: any;
  listingAddress: EthAddress;
}

export interface ListingPageReduxProps {
  useGraphQl: boolean;
}

export interface PreListingReduxProps {
  newsroom?: NewsroomState;
  listing?: ListingWrapper;
}

class ListingPageComponent extends React.Component<ListingPageProps & ListingPageReduxProps> {
  public render(): JSX.Element {
    const listingAddress = this.props.listingAddress;
    if (this.props.useGraphQl) {
      return (
        <Query query={LISTING_QUERY} variables={{ addr: listingAddress }}>
          {({ loading, error, data }: any): JSX.Element => {
            if (loading) {
              return <p />;
            }
            if (error) {
              return <p>Error :</p>;
            }
            console.log("queryData: ", data);
            const newsroom = transformGraphQLDataIntoNewsroom(data, this.props.listingAddress);
            const listing = transformGraphQLDataIntoListing(data, this.props.listingAddress);
            console.log("listing: ", listing);
            return <ListingRedux listingAddress={listingAddress} newsroom={newsroom} listing={listing} />;
          }}
        </Query>
      );
    } else {
      return <ListingReduxContainer listingAddress={listingAddress} />;
    }
  }
}

const mapToStateToProps = (state: State, ownProps: ListingPageProps): ListingPageProps & ListingPageReduxProps => {
  return {
    ...ownProps,
    useGraphQl: state.useGraphQL,
    listingAddress: ownProps.match.params.listing,
  };
};

export default connect(mapToStateToProps)(ListingPageComponent);
