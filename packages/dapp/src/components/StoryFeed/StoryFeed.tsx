import * as React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from "react-redux";
import { State } from "../../redux/reducers";
import { showWeb3LoginModal } from "../../redux/actionCreators/ui";
import { ICivilContext, CivilContext, StoryFeedItem, LoadingMessage } from "@joincivil/components";
import { Button, buttonSizes } from "@joincivil/elements";
import { StoryFeedWrapper, StoryFeedHeader } from "./StoryFeedStyledComponents";
import styled from "styled-components/macro";

export const STORY_FEED_QUERY = gql`
  query Storyfeed($cursor: String) {
    postsStoryfeed(first: 15, after: $cursor) {
      edges {
        post {
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
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
`;

function maybeAccount(state: State): any {
  const { user } = state.networkDependent;
  if (user.account && user.account.account && user.account.account !== "") {
    return user.account;
  }
}

const StoryFeedPage: React.FunctionComponent = props => {
  // context
  const civilCtx = React.useContext<ICivilContext>(CivilContext);
  if (civilCtx === null) {
    // context still loading
    return <></>;
  }

  // redux
  const dispatch = useDispatch();
  const account: any | undefined = useSelector(maybeAccount);

  const civilContext = React.useContext<ICivilContext>(CivilContext);
  const civilUser = civilContext.currentUser;
  const userAccount = account ? account.account : undefined;
  console.log(civilUser);
  console.log(account);

  async function onLoginPressed(): Promise<any> {
    dispatch!(await showWeb3LoginModal());
  }

  async function onLogoutPressed(): Promise<any> {
    civilCtx.auth.logout();
  }

  React.useEffect(() => {
    if (civilUser && !userAccount) {
      civilCtx.civil!.currentProviderEnable().catch(err => console.log("error enabling ethereum", err));
    }
  }, [civilUser, userAccount]);

  return (
    <>
      <Helmet title="Civil Stories - The Civil Registry" />
      <StoryFeedWrapper>
        <StoryFeedHeader>Stories</StoryFeedHeader>
        <Query query={STORY_FEED_QUERY}>
          {({ loading, error, data, fetchMore }) => {
            if (loading) {
              return <LoadingMessage>Loading Stories</LoadingMessage>;
            } else if (error || !data || !data.postsStoryfeed) {
              console.error("error loading Story Feed data. error:", error, "data:", data);
              return "Error loading stories.";
            } else if (!data.postsStoryfeed.edges) {
              return "There are no stories yet.";
            }

            const { postsStoryfeed } = data;

            const storyfeed = postsStoryfeed.edges.map((story: any, i: number) => {
              const storyData = story.post;

              if (storyData.openGraphData && storyData.openGraphData.title && storyData.openGraphData.url) {
                return (
                  <StoryFeedItem
                    key={i}
                    civilUser={civilUser}
                    userAddress={userAccount}
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
                    handleLogin={onLoginPressed}
                    handleLogout={onLogoutPressed}
                  />
                );
              }

              return null;
            });

            return (
              <>
                {storyfeed}
                {postsStoryfeed.pageInfo.hasNextPage && (
                  <LoadMoreContainer>
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
                  </LoadMoreContainer>
                )}
              </>
            );
          }}
        </Query>
      </StoryFeedWrapper>
    </>
  );
};

export default StoryFeedPage;
