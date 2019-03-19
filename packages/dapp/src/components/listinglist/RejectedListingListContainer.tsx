import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";
import { ListingSummaryRejectedComponent } from "@joincivil/components";
import ListingList from "./ListingList";
import { State } from "../../redux/reducers";
import RejectedListingListRedux from "./RejectedListingListRedux";
import { EmptyRegistryTabContentComponent, REGISTRY_PHASE_TAB_TYPES } from "./EmptyRegistryTabContent";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import {
  LISTING_FRAGMENT,
  transformGraphQLDataIntoListing,
  transformGraphQLDataIntoNewsroom,
} from "../../helpers/queryTransformations";
import ErrorLoadingDataMsg from "../utility/ErrorLoadingData";
import LoadingMsg from "../utility/LoadingMsg";
import { NewsroomListing } from "@joincivil/core";
import { RejectedTabDescription } from "./TabDescriptions";
import { ListingProps } from "./Listings";

export interface RejectedListingsListContainerReduxProps {
  useGraphQL: boolean;
}
const LISTINGS_QUERY = gql`
  query($rejectedOnly: Boolean!) {
    listings(rejectedOnly: $rejectedOnly) {
      ...ListingFragment
    }
  }
  ${LISTING_FRAGMENT}
`;
class RejectedListingListContainer extends React.Component<ListingProps & RejectedListingsListContainerReduxProps> {
  public render(): JSX.Element {
    if (this.props.useGraphQL) {
      return (
        <Query query={LISTINGS_QUERY} variables={{ rejectedOnly: true }} pollInterval={30000}>
          {({ loading, error, data }: any): JSX.Element => {
            if (loading) {
              return <LoadingMsg />;
            }
            if (error) {
              return <ErrorLoadingDataMsg />;
            }
            const map = Set<NewsroomListing>(
              data.listings.map((listing: any) => {
                return {
                  listing: transformGraphQLDataIntoListing(listing, listing.contractAddress),
                  newsroom: transformGraphQLDataIntoNewsroom(listing, listing.contractAddress),
                };
              }),
            );

            if (!map.count()) {
              return <EmptyRegistryTabContentComponent phaseTabType={REGISTRY_PHASE_TAB_TYPES.REJECTED} />;
            }

            return (
              <>
                <RejectedTabDescription />
                <ListingList
                  ListingItemComponent={ListingSummaryRejectedComponent}
                  listings={map}
                  history={this.props.history}
                />
              </>
            );
          }}
        </Query>
      );
    } else {
      return <RejectedListingListRedux history={this.props.history} />;
    }
  }
}

const mapStateToProps = (state: State): RejectedListingsListContainerReduxProps => {
  const useGraphQL = state.useGraphQL;

  return {
    useGraphQL,
  };
};

export default connect(mapStateToProps)(RejectedListingListContainer);
