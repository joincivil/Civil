import * as React from "react";
import { storiesOf } from "@storybook/react";
import { Civil } from "@joincivil/core";
import StoryRouter from "storybook-react-router";
import styled, { StyledComponentClass } from "styled-components";
import { UniswapBuy } from "./UniswapBuy";
import { CivilContext, buildCivilContext } from "../../context/CivilContext";

export const Container = styled.div`
  align-items: center;
  diplay: flex;
  height: 250px;
  justifiy-content: center;
  width: 100%;
`;

let civil: Civil | undefined;
try {
  civil = new Civil();
} catch (error) {
  console.log("no civil", error);
  civil = undefined;
}
const civilContext = buildCivilContext(civil);

storiesOf("Uniswap", module)
  .addDecorator(StoryRouter())
  .add("Buy CVL from address", () => {
    return (
      <CivilContext.Provider value={civilContext}>
        <Container>
          <UniswapBuy usdToSpend={100} ethToSpend={0.746} ethExchangeRate={0.00746} />
        </Container>
      </CivilContext.Provider>
    );
  });
