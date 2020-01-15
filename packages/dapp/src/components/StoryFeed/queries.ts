import gql from "graphql-tag";

export const STORY_FEED_QUERY = gql`
  query Storyfeed($cursor: String, $filter: StoryfeedFilterInput) {
    postsStoryfeed(first: 15, after: $cursor, filter: $filter) {
      edges {
        post {
          postType
          ... on PostBoost {
            id
            channel {
              id
              channelType
              newsroom {
                contractAddress
                name
              }
              listing {
                name
                url
                contractAddress
                owner
                whitelisted
                charter {
                  uri
                }
              }
            }
            channelID
            currencyCode
            goalAmount
            paymentsTotal(currencyCode: "USD")
            title
            dateEnd
            why
          }
          ... on PostExternalLink {
            id
            datePosted
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
                name
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
            name
            charter {
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
