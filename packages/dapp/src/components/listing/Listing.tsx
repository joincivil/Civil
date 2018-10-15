import * as React from "react";
import ListingReduxContainer from "./ListingReduxContainer";
import ListingRedux from "./ListingRedux";
import { State } from "../../reducers";
import { connect } from "react-redux";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { EthAddress, NewsroomWrapper, ListingWrapper } from "@joincivil/core";
import BigNumber from "bignumber.js";
import { NewsroomState } from "@joincivil/newsroom-manager";

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

const LISTING_QUERY = gql`
  query($addr: String!) {
    listing(addr: $addr) {
      name
      owner
      ownerAddresses
      whitelisted
      charterUri
      unstakedDeposit
      appExpiry
    }
  }
`;

class ListingPageComponent extends React.Component<ListingPageProps & ListingPageReduxProps> {
  public render(): JSX.Element {
    const listingAddress = this.props.listingAddress;
    if (this.props.useGraphQl) {
      return (
        <Query query={LISTING_QUERY} variables={{ addr: listingAddress }}>
          {({ loading, error, data }: any): JSX.Element => {
            if (loading) {
              return <p>Loading...</p>;
            }
            if (error) {
              return <p>Error :</p>;
            }
            console.log("data: ", data);
            const newsroom = this.transformGraphQLDataIntoNewsroom(data);
            const listing = this.transformGraphQLDataIntoListing(data);
            return <ListingRedux listingAddress={listingAddress} newsroom={newsroom} listing={listing} />;
          }}
        </Query>
      );
    } else {
      return <ListingReduxContainer listingAddress={listingAddress} />;
    }
  }

  private transformGraphQLDataIntoNewsroom(queryData: any): NewsroomWrapper {
    console.log("queryData: ", queryData);
    return {
      address: this.props.listingAddress,
      data: {
        name: queryData.listing.name,
        owners: queryData.listing.ownerAddresses,
        charterHeader: {
          contentId: 0,
          revisionId: 0,
          timestamp: new Date(),
          uri: queryData.listing.charterUri,
          contentHash: "asdf",
          author: "jejejej",
          signature: "asdf",
          verifySignature: () => true,
        },
      },
    };
  }
  private transformGraphQLDataIntoListing(queryData: any): ListingWrapper {
    console.log("queryData: ", queryData);
    const date = Math.round(new Date(queryData.listing.appExpiry).getTime() / 1000);

    return {
      address: this.props.listingAddress,
      data: {
        appExpiry: new BigNumber(date),
        isWhitelisted: queryData.listing.whitelisted,
        owner: queryData.listing.owner,
        unstakedDeposit: new BigNumber(queryData.listing.unstakedDeposit),
        challengeID: new BigNumber(0),
      },
    };
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
