import * as React from "react";
import { Query } from "react-apollo";
import { StoryFeedWrapper, StoryFeedHeader } from "./StoryFeedStyledComponents";
import { Helmet } from "react-helmet";
import ScrollToTopOnMount from "../utility/ScrollToTop";
import { StoryFeedItem, LoadingMessage } from "@joincivil/components";
import gql from "graphql-tag";

export const STORY_FEED_QUERY = gql`
  query Post($search: PostSearchInput!) {
    postsSearch(search: $search) {
      posts {
        ... on PostExternalLink {
          id
          channelID
          createdAt
          openGraphData {
            url
            title
            description
            images {
              url
            }
            article {
              published_time
            }
          }
          channel {
            isStripeConnected
            newsroom {
              contractAddress
              multisigAddress
              charter {
                name
                newsroomUrl
                mission {
                  purpose
                }
                socialUrls {
                  twitter
                  facebook
                  email
                }
              }
            }
          }
          groupedSanitizedPayments {
            usdEquivalent
            payerChannel {
              handle
              tiny72AvatarDataUrl
            }
          }
        }
      }
    }
  }
`;

class StoryFeedPage extends React.Component {
  public render(): JSX.Element {
    const search = { postType: "externallink" };

    return (
      <>
        <Helmet title="Civil Story Feed - The Civil Registry" />
        <ScrollToTopOnMount />
        <StoryFeedWrapper>
          <StoryFeedHeader>Story Feed</StoryFeedHeader>
          <Query query={STORY_FEED_QUERY} variables={{ search }}>
            {({ loading: feedQueryLoading, error: feedQueryError, data: feedQueryData }) => {
              if (feedQueryLoading) {
                return <LoadingMessage>Loading Story Feed</LoadingMessage>;
              } else if (feedQueryError || !feedQueryData || !feedQueryData.postsSearch) {
                console.error("error loading Story Feed data. error:", feedQueryError, "data:", feedQueryData);
                return "Error loading Story Feed.";
              }

              return feedQueryData.postsSearch.posts.map((storyData: any, i: number) => {
                return (
                  <>
                    {storyData.openGraphData && storyData.openGraphData.title && storyData.openGraphData.url && (
                      <StoryFeedItem
                        key={i}
                        storyId={storyData.id}
                        activeChallenge={false}
                        createdAt={storyData.createdAt}
                        isStripeConnected={storyData.channel.isStripeConnected}
                        newsroom={storyData.channel.newsroom}
                        openGraphData={storyData.openGraphData}
                        displayedContributors={storyData.groupedSanitizedPayments}
                        sortedContributors={storyData.groupedSanitizedPayments}
                        totalContributors={
                          storyData.groupedSanitizedPayments ? storyData.groupedSanitizedPayments.length : 0
                        }
                      />
                    )}
                  </>
                );
              });
            }}
          </Query>
        </StoryFeedWrapper>
      </>
    );
  }
}

export default StoryFeedPage;
