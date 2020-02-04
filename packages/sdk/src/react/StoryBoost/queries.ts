import gql from "graphql-tag";

export const storyBoostQuery = gql`
  query StoryBoost($id: String!) {
    postsGet(id: $id) {
      ... on PostExternalLink {
        openGraphData {
          title
        }
        channel {
          id
          isStripeConnected
          stripeAccountID
          newsroom {
            name
            multisigAddress
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
