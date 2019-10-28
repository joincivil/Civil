import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { PaymentsAmount } from "./PaymentsAmount";
import { PaymentsOptions } from "./PaymentsOptions";
import { PaymentsWrapper } from "./PaymentsWrapper";
import { PaymentsLogin } from "./PaymentsLogin";
import { PaymentSuccessText } from "./PaymentsTextComponents";

const Container = styled.div`
  width: 400px;
`;

const suggestedAmounts = [{ amount: "1" }, { amount: "2" }, { amount: "3" }, { amount: "5" }];

const onClickFunc = () => {
  console.log("clicked");
};

storiesOf("Pulse / Payments", module)
  .add("Payment Type", () => {
    return (
      <Container>
        <PaymentsWrapper newsroomName={"Coda Story"} usdToSpend={3}>
          <PaymentsOptions usdToSpend={1} isStripeConnected={true} handleNext={onClickFunc} />
        </PaymentsWrapper>
      </Container>
    );
  })
  .add("Payment Amount", () => {
    return (
      <Container>
        <PaymentsWrapper newsroomName={"Coda Story"}>
          <PaymentsAmount newsroomName={"Coda Story"} suggestedAmounts={suggestedAmounts} handleAmount={onClickFunc} />
        </PaymentsWrapper>
      </Container>
    );
  })
  .add("Payment Login", () => {
    return (
      <Container>
        <PaymentsLogin handleNext={onClickFunc} handleLogin={onClickFunc} />
      </Container>
    );
  })
  .add("Payment Success", () => {
    return (
      <Container>
        <PaymentSuccessText newsroomName={"Coda Story"} usdToSpend={2} />
      </Container>
    );
  });
