import * as React from "react";
import { connect } from "react-redux";
import { Query } from "react-apollo";
import { ListingWrapper } from "@joincivil/typescript-types";
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
  listingAddress: string;
  history: any;
}

export interface PreListingReduxProps {
  newsroom?: NewsroomState;
  listing?: ListingWrapper;
}

class ListingPageComponent extends React.Component<ListingPageProps> {
  public render(): JSX.Element {
    const listingID = this.props.listingAddress;
    let addr;
    let handle;
    if (listingID.length < 42) {
      handle = listingID;
    } else {
      addr = listingID;
    }

    return (
      <Query query={LISTING_WITH_CHARTER_REVISIONS_QUERY} variables={{ addr, handle }} pollInterval={10000}>
        {({ loading, error, data }: any): JSX.Element => {
          if (loading || !data) {
            return <LoadingMessage />;
          }
          if (error) {
            return <ErrorLoadingDataMsg />;
          }
          if (!data.tcrListing || !data.charterRevisions) {
            return <ErrorNotFoundMsg>We could not find the listing you were looking for.</ErrorNotFoundMsg>;
          }
          const newsroom = transformGraphQLDataIntoNewsroom(data.tcrListing, data.tcrListing.contractAddress);
          const listing = transformGraphQLDataIntoListing(data.tcrListing, data.tcrListing.contractAddress);
          const charterRevisions = transformGraphQLDataIntoCharterRevisions(data.charterRevisions);

          const listingAddress = listing.address;
          return (
            <>
              <ScrollToTopOnMount />
              <ListingRedux
                listingAddress={listingAddress}
                listingId={listingID}
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
