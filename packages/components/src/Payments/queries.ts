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

export const GET_STRIPE_PAYMENT_INTENT = gql`
  mutation($postID: String!, $input: PaymentsCreateStripePaymentInput!) {
    paymentsCreateStripePaymentIntent(postID: $postID, input: $input) {
      id
      clientSecret
    }
  }
`;

export const CREATE_PAYMENT_METHOD = gql`
  mutation($input: PaymentsCreateStripePaymentMethodInput!) {
    paymentsCreateStripePaymentMethod(input: $input) {
      paymentMethodID
      customerID
    }
  }
`;

export const CLONE_PAYMENT_METHOD = gql`
  mutation($postID: String!, $input: PaymentsCreateStripePaymentInput!) {
    paymentsClonePaymentMethod(postID: $postID, input: $input) {
      payerChannelID
      paymentMethodID
    }
  }
`;
