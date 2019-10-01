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
          url
          channel {
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
        }
      }
    }
  }
`;

const contributers = [
  { avatar: "https://picsum.photos/50", username: "violetnight13", amount: "$2.50" },
  { avatar: "https://picsum.photos/50", username: "CaryRay", amount: "$5.00" },
  { avatar: "https://picsum.photos/50", username: "ronburgundy", amount: "0.009214 ETH" },
];

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

              return feedQueryData.postsSearch.posts.map((storyData: any, i: number) => (
                <StoryFeedItem
                  activeChallenge={false}
                  contractAddress={storyData.channel.newsroom.contractAddress}
                  contributers={contributers}
                  description={
                    "Uyghurs are gaming TikTok’s algorithm to find a loophole in Xinjiangs’s information lockdown"
                  }
                  img={"https://codastory.com/wp-content/uploads/2019/09/Still-Header-.png"}
                  multisigAddress={storyData.channel.newsroom.multisigAddress}
                  newsroom={storyData.channel.newsroom.charter.name}
                  newsroomAbout={storyData.channel.newsroom.charter.mission.purpose}
                  newsroomRegistryURL={"https://registry.civil.co/" + storyData.channel.newsroom.contractAddress}
                  newsroomURL={storyData.channel.newsroom.charter.newsroomURL}
                  timeStamp={"10 days ago"}
                  title={"How TikTok opened a window into China’s police state"}
                  totalContributers={30}
                  url={storyData.url}
                />
              ));
            }}
          </Query>
        </StoryFeedWrapper>
      </>
    );
  }
}

export default StoryFeedPage;
