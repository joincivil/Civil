import * as React from "react";
import { Set } from "immutable";
import { Button, ListingSummaryApprovedComponent, LoadingMessage } from "@joincivil/components";
import ListingList from "./ListingList";
import { EmptyRegistryTabContentComponent, REGISTRY_PHASE_TAB_TYPES } from "./EmptyRegistryTabContent";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { NewsroomListing } from "@joincivil/core";
import {
  LISTING_FRAGMENT,
  transformGraphQLDataIntoListing,
  transformGraphQLDataIntoNewsroom,
} from "../../helpers/queryTransformations";
import ErrorLoadingDataMsg from "../utility/ErrorLoadingData";
import { WhitelistedTabDescription } from "./TabDescriptions";
import styled from "styled-components";

const LISTINGS_QUERY = gql`
  query Listings($whitelistedOnly: Boolean!, $sortBy: ListingSort, $cursor: String) {
    tcrListings(whitelistedOnly: $whitelistedOnly, sortBy: $sortBy, first: 12, after: $cursor) {
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

const WhitelistedListingListContainer = () => {
  return (
    <Query query={LISTINGS_QUERY} variables={{ whitelistedOnly: true, sortBy: "NAME" }}>
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
          return <EmptyRegistryTabContentComponent phaseTabType={REGISTRY_PHASE_TAB_TYPES.APPROVED} />;
        }

        const predicate = (newsroomListing?: NewsroomListing) => {
          const listing = newsroomListing && newsroomListing.listing;
          return !!listing && !!listing.data && !!listing.data.challenge && !listing.data.challengeID.isZero();
        };

        const challengedListings = map.filter(predicate).toSet();
        const unchallengedListings = map.filterNot(predicate).toSet();
        const groupedListings = challengedListings.concat(unchallengedListings).toSet();

        return (
          <>
            <WhitelistedTabDescription />
            <ListingList ListingItemComponent={ListingSummaryApprovedComponent} listings={groupedListings} />
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
};

export default WhitelistedListingListContainer;
