import { storiesOf } from "@storybook/react";
import * as React from "react";
import apolloStorybookDecorator from "apollo-storybook-react";
import { UserSetEmail } from "../";
import StoryRouter from "storybook-react-router";

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
      authSignupEmailSend: (email: string) => {
        return "ok";
      },
      authSignupEmailSendForApplication: (email: string, application: string) => {
        return "ok";
      },
    };
  },
};

storiesOf("Common / Web3Auth", module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .addDecorator(StoryRouter())
  .add("UserSetEmail", () => {
    return (
      <UserSetEmail
        channelID={""}
        onEmailSend={() => {
          console.log("Sent");
        }}
      />
    );
  });
