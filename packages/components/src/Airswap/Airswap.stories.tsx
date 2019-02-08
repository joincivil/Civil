import { storiesOf } from "@storybook/react";
import * as React from "react";
import StoryRouter from "storybook-react-router";
import { AirswapBuyCVL } from "./AirswapBuyCVL";
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
        <AirswapBuyCVL />
      </Container>
    );
  })
  .add("Buy CVL from address", () => {
    return (
      <Container>
        <AirswapBuyCVL buyFromAddress={"0x0..."} buyCVLBtnText={"Buy from the Civil Foundation"} />
      </Container>
    );
  });
