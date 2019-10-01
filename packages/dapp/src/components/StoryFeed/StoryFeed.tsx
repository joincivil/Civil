import * as React from "react";
import { Query } from "react-apollo";
import { StoryFeedWrapper, StoryFeedHeader } from "./StoryFeedStyledComponents";
import { Helmet } from "react-helmet";
import ScrollToTopOnMount from "../utility/ScrollToTop";
import { StoryFeedItem, LoadingMessage } from "@joincivil/components";
import { urlConstants as links } from "@joincivil/utils";
import gql from "graphql-tag";

export const STORY_FEED_QUERY = gql`
  query Post($search: PostSearchInput!) {
    postsSearch(search: $search) {
      posts {
        ... on PostExternalLink {
          id
          channelID
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
                  key={i}
                  activeChallenge={false}
                  contractAddress={storyData.channel.newsroom.contractAddress}
                  description={storyData.openGraphData.description}
                  img={storyData.openGraphData.images.url}
                  multisigAddress={storyData.channel.newsroom.multisigAddress}
                  newsroom={storyData.channel.newsroom.charter.name}
                  newsroomAbout={storyData.channel.newsroom.charter.mission.purpose}
                  newsroomRegistryURL={links.REGISTRY + storyData.channel.newsroom.contractAddress}
                  newsroomURL={storyData.channel.newsroom.charter.newsroomURL}
                  timeStamp={storyData.openGraphData.article.published_time}
                  title={storyData.openGraphData.title}
                  displayedContributors={contributers}
                  sortedContributors={contributers}
                  totalContributors={30}
                  url={storyData.openGraphData.url}
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
