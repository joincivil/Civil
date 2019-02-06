import { storiesOf } from "@storybook/react";
import * as React from "react";
import { AirswapBuyCVL } from "./AirswapBuyCVL";
import styled, { StyledComponentClass } from "styled-components";

export const Container = styled.div`
  align-items: center;
  diplay: flex;
  height: 250px;
  justifiy-content: center;
  width: 100%;
`;

storiesOf("Airswap", module).add("Buy CVL", () => {
  return (
    <Container>
      <AirswapBuyCVL />
    </Container>
  );
});
