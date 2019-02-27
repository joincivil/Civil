import { storiesOf } from "@storybook/react";
import * as React from "react";
import StoryRouter from "storybook-react-router";
import { AirswapBuyCVL } from "./AirswapBuyCVL";
import { AirswapSellCVL } from "./AirswapSellCVL";
import styled, { StyledComponentClass } from "styled-components";

export const Container = styled.div`
  align-items: center;
  diplay: flex;
  height: 250px;
  justifiy-content: center;
  width: 100%;
`;

storiesOf("Airswap", module)
  .addDecorator(StoryRouter())
  .add("Buy CVL", () => {
    return (
      <Container>
        <AirswapBuyCVL network={"4"} />
      </Container>
    );
  })
  .add("Buy CVL from address", () => {
    return (
      <Container>
        <AirswapBuyCVL network={"4"} buyFromAddress={"0x0..."} buyCVLBtnText={"Buy from the Civil Foundation"} />
      </Container>
    );
  })
  .add("Sell CVL", () => {
    return (
      <Container>
        <AirswapSellCVL network={"4"} sellCVLBtnText={"Sell CVL"} />
      </Container>
    );
  });
