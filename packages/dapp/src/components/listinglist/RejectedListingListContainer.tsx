import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";
import { ListingSummaryApprovedComponent } from "@joincivil/components";
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
import { NewsroomListing } from "@joincivil/core";

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
class RejectedListingListContainer extends React.Component<RejectedListingsListContainerReduxProps> {
  public render(): JSX.Element {
    if (this.props.useGraphQL) {
      return (
        <Query query={LISTINGS_QUERY} variables={{ rejectedOnly: true }} pollInterval={30000}>
          {({ loading, error, data }: any): JSX.Element => {
            if (loading) {
              return <></>;
            }
            if (error) {
              return <p>Error :</p>;
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
                <ListingList ListingItemComponent={ListingSummaryApprovedComponent} listings={map} />
              </>
            );
          }}
        </Query>
      );
    } else {
      return <RejectedListingListRedux />;
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
