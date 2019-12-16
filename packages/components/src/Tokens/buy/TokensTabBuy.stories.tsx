import { storiesOf } from "@storybook/react";
import * as React from "react";
import StoryRouter from "storybook-react-router";
import apolloStorybookDecorator from "apollo-storybook-react";
import styled from "styled-components";
import Web3HttpProvider from "web3-providers-http";

import { TokensTabBuy } from "./TokensTabBuy";
import { CivilContext, buildCivilContext } from "../../context/CivilContext";
import { UniswapBuy } from "./UniswapBuy";
import { AirswapBuyCVL } from "./AirswapBuyCVL";
import { TokensTabBuyComplete } from "./TokensTabBuyComplete";
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
const web3Provider = new Web3HttpProvider("http://localhost:8045");
const web3 = new Web3(web3Provider);
const civilContext = buildCivilContext({ web3, featureFlags: ["uniswap"], config: { DEFAULT_ETHEREUM_NETWORK: 4 } });

const foundationAddress = "hello!";

storiesOf("Storefront / Buy Tab", module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .addDecorator(StoryRouter())
  .add("Buy Tab", () => {
    return (
      <Container>
        <CivilContext.Provider value={civilContext}>
          <TokensTabBuy foundationAddress={foundationAddress} network={"4"} />
        </CivilContext.Provider>
      </Container>
    );
  })
  .add("Buy from Uniswap", () => {
    return (
      <CivilContext.Provider value={civilContext}>
        <Container>
          <UniswapBuy
            usdToSpend={100}
            ethToSpend={0.746}
            ethExchangeRate={0.00746}
            onBuyComplete={() => alert("buy complete")}
          />
        </Container>
      </CivilContext.Provider>
    );
  })
  .add("Buy from Airswap", () => {
    return (
      <Container>
        <AirswapBuyCVL network={"4"} buyFromAddress={"0x0..."} buyCVLBtnText={"Buy from the Civil Foundation"} />
      </Container>
    );
  })
  .add("Buy Complete", () => {
    return (
      <CivilContext.Provider value={civilContext}>
        <Container>
          <TokensTabBuyComplete />
        </Container>
      </CivilContext.Provider>
    );
  });
