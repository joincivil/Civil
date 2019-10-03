import { storiesOf } from "@storybook/react";
import * as React from "react";
import apolloStorybookDecorator from "apollo-storybook-react";
import { UserSetAvatar } from "../";
import StoryRouter from "storybook-react-router";

const typeDefs = `
  type User {
    uid: String
    email: String
    ethAddress: String
  }

  type Query {
    currentUser: User
  }

  type Mutation {

    setAvatarMutation(
      channelID: String
      avatarDataURL: String
    ): String

    skipSetAvatarMutation(
      hasSeen: Boolean!
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
      setAvatarMutation: (channelID: string, avatarDataURL: string) => {
        return "ok";
      },
      skipSetAvatarMutation: (hasSeen: boolean) => {
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
  .add("UserSetAvatar", () => {
    return (
      <UserSetAvatar
        channelID={""}
        onSetAvatarComplete={() => {
          console.log("Sent");
        }}
      />
    );
  });
