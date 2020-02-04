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
              handle
              newsroom {
                contractAddress
                name
              }
              listing {
                name
                url
                charter {
                  uri
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
            publishedTime
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
              id
              handle
              newsroom {
                name
              }
              listing {
                challenge {
                  challengeID
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
          id
          isStripeConnected
          stripeAccountID
          handle
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
          listing {
            challenge {
              challengeID
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
