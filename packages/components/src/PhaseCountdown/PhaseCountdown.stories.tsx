import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { TextCountdownTimer, ProgressBarCountdownTimer } from "./index";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
`;

const Container: React.StatelessComponent = ({ children }) => <StyledDiv>{children}</StyledDiv>;
const now = Date.now() / 1000;
const oneDay = 86400;

storiesOf("Application Phase Countdown Timer", module)
  .add("Text Timers", () => {
    const eightDaysFromNow = now + oneDay * 8;

    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <>
            <h3>Base style</h3>
            <TextCountdownTimer endTime={eightDaysFromNow} />

            <h3>Warning style</h3>
            <TextCountdownTimer endTime={eightDaysFromNow} warn={true} />

            <h3>Ended</h3>
            <TextCountdownTimer endTime={now} />
          </>
        )}
      </Container>
    );
  })
  .add("Progress Bar Timers", () => {
    const shortTotalSeconds = 60 * 1;
    const shortEndTime = now + shortTotalSeconds * 0.65;
    const totalSeconds = oneDay * 8;
    const endTime = now + oneDay * 3.5;
    const flavorText = "under community review";
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <>
            <h3>A Short Phase</h3>
            <p>The animation is more visible</p>
            <ProgressBarCountdownTimer
              endTime={shortEndTime}
              totalSeconds={shortTotalSeconds}
              flavorText={flavorText}
              displayLabel="Waiting for approval"
            />

            <h3>A Long Phase</h3>
            <ProgressBarCountdownTimer
              endTime={endTime}
              totalSeconds={totalSeconds}
              flavorText={flavorText}
              displayLabel="Waiting for approval"
            />
          </>
        )}
      </Container>
    );
  });
