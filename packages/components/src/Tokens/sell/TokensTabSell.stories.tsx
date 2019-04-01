import { storiesOf } from "@storybook/react";
import * as React from "react";
import StoryRouter from "storybook-react-router";
import apolloStorybookDecorator from "apollo-storybook-react";
import styled, { StyledComponentClass } from "styled-components";
import { TokensTabSell } from "./TokensTabSell";
import { CivilContext, buildCivilContext } from "../../context/CivilContext";
import { Civil } from "@joincivil/core";
import { TokensTabSellUnlock } from "./TokensTabSellUnlock";
import { UniswapSell } from "./UniswapSell";
import { Notice, NoticeTypes } from "../../Notice";

export const Container = styled.div`
  align-items: center;
  diplay: flex;
  height: 250px;
  justifiy-content: center;
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

let civil: Civil | undefined;
try {
  civil = new Civil();
} catch (error) {
  console.log("no civil", error);
  civil = undefined;
}
const civilContext = buildCivilContext(civil, undefined, ["uniswap"]);
const civilContextNoUniswap = buildCivilContext(civil, undefined, []);

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
  .add("Need to Unlock", () => {
    return (
      <Container>
        <CivilContext.Provider value={civilContextNoUniswap}>
          <TokensTabSellUnlock />
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
