import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { Payments } from "./Payments";

const Container = styled.div`
  display: flex;
  width: 400px;
`;

storiesOf("Pulse / Payments", module).add("Payments", () => {
  return (
    <Container>
      <Payments
        amount={"3"}
        newsroomMultisig={"0xe1e345504d9cd4d19bee9c0300a8c8265e62b17c"}
        newsroomName={"Coda Story"}
      />
    </Container>
  );
});
