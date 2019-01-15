import { storiesOf } from "@storybook/react";
import * as React from "react";
import apolloStorybookDecorator from "apollo-storybook-react";
import { LoginComponent, AuthApplicationEnum } from "./LoginComponent";

const typeDefs = `
  type User {
    uid: String
    email: String
    ethAddress: String
  }

  type AuthLoginResponse {
    token: String
    refreshToken: String
    uid: String
  }

  type Query {
    currentUser: User
  }

  type Mutation {

    authSignupEmailSendForApplication(
      email: String
      application: String
    ): String

    authSignupEmailConfirm(
      signupJWT: String!
    ): AuthLoginResponse

    authSignupEmailSend(
      emailAddress: String!
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
        return "cool";
      },
    };
  },
  Mutation: () => {
    return {
      authSignupEmailSendForApplication: (email: string, application: string) => {
        return "success";
      },
    };
  },
};

storiesOf("Login", module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .add("LoginComponent", () => {
    return <LoginComponent applicationType={AuthApplicationEnum.DEFAULT} />;
  });
