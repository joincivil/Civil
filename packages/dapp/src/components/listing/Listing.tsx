import * as React from "react";
import { connect } from "react-redux";
import { Query } from "react-apollo";
import { EthAddress, ListingWrapper } from "@joincivil/typescript-types";
import { NewsroomState } from "@joincivil/newsroom-signup";
import { LoadingMessage } from "@joincivil/components";

import { State } from "../../redux/reducers";
import {
  LISTING_WITH_CHARTER_REVISIONS_QUERY,
  transformGraphQLDataIntoNewsroom,
  transformGraphQLDataIntoListing,
  transformGraphQLDataIntoCharterRevisions,
} from "@joincivil/utils";
import ScrollToTopOnMount from "../utility/ScrollToTop";
import ErrorLoadingDataMsg from "../utility/ErrorLoadingData";
import ErrorNotFoundMsg from "../utility/ErrorNotFound";

import ListingRedux from "./ListingRedux";

export interface ListingPageProps {
  match: any;
  listingAddress: EthAddress;
  history: any;
}

export interface PreListingReduxProps {
  newsroom?: NewsroomState;
  listing?: ListingWrapper;
}

class ListingPageComponent extends React.Component<ListingPageProps> {
  public render(): JSX.Element {
    const listingAddress = this.props.listingAddress;
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
  }
}

const mapToStateToProps = (state: State, ownProps: ListingPageProps): ListingPageProps => {
  return {
    ...ownProps,
    listingAddress: ownProps.match.params.listingAddress,
  };
};

export default connect(mapToStateToProps)(ListingPageComponent);
