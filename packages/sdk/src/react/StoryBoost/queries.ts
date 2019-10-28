import gql from "graphql-tag";

export const storyBoostQuery = gql`
  query Post($id: PostSearchInput!) {
    postsGet(id: $id) {
      posts {
        ... on PostExternalLink {
          openGraphData {
            title
          }
          channel {
            isStripeConnected
            newsroom {
              name
              multisigAddress
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
