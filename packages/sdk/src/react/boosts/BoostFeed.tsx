import * as React from "react";
import { Query } from "react-apollo";
import { HelmetHelper, LoadingMessage } from "@joincivil/components";
import { Button, buttonSizes } from "@joincivil/elements";
import { BoostCard } from "./BoostCard";
import { boostFeedQuery, boostNewsroomQuery } from "./queries";
import { BoostNewsroomData } from "./types";
import { BoostWrapper } from "./BoostStyledComponents";
import { NoBoostsText } from "./BoostTextComponents";
import * as boostCardImage from "../../images/boost-card.png";
import styled from "styled-components";

export const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
`;

export interface BoostFeedProps {
  limit?: number;
  channelID?: string;
}

export const BoostFeed: React.FunctionComponent<BoostFeedProps> = props => {
  const channelID = props.channelID;
  const limit = props.limit || 10;
  const search = { postType: "boost", channelID, limit };

  return (
    <>
      <HelmetHelper
        title={"Civil Project Boosts: Support the work that journalists do - The Civil Registry"}
        description={
          "Newsrooms around the world need your help to fund and start new projects. Support these newsrooms by funding their Project Boosts to help them hit their goals. Good reporting costs money, and the Civil community is making it happen."
        }
        image={boostCardImage}
        meta={{
          "og:site_name": "Civil Registry",
          "og:type": "website",
          "twitter:card": "summary",
        }}
      />
      <Query query={boostFeedQuery} variables={{ search }}>
        {({ loading: feedQueryLoading, error: feedQueryError, data: feedQueryData, fetchMore }) => {
          if (feedQueryLoading) {
            return <LoadingMessage>Loading Project Boosts</LoadingMessage>;
          } else if (feedQueryError || !feedQueryData || !feedQueryData.postsSearch) {
            console.error("error loading Boost feed data. error:", feedQueryError, "data:", feedQueryData);
            return "Error loading Boosts.";
          }

          if (!feedQueryData.postsSearch.posts || !feedQueryData.postsSearch.posts.length) {
            return <NoBoostsText />;
          }

          const { postsSearch } = feedQueryData;

          const projectFeed = postsSearch.posts.map((boostData: any, i: number) => (
            <Query key={i} query={boostNewsroomQuery} variables={{ addr: boostData.channel.newsroom.contractAddress }}>
              {({ loading: newsroomQueryLoading, error: newsroomQueryError, data: newsroomQueryData }) => {
                if (newsroomQueryLoading) {
                  return (
                    <BoostWrapper open={false}>
                      <LoadingMessage>Loading Project Boost</LoadingMessage>
                    </BoostWrapper>
                  );
                } else if (newsroomQueryError || !newsroomQueryData || !newsroomQueryData.listing) {
                  console.error("error loading newsroom data. error:", newsroomQueryError, "data:", newsroomQueryData);
                  return <></>;
                }

                const newsroomData = newsroomQueryData.listing as BoostNewsroomData;

                return (
                  <BoostCard
                    boostData={boostData}
                    newsroomData={newsroomData}
                    boostOwner={false}
                    open={false}
                    boostId={boostData.id}
                    handlePayments={() => null}
                    paymentSuccess={false}
                  />
                );
              }}
            </Query>
          ));

          return (
            <>
              {projectFeed}
              {postsSearch.afterCursor !== "" && (
                <LoadMoreContainer>
                  <Button
                    size={buttonSizes.SMALL}
                    onClick={() =>
                      fetchMore({
                        query: boostFeedQuery,
                        variables: {
                          search: {
                            postType: "boost",
                            channelID,
                            limit,
                            afterCursor: postsSearch.afterCursor,
                          },
                        },
                        updateQuery: (previousResult: any, { fetchMoreResult }: any) => {
                          const newEdges = fetchMoreResult.postsSearch.posts;
                          const beforeCursor = fetchMoreResult.postsSearch.beforeCursor;
                          const afterCursor = fetchMoreResult.postsSearch.afterCursor;

                          return newEdges.length
                            ? {
                                postsSearch: {
                                  posts: [...previousResult.postsSearch.posts, ...newEdges],
                                  beforeCursor,
                                  afterCursor,
                                  __typename: previousResult.postsSearch.__typename,
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
    </>
  );
};
