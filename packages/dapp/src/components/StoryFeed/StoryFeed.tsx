import * as React from "react";
import { Query } from "react-apollo";
import { Helmet } from "react-helmet";
import { LoadingMessage } from "@joincivil/components";
import { Button, buttonSizes } from "@joincivil/elements";
import { StoryFeedMarquee } from "./StoryFeedMarquee";
import { StoryFeedItem } from "./StoryFeedItem";
import { StoryBoost } from "./StoryBoost";
import { StoryFeedWrapper, StoryFeedLabel, StoryLoadMoreContainer } from "./StoryFeedStyledComponents";
import { STORY_FEED_QUERY } from "./queries";
import { BoostCard, BoostNewsroomData } from "@joincivil/sdk";

export interface StoryFeedPageProps {
  match: any;
  payment?: boolean;
  newsroom?: boolean;
}

class StoryFeedPage extends React.Component<StoryFeedPageProps> {
  public render(): JSX.Element {
    const postId = this.props.match.params.postId;

    return (
      <>
        <Helmet title="Civil Story Boosts - The Civil Registry" />
        <StoryFeedMarquee />
        <StoryFeedWrapper>
          <StoryFeedLabel>Recent Stories</StoryFeedLabel>
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
                      totalContributors={
                        postData.groupedSanitizedPayments ? postData.groupedSanitizedPayments.length : 0
                      }
                      openStoryNewsroomDetails={this.openStoryNewsroomDetails}
                      openStoryDetails={this.openStoryDetails}
                      openPayments={this.openPayments}
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
                      closeStoryBoost={this.closeStoryBoost}
                      handlePaymentSuccess={async () => {
                        await refetch();
                        this.closeStoryBoost();
                      }}
                      openStoryDetails={() => this.openStoryDetails(postId)}
                      openPayments={() => this.openPayments(postId)}
                      openStoryNewsroomDetails={() => this.openStoryNewsroomDetails(postId)}
                    />
                  )}
                </>
              );
            }}
          </Query>
        </StoryFeedWrapper>
      </>
    );
  }

  private closeStoryBoost = () => {
    let urlBase = this.props.location.pathname;
    urlBase = urlBase.substring(0, urlBase.indexOf("/"));
    this.props.history.push({
      pathname: urlBase + "/storyfeed",
    });
  };

  private openStoryDetails = (postId: string) => {
    let urlBase = this.props.location.pathname;
    urlBase = urlBase.substring(0, urlBase.indexOf("/"));
    this.props.history.push({
      pathname: urlBase + "/storyfeed/" + postId,
    });
  };

  private openPayments = (postId: string) => {
    let urlBase = this.props.location.pathname;
    urlBase = urlBase.substring(0, urlBase.indexOf("/"));
    this.props.history.push({
      pathname: urlBase + "/storyfeed/" + postId + "/payment",
    });
  };

  private openStoryNewsroomDetails = (postId: string) => {
    let urlBase = this.props.location.pathname;
    urlBase = urlBase.substring(0, urlBase.indexOf("/"));
    this.props.history.push({
      pathname: urlBase + "/storyfeed/" + postId + "/newsroom",
    });
  };
}

export default StoryFeedPage;
