import gql from "graphql-tag";

export const userEthAddress = gql`
  query {
    currentUser {
      ethAddress
    }
  }
`;
// Unfortunately we can't combine this charter query with eth address query, because if no charter is saved at all yet, then the whole query errors and we won't get eth address
export const getCharterQuery = gql`
  query {
    nrsignupNewsroom {
      grantRequested
      grantApproved
      newsroomDeployTx
      newsroomAddress
      charter {
        name
        tagline
        logoUrl
        newsroomUrl
        roster {
          name
          role
          bio
          ethAddress
          socialUrls {
            twitter
            facebook
          }
          avatarUrl
          signature
        }
        signatures {
          signer
          signature
          message
        }
        mission {
          purpose
          structure
          revenue
          encumbrances
          miscellaneous
        }
        socialUrls {
          twitter
          facebook
        }
      }
    }
  }
`;

export const grantQuery = gql`
  query {
    nrsignupNewsroom {
      grantRequested
    }
  }
`;
