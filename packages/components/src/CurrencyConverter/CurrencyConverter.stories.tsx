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

storiesOf("Common / Currency / Currency Converter", module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .add("USD to ETH", () => {
    return (
      <Container>
        <div>(exchange rate is 0.5x)</div>
        <CurrencyConverter
          currencyCodeFrom="USD"
          currencyCodeTo="ETH"
          currencyLabelFrom="Enter USD Amount"
          currencyLabelTo="Converted ETH"
          errorMsg={"You don’t have enough ETH. Adjust the amount or buy more ETH. Check our FAQ to learn more."}
          getError={true}
          onConversion={() => null}
          doConversion={async (from: number) => from * 2}
        />
      </Container>
    );
  })
  .add("CVL to ETH", () => {
    return (
      <Container>
        <div>(exchange rate is 2x)</div>
        <CurrencyConverter
          currencyCodeFrom="CVL"
          currencyCodeTo="ETH"
          currencyLabelFrom="Enter CVL Amount"
          onConversion={() => null}
          doConversion={async (from: number) => from * 2}
        />
      </Container>
    );
  });
