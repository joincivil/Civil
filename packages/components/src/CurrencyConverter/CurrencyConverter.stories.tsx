import { storiesOf } from "@storybook/react";
import * as React from "react";
import { CurrencyConverter } from "./CurrencyConverter";
import styled, { StyledComponentClass } from "styled-components";
import apolloStorybookDecorator from "apollo-storybook-react";

export const Container = styled.div`
  width: 500px;
`;

const typeDefs = `
  type Query {
    storefrontEthPrice: Float
    storefrontCvlPrice: Float
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

export interface UserTokenAccountProgressProps {
  userAccount: string;
}

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
