import gql from "graphql-tag";

export const PAYMENTS_ETH_MUTATION = gql`
  mutation($postID: String!, $input: PaymentsCreateEtherPaymentInput!) {
    paymentsCreateEtherPayment(postID: $postID, input: $input) {
      transactionID
    }
  }
`;

export const PAYMENTS_STRIPE_MUTATION = gql`
  mutation($postID: String!, $input: PaymentsCreateStripePaymentInput!) {
    paymentsCreateStripePayment(postID: $postID, input: $input) {
      amount
    }
  }
`;

export const SET_EMAIL_MUTATION = gql`
  mutation($input: ChannelsSetEmailInput!) {
    userChannelSetEmail(input: $input) {
      id
    }
  }
`;
