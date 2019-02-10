import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import * as React from "react";
import apolloStorybookDecorator from "apollo-storybook-react";
import { UserTokenAccount } from "./Tokens";

const typeDefs = `
  type Query {
    storefrontEthPrice: Float
    storefrontCvlPrice: Float
    storefrontCvlQuoteUsd(usdToSpend: Float!): Float
  }

  schema {
    query: Query
  }
`;

const mocks = {
  Query: () => {
    return {
      storefrontEthPrice: () => {
        return 102.98;
      },
      storefrontCvlPrice: () => {
        return 0.2;
      },
      storefrontCvlQuoteUsd: () => {
        return 500.48635;
      },
    };
  },
};

export interface UserTokenAccountProgressProps {
  userAccount: string;
}

storiesOf("User Token Account", module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .addDecorator(StoryRouter())
  .add("User Token Account", () => {
    return (
      <UserTokenAccount
        userTutorialComplete={true}
        userAccount={"0x 3e39 fa98 3abc d349 d95a ed60 8e79 8817 397c f0d1"}
        supportEmailAddress={"support@civil.co"}
        faqUrl={"https://cvlconsensys.zendesk.com/hc/en-us"}
        foundationAddress={"0xf1176B0aeb7914B5472B61c97A4CF0E0bcacB579"}
        network={"4"}
      />
    );
  });
