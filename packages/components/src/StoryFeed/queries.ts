import gql from "graphql-tag";

export const LISTINGS_ACTIVE_CHALLENGE = gql`
  query Listings($activeChallenge: Boolean!) {
    tcrListings(activeChallenge: $activeChallenge) {
      edges {
        node {
          name
        }
      }
    }
  }
`;
