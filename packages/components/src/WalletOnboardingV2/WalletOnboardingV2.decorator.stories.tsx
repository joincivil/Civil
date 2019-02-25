import apolloStorybookDecorator from "apollo-storybook-react";
import { EthSignedMessage } from "@joincivil/typescript-types";

const typeDefs = `
  type User {
    ethAddress: String
  }

  type Query {
    currentUser: User
  }

  input UserSignatureInput {
    message: String!
    messageHash: String!
    signature: String!
    signer: String!
    r: String!
    s: String!
    v: String!
  }

  type Mutation {
    userSetEthAddress(
      input: UserSignatureInput!
    ): String
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

const mocks = {
  Query: () => {
    return {
      currentUser: () => {
        return "ok";
      },
    };
  },
  Mutation: () => {
    return {
      userSetEthAddress: (sig: EthSignedMessage) => {
        return "ok";
      },
    };
  },
};

export const apolloDecorator = apolloStorybookDecorator({
  typeDefs,
  mocks,
});
