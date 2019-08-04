import gql from "graphql-tag";

export const loggedInQuery = gql`
  query {
    currentUser {
      uid
    }
  }
`;

export const getCurrentUserQuery = gql`
  query {
    currentUser {
      uid
      email
      ethAddress
      quizPayload
      quizStatus
    }
  }
`;

export const setCurrentUserMutation = gql`
  mutation SetCurrentUser($input: UserUpdateInput!) {
    userUpdate(input: $input) {
      uid
      email
      ethAddress
      quizPayload
      quizStatus
    }
  }
`;

export const authLoginEthMutation = gql`
  mutation($input: UserSignatureInput!) {
    authWeb3: authLoginEth(input: $input) {
      token
      refreshToken
      uid
    }
  }
`;

export const authSignupEthMutation = gql`
  mutation($input: UserSignatureInput!) {
    authWeb3: authSignupEth(input: $input) {
      token
      refreshToken
      uid
    }
  }
`;
