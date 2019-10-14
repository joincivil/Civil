import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { PaymentsAmount } from "./PaymentsAmount";

const Container = styled.div`
  width: 400px;
`;

const contributors = [
  { amount: "1" },
  { amount: "2" },
  { amount: "3" },
  { amount: "5" },
];

storiesOf("Pulse / Payments", module)
  .add("Payment Amount Selection", () => {
    return (
      <Container>
        <PaymentsAmount newsroomName={"Coda Story"} suggestedAmounts={contributors} />
      </Container>
    );
  });
