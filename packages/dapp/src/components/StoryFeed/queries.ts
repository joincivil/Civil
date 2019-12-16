import gql from "graphql-tag";

export const STORY_FEED_QUERY = gql`
  query Storyfeed($cursor: String) {
    postsStoryfeed(first: 15, after: $cursor) {
      edges {
        post {
          ... on PostExternalLink {
            id
            openGraphData {
              url
              title
              article {
                published_time
              }
              images {
                url
              }
            }
            channel {
              newsroom {
                charter {
                  name
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

export const STORY_BOOST = gql`
  query StoryBoost($id: String!) {
    postsGet(id: $id) {
      ... on PostExternalLink {
        id
        createdAt
        openGraphData {
          url
          title
          article {
            published_time
          }
          images {
            url
          }
        }
        channel {
          isStripeConnected
          stripeAccountID
          newsroom {
            contractAddress
            multisigAddress
            charter {
              name
              newsroomUrl
              mission {
                purpose
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
`;
