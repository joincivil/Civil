import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";
import { Button, ListingSummaryRejectedComponent } from "@joincivil/components";
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
import styled from "styled-components";

export interface RejectedListingsListContainerReduxProps {
  useGraphQL: boolean;
}
const LISTINGS_QUERY = gql`
  query Listings($rejectedOnly: Boolean!, $cursor: String) {
    tcrListings(rejectedOnly: $rejectedOnly, first: 12, after: $cursor) {
      edges {
        node {
          ...ListingFragment
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${LISTING_FRAGMENT}
`;

const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

class RejectedListingListContainer extends React.Component<RejectedListingsListContainerReduxProps> {
  public render(): JSX.Element {
    if (this.props.useGraphQL) {
      return (
        <Query query={LISTINGS_QUERY} variables={{ rejectedOnly: true }}>
          {({ loading, error, data: { tcrListings }, fetchMore }: any): JSX.Element => {
            if (loading) {
              return <LoadingMsg />;
            }
            if (error) {
              return <ErrorLoadingDataMsg />;
            }
            const map = Set<NewsroomListing>(
              tcrListings.edges.map((edge: any) => {
                return {
                  listing: transformGraphQLDataIntoListing(edge.node, edge.node.contractAddress),
                  newsroom: transformGraphQLDataIntoNewsroom(edge.node, edge.node.contractAddress),
                };
              }),
            );

            if (!map.count()) {
              return <EmptyRegistryTabContentComponent phaseTabType={REGISTRY_PHASE_TAB_TYPES.REJECTED} />;
            }

            return (
              <>
                <RejectedTabDescription />
                <ListingList ListingItemComponent={ListingSummaryRejectedComponent} listings={map} />
                {tcrListings.pageInfo.hasNextPage && (
                  <LoadMoreContainer>
                    <Button
                      onClick={() =>
                        fetchMore({
                          variables: {
                            cursor: tcrListings.pageInfo.endCursor,
                          },
                          updateQuery: (previousResult: any, { fetchMoreResult }: any) => {
                            const newEdges = fetchMoreResult.tcrListings.edges;
                            const pageInfo = fetchMoreResult.tcrListings.pageInfo;

                            return newEdges.length
                              ? {
                                  tcrListings: {
                                    __typename: previousResult.tcrListings.__typename,
                                    edges: [...previousResult.tcrListings.edges, ...newEdges],
                                    pageInfo,
                                  },
                                }
                              : previousResult;
                          },
                        })
                      }
                    >
                      Load More
                    </Button>
                  </LoadMoreContainer>
                )}
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
