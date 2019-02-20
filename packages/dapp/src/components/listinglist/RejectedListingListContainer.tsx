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
import { StyledListingCopy } from "../utility/styledComponents";
import ErrorLoadingDataMsg from "../utility/ErrorLoadingData";
import LoadingMsg from "../utility/LoadingMsg";
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
                <StyledListingCopy>
                  Rejected Newsrooms have been removed from the Civil Registry following a vote that they had violated
                  the <a href="https://civil.co/constitution/">Civil Constitution</a> in some way. Rejected Newsrooms
                  can reapply to the Registry at any time. <a href="#zendesk">Learn how</a>.
                </StyledListingCopy>
                <ListingList ListingItemComponent={ListingSummaryRejectedComponent} listings={map} />
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
