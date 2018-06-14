import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { CountdownTimer } from "./PhaseCountdown";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
`;

const Container: React.StatelessComponent = ({ children }) => <StyledDiv>{children}</StyledDiv>;
const now = Date.now() / 1000;
const eightDaysFromNow = now + 86400 * 8;

storiesOf("Application Phase Countdown Timer", module).add("Timers", () => {
  return (
    <Container>
      {process.env.NODE_ENV !== "test" && (
        <>
          <h3>Base style</h3>
          <CountdownTimer endTime={eightDaysFromNow} />

          <h3>Warning style</h3>
          <CountdownTimer endTime={eightDaysFromNow} warn={true} />

          <h3>Ended</h3>
          <CountdownTimer endTime={now} />
        </>
      )}
    </Container>
  );
});
