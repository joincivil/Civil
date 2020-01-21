import * as React from "react";
import { Query } from "react-apollo";
import { Helmet } from "react-helmet";
import { LoadingMessage, CivilContext, ICivilContext } from "@joincivil/components";
import { Button, buttonSizes } from "@joincivil/elements";
import { StoryFeedMarquee } from "./StoryFeedMarquee";
import { StoryFeedItem } from "./StoryFeedItem";
import { StoryBoost } from "./StoryBoost";
import { StoryFeedWrapper, StoryFeedLabel, StoryLoadMoreContainer } from "./StoryFeedStyledComponents";
import { STORY_FEED_QUERY } from "./queries";
import { BoostCard, BoostNewsroomData } from "@joincivil/sdk";

export interface StoryFeedProps {
  match: any;
  payment?: boolean;
  newsroom?: boolean;
  isListingPageFeed?: boolean;
  onCloseStoryBoost(): void;
  onOpenStoryDetails(postId: string): void;
  onOpenPayments(postId: string): void;
  onOpenNewsroomDetails(postId: string): void;
}

class StoryFeedPage extends React.Component<StoryFeedProps> {
  public static contextType = CivilContext;
  public static context: ICivilContext;

  public render(): JSX.Element {
    const postId = this.props.match.params.postId;

    return (
      <>
        <Query query={STORY_FEED_QUERY} variables={{ filter: { alg: "vw_post_fair_with_interleaved_boosts_2" } }}>
          {({ loading, error, data, refetch, fetchMore }) => {
            if (loading) {
              return <LoadingMessage>Loading Stories</LoadingMessage>;
            } else if (error || !data || !data.postsStoryfeed) {
              console.error("error loading Story Feed data. error:", error, "data:", data);
              return "Error loading stories.";
            } else if (!data.postsStoryfeed.edges) {
              return "There are no stories yet.";
            }

            const { postsStoryfeed } = data;
            const storyfeed = postsStoryfeed.edges.map((edge: any, i: number) => {
              const postData = edge.post;
              if (
                postData.postType === "externallink" &&
                postData.openGraphData &&
                postData.openGraphData.title &&
                postData.openGraphData.url
              ) {
                return (
                  <StoryFeedItem
                    key={i}
                    postId={postData.id}
                    activeChallenge={false}
                    newsroom={postData.channel.newsroom}
                    openGraphData={postData.openGraphData}
                    displayedContributors={postData.groupedSanitizedPayments}
                    totalContributors={postData.groupedSanitizedPayments ? postData.groupedSanitizedPayments.length : 0}
                    openStoryNewsroomDetails={this.props.onOpenNewsroomDetails}
                    openStoryDetails={this.props.onOpenStoryDetails}
                    openPayments={this.props.onOpenPayments}
                    isListingPageFeed={this.props.isListingPageFeed}
                  />
                );
              } else if (postData.postType === "boost") {
                const newsroomData = postData.channel.listing as BoostNewsroomData;
                return (
                  <BoostCard
                    boostData={postData}
                    newsroomData={newsroomData}
                    boostOwner={false}
                    open={false}
                    boostId={postData.id}
                    handlePayments={() => null}
                    paymentSuccess={false}
                  />
                );
              }
              console.error("found post that can't be displayed. postID: ", postData.id);
              return null;
            });

            return (
              <>
                {storyfeed}
                {postsStoryfeed.pageInfo.hasNextPage && (
                  <StoryLoadMoreContainer>
                    <Button
                      size={buttonSizes.SMALL}
                      onClick={() =>
                        fetchMore({
                          query: STORY_FEED_QUERY,
                          variables: {
                            cursor: postsStoryfeed.pageInfo.endCursor,
                          },
                          updateQuery: (previousResult: any, { fetchMoreResult }: any) => {
                            const newEdges = fetchMoreResult.postsStoryfeed.edges;
                            const pageInfo = fetchMoreResult.postsStoryfeed.pageInfo;

                            return newEdges.length
                              ? {
                                  postsStoryfeed: {
                                    edges: [...previousResult.postsStoryfeed.edges, ...newEdges],
                                    pageInfo,
                                    __typename: previousResult.postsStoryfeed.__typename,
                                  },
                                }
                              : previousResult;
                          },
                        })
                      }
                    >
                      Load More
                    </Button>
                  </StoryLoadMoreContainer>
                )}
                {postId && (
                  <StoryBoost
                    postId={postId}
                    payment={this.props.payment}
                    newsroom={this.props.newsroom}
                    closeStoryBoost={this.props.onCloseStoryBoost}
                    handlePaymentSuccess={async () => {
                      await refetch();
                      this.props.onCloseStoryBoost();
                    }}
                    openStoryDetails={() => this.props.onOpenStoryDetails(postId)}
                    openPayments={() => this.props.onOpenPayments(postId)}
                    openStoryNewsroomDetails={() => this.props.onOpenNewsroomDetails(postId)}
                    isListingPageFeed={this.props.isListingPageFeed}
                  />
                )}
              </>
            );
          }}
        </Query>
      </>
    );
  }
}

export default StoryFeed;
