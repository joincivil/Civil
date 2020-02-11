import { storiesOf } from "@storybook/react";
import * as React from "react";
import StoryRouter from "storybook-react-router";
import apolloStorybookDecorator from "apollo-storybook-react";
import styled from "styled-components";
import Web3HttpProvider from "web3-providers-http";
import { TokensTabSell } from "./TokensTabSell";
import { CivilContext, buildCivilContext } from "../../context/CivilContext";
import { UniswapSell } from "./UniswapSell";
import { Notice, NoticeTypes } from "../../Notice";
import Web3 from "web3";

export const Container = styled.div`
  align-items: center;
  display: flex;
  height: 250px;
  justify-content: center;
  width: 100%;
  max-width: 720px;
`;
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
        return 137.23;
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

const web3Provider = new Web3HttpProvider("http://localhost:8045");
const web3 = new Web3(web3Provider);
const civilContext = buildCivilContext({ web3, featureFlags: ["uniswap"], config: { DEFAULT_ETHEREUM_NETWORK: 4 } });
const civilContextNoUniswap = buildCivilContext({ web3, featureFlags: [], config: { DEFAULT_ETHEREUM_NETWORK: 4 } });

storiesOf("Storefront / Sell Tab", module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .addDecorator(StoryRouter())
  .add("Sell Tab", () => {
    return (
      <Container>
        <Notice type={NoticeTypes.INFO}>
          notes for storybooks: if you are actually trying to buy you might have troubles. make sure the
          storefrontEthPrice graphql mock gets updated to the current price.
        </Notice>
        <CivilContext.Provider value={civilContext}>
          <TokensTabSell network={"4"} />
        </CivilContext.Provider>
      </Container>
    );
  })
  .add("Coming Soon", () => {
    return (
      <Container>
        <CivilContext.Provider value={civilContextNoUniswap}>
          <TokensTabSell network={"4"} />
        </CivilContext.Provider>
      </Container>
    );
  })
  .add("Uniswap", () => {
    return (
      <Container>
        <div>
          <div>ethExchangeRate: 0.5</div>
          <div>cvlToSell: 100</div>
          <div>etherToReceive: 50</div>
        </div>
        <CivilContext.Provider value={civilContextNoUniswap}>
          <UniswapSell ethExchangeRate={0.5} cvlToSell={100} onSellComplete={() => ({})} />
        </CivilContext.Provider>
      </Container>
    );
  });
