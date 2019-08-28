import * as React from "react";
import { connect } from "react-redux";
import { Query } from "react-apollo";
import { EthAddress, ListingWrapper } from "@joincivil/core";
import { NewsroomState } from "@joincivil/newsroom-signup";
import { LoadingMessage } from "@joincivil/components";

import { State } from "../../redux/reducers";
import {
  LISTING_WITH_CHARTER_REVISIONS_QUERY,
  transformGraphQLDataIntoNewsroom,
  transformGraphQLDataIntoListing,
  transformGraphQLDataIntoCharterRevisions,
} from "../../helpers/queryTransformations";
import ScrollToTopOnMount from "../utility/ScrollToTop";
import ErrorLoadingDataMsg from "../utility/ErrorLoadingData";
import ErrorNotFoundMsg from "../utility/ErrorNotFound";

import ListingReduxContainer from "./ListingReduxContainer";
import ListingRedux from "./ListingRedux";

export interface ListingPageProps {
  match: any;
  listingAddress: EthAddress;
  history: any;
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
        <Query query={LISTING_WITH_CHARTER_REVISIONS_QUERY} variables={{ addr: listingAddress }} pollInterval={10000}>
          {({ loading, error, data }: any): JSX.Element => {
            if (loading || !data) {
              return <LoadingMessage />;
            }
            if (error) {
              return <ErrorLoadingDataMsg />;
            }
            if (!data.listing || !data.charterRevisions) {
              return <ErrorNotFoundMsg>We could not find the listing you were looking for.</ErrorNotFoundMsg>;
            }
            const newsroom = transformGraphQLDataIntoNewsroom(data.listing, this.props.listingAddress);
            const listing = transformGraphQLDataIntoListing(data.listing, this.props.listingAddress);
            const charterRevisions = transformGraphQLDataIntoCharterRevisions(data.charterRevisions);
            return (
              <>
                <ScrollToTopOnMount />
                <ListingRedux
                  listingAddress={listingAddress}
                  newsroom={newsroom}
                  listing={listing}
                  charterRevisions={charterRevisions}
                  match={this.props.match}
                  history={this.props.history}
                />
              </>
            );
          }}
        </Query>
      );
    } else {
      return (
        <>
          <ScrollToTopOnMount />
          <ListingReduxContainer listingAddress={listingAddress} />
        </>
      );
    }
  }
}

const mapToStateToProps = (state: State, ownProps: ListingPageProps): ListingPageProps & ListingPageReduxProps => {
  return {
    ...ownProps,
    useGraphQl: state.useGraphQL,
    listingAddress: ownProps.match.params.listingAddress,
  };
};

export default connect(mapToStateToProps)(ListingPageComponent);
