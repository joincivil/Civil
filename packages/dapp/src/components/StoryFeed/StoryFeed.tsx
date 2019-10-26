import * as React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { ICivilContext, CivilContext, StoryFeedItem, LoadingMessage } from "@joincivil/components";
import { useSelector, useDispatch } from "react-redux";
import { State } from "../../redux/reducers";
import { showWeb3LoginModal } from "../../redux/actionCreators/ui";
import { StoryFeedWrapper, StoryFeedHeader } from "./StoryFeedStyledComponents";
import { Helmet } from "react-helmet";

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

  async function onLoginPressed(): Promise<any> {
    dispatch!(await showWeb3LoginModal());
  }

  React.useEffect(() => {
    if (civilUser && !userAccount) {
      civilCtx.civil!.currentProviderEnable().catch(err => console.log("error enabling ethereum", err));
    }
  }, [civilUser, userAccount]);

  const search = { postType: "externallink" };

  return (
    <>
      <Helmet title="Civil Story Feed - The Civil Registry" />
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

            return feedQueryData.postsSearch.posts.map((storyData: any, i: number) => (
              <StoryFeedItem
                key={i}
                isLoggedIn={civilUser ? true : false}
                userAddress={userAccount}
                storyId={storyData.id}
                activeChallenge={false}
                createdAt={storyData.createdAt}
                isStripeConnected={storyData.channel.isStripeConnected}
                newsroom={storyData.channel.newsroom}
                openGraphData={storyData.openGraphData}
                displayedContributors={storyData.payments}
                sortedContributors={storyData.payments}
                totalContributors={storyData.payments ? storyData.payments.length : 0}
                handleLogin={onLoginPressed}
              />
            ));
          }}
        </Query>
      </StoryFeedWrapper>
    </>
  );
};

export default StoryFeedPage;
