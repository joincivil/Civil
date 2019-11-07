import * as React from "react";
import { Set } from "immutable";
import { Button, ListingSummaryRejectedComponent, LoadingMessage } from "@joincivil/components";
import ListingList from "./ListingList";
import { EmptyRegistryTabContentComponent, REGISTRY_PHASE_TAB_TYPES } from "./EmptyRegistryTabContent";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import {
  LISTING_FRAGMENT,
  transformGraphQLDataIntoListing,
  transformGraphQLDataIntoNewsroom,
} from "../../helpers/queryTransformations";
import ErrorLoadingDataMsg from "../utility/ErrorLoadingData";
import { NewsroomListing } from "@joincivil/core";
import { RejectedTabDescription } from "./TabDescriptions";
import styled from "styled-components/macro";

const LISTINGS_QUERY = gql`
  query Listings($rejectedOnly: Boolean!, $sortBy: ListingSort, $cursor: String) {
    tcrListings(rejectedOnly: $rejectedOnly, sortBy: $sortBy, first: 12, after: $cursor) {
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

class RejectedListingListContainer extends React.Component {
  public render(): JSX.Element {
    return (
      <Query query={LISTINGS_QUERY} variables={{ rejectedOnly: true, sortBy: "NAME" }}>
        {({ loading, error, data: { tcrListings }, fetchMore }: any): JSX.Element => {
          if (loading) {
            return <LoadingMessage />;
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
  }
}

export default RejectedListingListContainer;
