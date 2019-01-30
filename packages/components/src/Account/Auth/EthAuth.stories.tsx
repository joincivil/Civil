import { storiesOf } from "@storybook/react";
import * as React from "react";
import apolloStorybookDecorator from "apollo-storybook-react";
import { Civil } from "@joincivil/core";
import { AccountEthAuth } from "../";

let civil: Civil | undefined;
try {
  civil = new Civil();
} catch (error) {
  civil = undefined;
}

const typeDefs = `
  input UserSignatureInput {
    message: String!
    messageHash: String!
    signature: String!
    signer: String!
    r: String!
    s: String!
    v: String!
  }

  type User {
    uid: String
    email: String
    ethAddress: String
  }

  type Query {
    currentUser: User
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
  Mutation: () => {
    return {
      userSetEthAddress: (input: any) => {
        return "ok";
      },
    };
  },
};

storiesOf("Account/ETH", module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .add("AccountEthAuth", () => {
    return (
      <AccountEthAuth
        civil={civil!}
        onAuthenticated={() => {
          alert("authenticated successfully");
        }}
      />
    );
  });
