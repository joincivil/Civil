import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { PaymentsAmount } from "./PaymentsAmount";
import { PaymentsOptions } from "./PaymentsOptions";
import { PaymentsLoginOrGuest } from "./PaymentsLoginOrGuest";
import { PaymentsSuccess } from "./PaymentsSuccess";
import { PaymentsApplePay } from "./PaymentsApplePay";
import { PaymentsGooglePay } from "./PaymentsGooglePay";

const Container = styled.div`
  width: 400px;
`;

const suggestedAmounts = [{ amount: "1" }, { amount: "2" }, { amount: "3" }, { amount: "5" }];

const onClickFunc = () => {
  console.log("clicked");
};

storiesOf("Boost / Payments", module)
  .add("Payment Type", () => {
    return (
      <Container>
        <PaymentsOptions usdToSpend={1} isStripeConnected={true} handleNext={onClickFunc} />
      </Container>
    );
  })
  .add("Payment Amount", () => {
    return (
      <Container>
        <PaymentsAmount newsroomName={"Coda Story"} suggestedAmounts={suggestedAmounts} handleAmount={onClickFunc} />
      </Container>
    );
  })
  .add("Payment Login or Guest Selection", () => {
    return (
      <Container>
        <PaymentsLoginOrGuest handleNext={onClickFunc} handleLogin={onClickFunc} />
      </Container>
    );
  })
  .add("Payment Success", () => {
    return (
      <Container>
        <PaymentsSuccess newsroomName={"Coda Story"} usdToSpend={2} handleClose={onClickFunc} />
      </Container>
    );
  })
  .add("Apple Pay Screen", () => {
    return (
      <Container>
        <PaymentsApplePay newsroomName={"Coda Story"} usdToSpend={2} handleEditPaymentType={onClickFunc} />
      </Container>
    );
  })
  .add("Google Pay Screen", () => {
    return (
      <Container>
        <PaymentsGooglePay newsroomName={"Coda Story"} usdToSpend={2} handleEditPaymentType={onClickFunc}  />
      </Container>
    );
  });
