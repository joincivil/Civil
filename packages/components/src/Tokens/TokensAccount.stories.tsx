import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import * as React from "react";
import Web3HttpProvider from "web3-providers-http";

import apolloStorybookDecorator from "apollo-storybook-react";
import { UserTokenAccountSignup } from "./TokensAccountSignup";
import { UserTokenAccountBuy } from "./TokensAccountBuy";
import { CivilContext, buildCivilContext } from "../context";
import Web3 from "web3";

const web3Provider = new Web3HttpProvider("http://localhost:8045");
const web3 = new Web3(web3Provider);
const civilContext = buildCivilContext({ web3, featureFlags: ["uniswap"], config: { DEFAULT_ETHEREUM_NETWORK: 4 } });

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

storiesOf("Storefront / User Token Account", module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .addDecorator(StoryRouter())
  .add("Signup Section", () => {
    return (
      <CivilContext.Provider value={civilContext}>
        <UserTokenAccountSignup step={"active"} user={{}} signupPath="/auth/signup" addWalletPath="/auth/wallet" />
      </CivilContext.Provider>
    );
  })
  .add("Buy Section", () => {
    return (
      <CivilContext.Provider value={civilContext}>
        <UserTokenAccountBuy step={"active"} network={"4"} foundationAddress={"0x..."} />
      </CivilContext.Provider>
    );
  });
