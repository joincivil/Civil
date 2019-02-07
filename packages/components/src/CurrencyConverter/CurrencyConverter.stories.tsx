import { storiesOf } from "@storybook/react";
import * as React from "react";
import { CurrencyConverter } from "./CurrencyConverter";
import styled, { StyledComponentClass } from "styled-components";

export const Container = styled.div`
  width: 500px;
`;

export interface UserTokenAccountProgressProps {
  userAccount: string;
}

storiesOf("Currency Converter", module).add("USD to ETH", () => {
  return (
    <Container>
      <CurrencyConverter currencyLabelLeft={"Enter amount of USD"} currencyLabelRight={"Amount of ETH"} />
    </Container>
  );
});
