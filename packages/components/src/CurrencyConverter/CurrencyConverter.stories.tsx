import { storiesOf } from "@storybook/react";
import * as React from "react";
import apolloStorybookDecorator from "apollo-storybook-react";
import { CurrencyConverter } from "./CurrencyConverter";
import styled, { StyledComponentClass } from "styled-components";

const Container = styled.div`
  width: 500px;
`;

const typeDefs = `
  type Query {
    storefrontEthPrice: Float
    storefrontCvlPrice: Float
    storefrontCvlQuoteUsd(usdToSpend: Float!): Float
    storefrontCvlQuoteTokens(tokensToBuy: Float!): Float
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
    };
  },
};

storiesOf("Currency Converter", module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .add("USD to ETH", () => {
    return (
      <Container>
        <CurrencyConverter currencyLabelLeft={"Enter amount of USD"} currencyLabelRight={"Amount of ETH"} />
      </Container>
    );
  });
