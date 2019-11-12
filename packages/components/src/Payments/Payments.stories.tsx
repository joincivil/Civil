import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled, { ThemeProvider } from "styled-components";
import { PaymentsAmount } from "./PaymentsAmount";
import { PaymentsOptions } from "./PaymentsOptions";
import { PaymentsLoginOrGuest } from "./PaymentsLoginOrGuest";
import { PaymentsSuccess } from "./PaymentsSuccess";
import { RENDER_CONTEXT } from "../context";
import { DEFAULT_CHECKBOX_THEME } from "../input";
import { DEFAULT_BUTTON_THEME } from "../Button";

const Container = styled.div`
  width: 400px;
`;

const suggestedAmounts = [{ amount: "1" }, { amount: "2" }, { amount: "3" }, { amount: "5" }];

const onClickFunc = () => {
  console.log("clicked");
};

const theme = {
  ...DEFAULT_CHECKBOX_THEME,
  ...DEFAULT_BUTTON_THEME,
  renderContext: RENDER_CONTEXT.EMBED,
};

storiesOf("Boost / Payments", module)
  .add("Payment Type", () => {
    return (
      <Container>
        <ThemeProvider theme={theme}>
          <PaymentsOptions usdToSpend={1} isStripeConnected={true} handleNext={onClickFunc} />
        </ThemeProvider>
      </Container>
    );
  })
  .add("Payment Amount", () => {
    return (
      <Container>
        <ThemeProvider theme={theme}>
          <PaymentsAmount newsroomName={"Coda Story"} suggestedAmounts={suggestedAmounts} handleAmount={onClickFunc} />
        </ThemeProvider>
      </Container>
    );
  })
  .add("Payment Login or Guest Selection", () => {
    return (
      <Container>
        <ThemeProvider theme={theme}>
          <PaymentsLoginOrGuest handleNext={onClickFunc} handleLogin={onClickFunc} />
        </ThemeProvider>
      </Container>
    );
  })
  .add("Payment Success", () => {
    return (
      <Container>
        <ThemeProvider theme={theme}>
          <PaymentsSuccess newsroomName={"Coda Story"} usdToSpend={2} handleClose={onClickFunc} />
        </ThemeProvider>
      </Container>
    );
  });
