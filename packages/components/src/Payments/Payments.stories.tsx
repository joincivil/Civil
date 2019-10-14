import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { PaymentsAmount } from "./PaymentsAmount";

const Container = styled.div`
  width: 400px;
`;

const suggestedAmounts = [{ amount: "1" }, { amount: "2" }, { amount: "3" }, { amount: "5" }];

const onClickFunc = () => {
  console.log("clicked");
};

storiesOf("Pulse / Payments", module).add("Payment Amount Selection", () => {
  return (
    <Container>
      <PaymentsAmount newsroomName={"Coda Story"} suggestedAmounts={suggestedAmounts} handleAmount={onClickFunc} />
    </Container>
  );
});
