import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import apolloStorybookDecorator from "apollo-storybook-react";
import { LoginComponent } from "./LoginComponent";

const typeDefs = `
  type Query {
    helloWorld: String
  }

  type Mutation {
    authSignupEmailSend(
      email: String
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
      helloWorld: () => {
        return "Hello from Apollo!!";
      },
    };
  },
  Mutation: () => {
    return {
      authSignupEmailSend: (email: string) => {
        return "success";
      },
    };
  },
};

const QUERY = gql`
  query hello {
    helloWorld
  }
`;

storiesOf("Login", module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .add("LoginComponent", () => {
    return <LoginComponent />;
  });
