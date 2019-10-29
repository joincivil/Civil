import gql from "graphql-tag";

export const storyBoostQuery = gql`
  query StoryBoost($id: String!) {
    postsGet(id: $id) {
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
`;
