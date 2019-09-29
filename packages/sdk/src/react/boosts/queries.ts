import gql from "graphql-tag";

export const boostFeedQuery = gql`
  query Post($search: PostSearchInput!) {
    postsSearch(search: $search) {
      posts {
        ... on PostBoost {
          id
          channel {
            id
            channelType
            newsroom {
              contractAddress
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
      }
    }
  }
`;

export const boostQuery = gql`
  query Boost($id: String!) {
    postsGet(id: $id) {
      channelID
      ... on PostBoost {
        channel {
          id
          channelType
          isStripeConnected
          newsroom {
            contractAddress
          }
        }
        currencyCode
        goalAmount
        paymentsTotal(currencyCode: "USD")
        title
        why
        what
        about
        dateEnd
        items {
          item
          cost
        }
      }
    }
  }
`;

export const boostNewsroomQuery = gql`
  query listing($addr: String!) {
    listing(addr: $addr) {
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
`;

export const boostProceedsQuery = gql`
  query proceeds($channelID: String!) {
    getChannelTotalProceeds(channelID: $channelID) {
      totalAmount
      usd
      ethUsdAmount
      ether
    }
  }
`;

export const createBoostMutation = gql`
  mutation($input: PostCreateBoostInput!) {
    postsCreateBoost(input: $input) {
      id
    }
  }
`;

export const editBoostMutation = gql`
  mutation($postID: String!, $input: PostCreateBoostInput!) {
    postsUpdateBoost(postID: $postID, input: $input) {
      id
    }
  }
`;

export const boostPayEthMutation = gql`
  mutation($postID: String!, $input: PaymentsCreateEtherPaymentInput!) {
    paymentsCreateEtherPayment(postID: $postID, input: $input) {
      reaction
      comment
      transactionID
    }
  }
`;

export const boostPayStripeMutation = gql`
  mutation($postID: String!, $input: PaymentsCreateStripePaymentInput!) {
    paymentsCreateStripePayment(postID: $postID, input: $input) {
      amount
    }
  }
`;
