import { storiesOf } from "@storybook/react";
import * as React from "react";
import { TokenTutorialLanding } from "./TokenTutorialLanding";

import apolloStorybookDecorator from "apollo-storybook-react";

const onClickFunc = () => {
  console.log("clicked!");
};

const typeDefs = `
  type User {
    uid: String
    email: String
    ethAddress: String
  }

  type Query {
    currentUser: User
  }

  schema {
    query: Query
  }
`;

const mocks = {
  Query: () => {
    return {
      currentUser: () => {
        return {
          uid: "abcd",
          email: "rad@civil.co",
          quizPayload: {},
          quizStatus: "",
        };
      },
    };
  },
};

storiesOf("Storefront / Token Tutorial", module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .add("Tutorial Landing", () => {
    return <TokenTutorialLanding quizPayload={{}} handleClose={onClickFunc} />;
  });
